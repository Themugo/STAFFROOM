import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Search,
  X,
  ChevronRight,
  Filter,
  Sparkles,
  User,
  FileText,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Plane
} from 'lucide-react';
import { GLOBAL_SEARCH_ITEMS } from '@/data/globalSearchData';

const FILTER_TABS = [
  { id: 'ALL', label: 'All Results' },
  { id: 'Module', label: 'HR Modules' },
  { id: 'Employee', label: 'Employees' },
  { id: 'SOP', label: 'SOP Documents' },
  { id: 'Action', label: 'Quick Actions' }
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setActiveTab('ALL');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = GLOBAL_SEARCH_ITEMS.filter(item => {
    const matchesTab = activeTab === 'ALL' || item.type === activeTab;
    const q = query.toLowerCase().trim();
    if (!q) return matchesTab;
    return matchesTab && (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item) => {
    navigate(createPageUrl(item.page));
    onClose(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-[#102A43]/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans"
      onClick={() => onClose(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl border border-[#DCE6F2] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#DCE6F2] bg-white">
          <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search HR modules, employee profiles, or internal SOP documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-[#102A43] placeholder-[#7890A8] text-sm font-semibold focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-bold text-[#7890A8] hover:text-[#102A43] px-2 py-1 rounded-md bg-[#F6F9FD]"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => onClose(false)}
            className="p-1.5 rounded-xl text-[#7890A8] hover:text-[#102A43] hover:bg-[#F3F7FC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#F6F9FD] border-b border-[#DCE6F2] overflow-x-auto custom-scrollbar shrink-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7890A8] mr-1 flex items-center gap-1 shrink-0">
            <Filter size={11} /> Filter:
          </span>
          {FILTER_TABS.map((tab) => {
            const count = tab.id === 'ALL'
              ? GLOBAL_SEARCH_ITEMS.length
              : GLOBAL_SEARCH_ITEMS.filter(i => i.type === tab.id).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] border border-[#DCE6F2]'
                }`}
              >
                {tab.label} <span className={isActive ? 'opacity-80' : 'text-[#7890A8]'}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar min-h-[250px]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="group flex items-start justify-between gap-3 p-3 rounded-xl border border-transparent hover:border-[#2563EB]/30 hover:bg-[#EAF3FF]/60 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'Module' ? 'bg-[#EAF3FF] text-[#2563EB]' :
                      item.type === 'Employee' ? 'bg-indigo-50 text-indigo-600' :
                      item.type === 'SOP' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-xs text-[#102A43] group-hover:text-[#2563EB] transition-colors">
                          {item.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                          item.type === 'Module' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                          item.type === 'Employee' ? 'bg-indigo-100 text-indigo-700' :
                          item.type === 'SOP' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.badge}
                        </span>
                        {item.category && (
                          <span className="text-[10px] text-[#7890A8] font-semibold hidden sm:inline">
                            • {item.category}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#52677F] mt-0.5 line-clamp-1">
                        {item.description}
                      </p>

                      {item.subtitle && (
                        <p className="text-[10px] font-semibold text-[#7890A8] mt-1 flex items-center gap-2">
                          <span>{item.subtitle}</span>
                          {item.meta && <span>• {item.meta}</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-center">
                    <span className="text-[10px] font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                      Jump To
                    </span>
                    <ChevronRight size={16} className="text-[#7890A8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-2">
              <Search className="w-10 h-10 text-[#7890A8] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#102A43]">No matching items found</p>
              <p className="text-xs text-[#52677F] max-w-sm mx-auto">
                Try searching for HR modules like "Payroll" or "Onboarding", staff names like "Sarah", or SOPs like "Remote Work".
              </p>
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="bg-[#F6F9FD] px-4 py-2.5 border-t border-[#DCE6F2] flex items-center justify-between text-xs text-[#52677F]">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-[#2563EB]" />
            <span className="font-semibold text-[11px]">STAFFROOM Global Index</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#7890A8]">
            <span>Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#DCE6F2] font-bold text-[#102A43]">⌘K</kbd> to toggle</span>
            <span><kbd className="bg-white px-1.5 py-0.5 rounded border border-[#DCE6F2] font-bold text-[#102A43]">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
