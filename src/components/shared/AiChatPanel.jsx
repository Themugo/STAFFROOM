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
        isUser ? "text-white rounded-br-sm" : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
      )} style={isUser ? { background: "#0F1B2D" } : {}}>
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-p:leading-relaxed"
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
        {message.tool_calls?.some(t => t.status === "running" || t.status === "in_progress") && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            Looking up data…
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiChatPanel({ agentName, title, subtitle, suggestions = [], onClose }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [initError, setInitError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const initConversation = async () => {
    let unsub;
    setInitError(null);
    try {
      const conv = await base44.agents.createConversation({ agent_name: agentName, metadata: { name: title } });
      setConversation(conv);
      unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
      });
    } catch {
      // Without this, a failed createConversation call left `conversation`
      // null forever with zero feedback — every message typed would just
      // silently no-op against the `!conversation` guard in sendMessage(),
      // and the panel would look broken with no explanation.
      setInitError("Couldn't start the chat. Please try again.");
    }
    return unsub;
  };

  useEffect(() => {
    let unsub;
    initConversation().then(u => { unsub = u; });
    return () => { if (unsub) unsub(); };
  }, [agentName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || !conversation || loading) return;
    setInput("");
    setSendError(null);
    setLoading(true);
    try {
      await base44.agents.addMessage(conversation, { role: "user", content: msg });
    } catch {
      // Previously this had no catch at all: a failed send left `loading`
      // stuck true forever (typing indicator shown permanently, Send button
      // permanently disabled since it's gated on `loading`), and the
      // message the user typed was already cleared from the input and just
      // silently lost. Now it's restored so they don't have to retype it.
      setInput(msg);
      setSendError("Message didn't send. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const visibleMessages = messages.filter(m => m.role === "user" || m.role === "assistant");
  const lastIsUser = visibleMessages[visibleMessages.length - 1]?.role === "user";

  return (
    <div className={cn(
      "fixed z-50 flex flex-col bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl transition-all duration-300",
      expanded ? "inset-4 md:inset-8" : "bottom-6 right-6 w-[380px] h-[560px]"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-t-2xl border-b border-gray-100 bg-white">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#D4A843" }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 truncate">{subtitle}</p>
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
            <Button size="sm" variant="outline" className="mt-3" onClick={initConversation}>
              Retry
            </Button>
          </div>
        )}
        {!initError && visibleMessages.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#D4A843" }}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            <div className="flex flex-col gap-2 mt-4">
              {suggestions.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {visibleMessages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
        {loading && lastIsUser && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#D4A843" }}>
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 150, 300].map(d => (
                <div key={d} className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions (early in convo) */}
      {visibleMessages.length > 0 && visibleMessages.length < 5 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {suggestions.slice(0, 3).map(s => (
            <button key={s} onClick={() => sendMessage(s)}
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
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask a question…"
            disabled={!conversation}
            className="border-0 shadow-none focus-visible:ring-0 text-sm h-8 bg-transparent"
          />
          <Button onClick={() => sendMessage()} disabled={!input.trim() || loading || !conversation} size="sm"
            className="h-8 w-8 p-0 rounded-lg text-white flex-shrink-0" style={{ background: "#0F1B2D" }}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}