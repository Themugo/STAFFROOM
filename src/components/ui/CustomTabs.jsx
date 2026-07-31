import React from 'react';

/**
 * Custom Tab bar component used in analytics and workforce tools.
 */
export default function CustomTabs({ tabs = [], active, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit">
      {tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id;
        const label = typeof tab === 'string' ? tab : tab.label;
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange && onChange(id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
