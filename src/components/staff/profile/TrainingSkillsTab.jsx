import { GraduationCap, Award, CheckCircle2, Star, Sparkles, BookOpen, Layers } from "lucide-react";

export function TrainingSkillsTab({ certifications = [], trainingRecords = [] }) {
  const skills = [
    { name: "Strategic HR Management", level: 5, category: "Core HR" },
    { name: "Labor Law & Compliance", level: 5, category: "Legal" },
    { name: "Workday & HR Analytics", level: 4, category: "Systems" },
    { name: "Compensation Architecture", level: 4, category: "Finance" },
    { name: "Conflict Resolution & Mediation", level: 5, category: "Soft Skills" },
  ];

  const languages = [
    { name: "English", proficiency: "Native / Bilingual" },
    { name: "Spanish", proficiency: "Professional Working" },
  ];

  return (
    <div className="space-y-6">
      {/* Skill Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          Competency & Skill Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((s) => (
            <div key={s.name} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{s.name}</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                  Level {s.level} / 5
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-2 flex-1 rounded-full ${
                      lvl <= s.level ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          Language Proficiency
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {languages.map((l) => (
            <div key={l.name} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">{l.name}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{l.proficiency}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & Enrolled Courses */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-500" />
          Active Certifications & Training Progress
        </h3>

        <div className="space-y-3">
          {(trainingRecords || []).map((t) => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-slate-100">{t.course}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.status === "Completed" ? `Completed on ${t.completedDate}` : `Progress: ${t.progress}%`}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  t.status === "Completed"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
