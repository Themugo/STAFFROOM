import React, { useState } from 'react';
import { Bot, Sparkles, Send, ArrowRight, BarChart3, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AIConversation() {
  const [activeTab, setActiveTab] = useState('budget');

  const conversationExamples = {
    budget: {
      query: "Which departments are over budget on overtime this month?",
      response: "Operations (+18%) and Logistics (+12%) are above budget. Weekend shifts are the primary driver.",
      flagged: "3 employees flagged for elevated workload.",
      actions: ["Analyze", "Take Action"]
    },
    risk: {
      query: "Flag any employees at risk of burnout or attendance drops.",
      response: "Identified 3 supervisors in Logistics with >60 hrs worked over 3 consecutive weeks.",
      flagged: "Shift rebalancing recommended for Mombasa hub.",
      actions: ["Analyze", "Rebalance Shifts"]
    },
    payroll: {
      query: "Summarize KRA iTax P10 payroll tax deductions for July.",
      response: "July gross payroll is KSh 4.2M. KRA PAYE: KSh 890,400, NSSF: KSh 216,000, SHIF: KSh 115,200.",
      flagged: "All statutory line items verified for bank disbursal.",
      actions: ["Export P10", "Disburse"]
    }
  };

  const activeData = conversationExamples[activeTab];

  return (
    <div className="w-full rounded-2xl bg-white border border-[#DCE6F2] shadow-xl overflow-hidden text-[#102A43] font-sans">
      {/* Top Header */}
      <div className="px-5 py-3.5 bg-[#F6F9FD] border-b border-[#DCE6F2] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#6366F1] text-white">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#102A43]">StaffRoom AI Assistant</span>
              <span className="px-2 py-0.5 rounded bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-mono font-bold">
                Enterprise AI
              </span>
            </div>
            <span className="text-[11px] text-[#159A68] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#159A68]" /> Grounded in Enterprise Data
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-[#EAF3FF] p-1 rounded-xl border border-[#DCE6F2] text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer ${activeTab === 'budget' ? 'bg-[#2563EB] text-white' : 'text-[#52677F]'}`}
          >
            Overtime
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer ${activeTab === 'risk' ? 'bg-[#2563EB] text-white' : 'text-[#52677F]'}`}
          >
            Burnout Risk
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer ${activeTab === 'payroll' ? 'bg-[#2563EB] text-white' : 'text-[#52677F]'}`}
          >
            Statutory
          </button>
        </div>
      </div>

      {/* Conversation Window */}
      <div className="p-5 space-y-4 bg-white">
        {/* User Query */}
        <div className="flex justify-end">
          <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tr-none bg-[#2563EB] text-white text-xs sm:text-sm font-medium leading-relaxed shadow-xs">
            {activeData.query}
          </div>
        </div>

        {/* AI Response */}
        <div className="flex justify-start">
          <div className="max-w-[92%] p-4 rounded-2xl rounded-tl-none bg-[#F6F9FD] border border-[#DCE6F2] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6366F1]">
              <Sparkles size={14} className="text-[#6366F1]" />
              <span>StaffRoom Intelligence</span>
            </div>

            <p className="text-xs sm:text-sm text-[#102A43] leading-relaxed font-medium">
              {activeData.response}
            </p>

            {/* Sub-card Alert */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={14} className="text-[#D98B00] shrink-0" />
              <span>{activeData.flagged}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {activeData.actions.map((act, i) => (
                <button
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{act}</span>
                  <ArrowRight size={13} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value="Ask questions or request workflows in plain English..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] text-[#7890A8] text-xs focus:outline-none"
          />
          <button className="p-2.5 rounded-xl bg-[#2563EB] text-white font-bold cursor-pointer">
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AISection() {
  const capabilities = [
    { title: 'AI Copilot', desc: 'Conversational assistant that drafts policies, answers HR queries, and guides managers.' },
    { title: 'Predictive Insights', desc: 'Forecast attrition risk, absenteeism trends, and headcount needs with ML models.' },
    { title: 'Smart Automation', desc: 'Auto-route approvals, trigger reminders, and resolve routine requests automatically.' },
    { title: 'Natural Language', desc: 'Ask complex organizational questions in plain English and get instant answers.' },
    { title: 'Advanced Analytics', desc: 'Dynamic dashboards that surface anomalies, benchmark performance, and explain trends.' },
    { title: 'Actionable Intelligence', desc: 'Proactive recommendations that guide execution without administrative drag.' },
  ];

  return (
    <section id="ai" className="py-20 lg:py-28 bg-[#EAF3FF] text-[#102A43] border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-white border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            ORGANIZATIONAL INTELLIGENCE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#102A43]">
            INTELLIGENCE BUILT INTO THE WAY YOUR ORGANIZATION WORKS.
          </h2>
          <p className="text-base sm:text-lg text-[#52677F]">
            Ask questions, understand patterns and take action without leaving StaffRoom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left AI Capabilities (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {capabilities.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-[#DCE6F2] hover:border-[#2563EB] transition-all space-y-1 shadow-2xs"
              >
                <div className="flex items-center gap-2 font-extrabold text-sm text-[#102A43]">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>{c.title}</span>
                </div>
                <p className="text-xs text-[#52677F] leading-relaxed pl-4 font-medium">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right AI Conversation Visualizer (7 cols) */}
          <div className="lg:col-span-7">
            <AIConversation />
          </div>

        </div>

      </div>
    </section>
  );
}
