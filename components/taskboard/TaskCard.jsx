import React from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Calendar, Flag, Tag, GripVertical, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/TaskContext';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
  medium: { label: 'Medium', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  low: { label: 'Low', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
};

const TAG_COLORS = [
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
];

function tagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function TaskCard({ task, onEdit, dragHandleProps, isDragging }) {
  const { dispatch, selectedIds } = useTaskStore();
  const isSelected = selectedIds.includes(task.id);
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && task.status !== 'completed';
  const isDueToday = dueDateObj && isToday(dueDateObj);

  function handleDelete(e) {
    e.stopPropagation();
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  }

  function handleSelect(e) {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_SELECT', payload: task.id });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={cn(
        'group relative bg-card border rounded-2xl p-6 cursor-pointer shadow-md text-base',
        'hover:shadow-md transition-all duration-200',
        isDragging && 'shadow-xl rotate-1 scale-105 opacity-90',
        isSelected && 'ring-2 ring-primary border-primary/50',
        !isSelected && 'border-border hover:border-border/80'
      )}
      onClick={() => onEdit(task)}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing"
        onClick={e => e.stopPropagation()}
      >
        <GripVertical size={16} className="text-muted-foreground" />
      </div>

      {/* Select checkbox */}
      <button
        onClick={handleSelect}
        className={cn(
          'absolute top-3 right-3 w-4 h-4 rounded border-2 transition-all duration-150',
          isSelected
            ? 'bg-primary border-primary'
            : 'border-border opacity-0 group-hover:opacity-100 hover:border-primary/50'
        )}
      >
        {isSelected && <span className="flex items-center justify-center text-primary-foreground text-[9px] font-bold">✓</span>}
      </button>

      {/* Priority indicator */}
      <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2.5', p.bg, p.border, 'border')}>
        <Flag size={10} className={p.color} />
        <span className={p.color}>{p.label}</span>
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-semibold text-base leading-tight mb-2 pr-8',
        task.status === 'completed' && 'line-through text-muted-foreground'
      )}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => (
            <span key={tag} className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium', tagColor(tag))}>
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        {dueDateObj ? (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            isOverdue ? 'text-red-500' : isDueToday ? 'text-orange-500' : 'text-muted-foreground'
          )}>
            <Calendar size={11} />
            <span>{isOverdue ? 'Overdue · ' : isDueToday ? 'Today · ' : ''}{format(dueDateObj, 'MMM d')}</span>
          </div>
        ) : <span />}

        <button
          onClick={handleDelete}
className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all duration-150 h-10 w-10 flex items-center justify-center"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}