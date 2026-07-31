import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 animate-pulse border-b border-slate-100 dark:border-slate-800">
      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-1/3" />
      </div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
