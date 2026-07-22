import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Sparkles, X, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "#D4A843" }}>
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
        isUser
          ? "text-white rounded-br-sm"
          : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
      )} style={isUser ? { background: "#0F1B2D" } : {}}>
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-p:leading-relaxed prose-li:leading-relaxed"
            components={{
              p: ({ children }) => <p className="my-1">{children}</p>,
              ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
              ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
              li: ({ children }) => <li className="my-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {message.tool_calls?.filter(t => t.status === "running" || t.status === "in_progress").length > 0 && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            Looking up data…
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiAssistantPanel({ onClose }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [initError, setInitError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let unsub;
    initConversation().then(u => { unsub = u; });
    // Previously `useEffect(() => { initConversation(); }, [])` returned
    // nothing — initConversation's own `return () => unsub()` became the
    // *resolved value of the promise it returns*, not the useEffect's
    // cleanup function, since initConversation is async. React had no
    // cleanup function to call on unmount at all, so the
    // subscribeToConversation subscription was never torn down — a real
    // leak every time this panel was opened and closed.
    return () => { if (unsub) unsub(); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    setInitError(null);
    try {
      const conv = await base44.agents.createConversation({
        agent_name: "leave_assistant",
        metadata: { name: "Leave Assistant" },
      });
      setConversation(conv);

      const unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
      });

      // Previously auto-sent "Hello! I need help with leave management." as
      // a *user* message on every mount. That meant messages.length was
      // never really 0 after init, so the empty-state welcome UI below
      // (avatar, "Hi! I'm your Leave Assistant", suggestion chips) almost
      // never actually rendered in practice — it'd flash and immediately
      // get replaced once the synthetic greeting's reply came back. It also
      // recorded a message in the conversation history attributed to the
      // user that the user never typed. The sibling AiChatPanel.jsx (same
      // pattern, same author) doesn't do this — its empty state is the
      // actual entry point, which is the more coherent design. Removed the
      // auto-send; the empty state now serves as the real greeting.

      return unsub;
    } catch {
      setInitError("Couldn't start the chat. Please try again.");
      return undefined;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversation || loading) return;
    const text = input.trim();
    setInput("");
    setSendError(null);
    setLoading(true);
    try {
      await base44.agents.addMessage(conversation, { role: "user", content: text });
    } catch {
      setInput(text);
      setSendError("Message didn't send. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SUGGESTIONS = [
    "What's my annual leave balance?",
    "Help me request next week off",
    "What's the sick leave policy?",
  ];

  const visibleMessages = messages.filter(m => m.role === "user" || m.role === "assistant");

  return (
    <div className={cn(
      "fixed z-50 flex flex-col bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl transition-all duration-300",
      expanded
        ? "inset-4 md:inset-8"
        : "bottom-6 right-6 w-[380px] h-[560px]"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-t-2xl border-b border-gray-100 bg-white">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#D4A843" }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Leave Assistant</p>
          <p className="text-xs text-gray-400">AI-powered · always here to help</p>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="text-gray-400 hover:text-gray-600 p-1">
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {initError && (
          <div className="text-center py-6">
            <p className="text-sm font-medium text-red-600">{initError}</p>
            <button onClick={initConversation}
              className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
              Retry
            </button>
          </div>
        )}
        {!initError && visibleMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#D4A843" }}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">Hi! I'm your Leave Assistant</p>
            <p className="text-xs text-gray-400 mt-1">Ask me about balances, policies, or help drafting a request.</p>
            <div className="flex flex-col gap-2 mt-4">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {visibleMessages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && visibleMessages[visibleMessages.length - 1]?.role === "user" && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#D4A843" }}>
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions (when there are messages) */}
      {visibleMessages.length > 0 && visibleMessages.length < 6 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setInput(s)}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-white transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        {sendError && <p className="text-xs text-red-600 mb-1.5">{sendError}</p>}
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1.5">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about leave…"
            disabled={!conversation}
            className="border-0 shadow-none focus-visible:ring-0 text-sm h-8 bg-transparent"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading || !conversation}
            size="sm"
            className="h-8 w-8 p-0 rounded-lg text-white flex-shrink-0"
            style={{ background: "#0F1B2D" }}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}