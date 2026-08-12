export default function PageHeader({ title, description, actions, icon: Icon, badge }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#DCE6F2] dark:border-slate-800 shadow-2xs">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF3FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 shrink-0 shadow-2xs">
            <Icon size={22} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#102A43] dark:text-white">{title}</h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF3FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-[#2563EB]/20">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="text-xs sm:text-sm text-[#52677F] dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>}
    </div>
  );
}


