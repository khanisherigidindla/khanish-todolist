import React from 'react';
import { Filter, Tag, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/TaskContext';

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High', color: 'text-red-500' },
  { value: 'medium', label: 'Medium', color: 'text-orange-500' },
  { value: 'low', label: 'Low', color: 'text-green-500' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending', color: 'text-amber-500' },
  { value: 'in-progress', label: 'In Progress', color: 'text-blue-500' },
  { value: 'completed', label: 'Completed', color: 'text-emerald-500' },
];

function FilterSection({ title, icon: SectionIcon, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
        <SectionIcon size={11} />
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Sidebar({ className }) {
  const { filters, allTags, tasks, dispatch } = useTaskStore();
  const isFiltered = filters.status !== 'all' || filters.priority !== 'all' || filters.tags.length > 0;

  const counts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  function toggleTagFilter(tag) {
    const current = filters.tags;
    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
    dispatch({ type: 'SET_FILTER', key: 'tags', value: next });
  }

  return (
    <aside className={cn('w-80 flex flex-col h-full overflow-y-auto pr-2', className)}>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 mb-8 p-4 rounded-xl bg-muted/50">
        {[
          { label: 'Pending', value: 'pending', count: counts.pending, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'In Progress', value: 'in-progress', count: counts['in-progress'], color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Completed', value: 'completed', count: counts.completed, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => dispatch({ type: 'SET_FILTER', key: 'status', value: s.value })}
            className={cn(
'flex items-center justify-between px-8 py-6 rounded-3xl text-xl font-bold transition-all shadow-lg hover:shadow-xl',
              s.bg,
              'hover:opacity-80'
            )}
          >
            <span className={cn('font-medium', s.color)}>{s.label}</span>
            <span className={cn('text-xs font-bold', s.color)}>{s.count}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 p-2">
          <span className="text-lg font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-3">
            <Filter size={24} /> Filters
          </span>
        {isFiltered && (
          <button
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Status filter */}
      <FilterSection title="Status" icon={ChevronDown}>
              <div className="space-y-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => dispatch({ type: 'SET_FILTER', key: 'status', value: opt.value })}
                    className={cn(
                      'w-full text-left text-xl px-6 py-4 rounded-2xl transition-all flex items-center gap-4 hover:shadow-md shadow-sm',
                filters.status === opt.value
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {opt.color && <span className={cn('w-1.5 h-1.5 rounded-full', opt.color.replace('text-', 'bg-'))} />}
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Priority filter */}
      <FilterSection title="Priority" icon={Filter}>
        <div className="space-y-1.5">
          {PRIORITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => dispatch({ type: 'SET_FILTER', key: 'priority', value: opt.value })}
              className={cn(
                'w-full text-left text-xl px-6 py-4 rounded-2xl transition-all flex items-center gap-4 shadow-sm hover:shadow-md',
                filters.priority === opt.value
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {opt.color && <span className={cn('w-1.5 h-1.5 rounded-full', opt.color.replace('text-', 'bg-'))} />}
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <FilterSection title="Tags" icon={Tag}>
          <div className="flex flex-wrap gap-2 p-4 max-h-96 overflow-y-auto rounded-2xl bg-muted/30 scrollbar-thin">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTagFilter(tag)}
                className={cn(
                  'text-xl px-6 py-4 rounded-2xl border-2 transition-all shadow-md hover:shadow-xl font-bold min-w-[140px] hover:scale-105',
                  filters.tags.includes(tag)
                    ? 'bg-primary/10 border-primary/30 text-primary font-medium'
                    : 'bg-muted border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </aside>
  );
}