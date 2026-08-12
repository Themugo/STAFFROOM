import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF3FF] border border-[#2563EB]/20">
        <Icon size={28} className="text-[#2563EB]" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#102A43]">{title}</h3>
      {description && <p className="mt-1 text-xs text-[#52677F] max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
