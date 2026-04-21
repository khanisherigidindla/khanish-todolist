import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskCard from '@/components/taskboard/TaskCard';

const COLUMN_CONFIG = {
  pending: {
    label: 'Pending',
    accent: 'bg-amber-400',
    headerBg: 'bg-amber-50 dark:bg-amber-900/20',
    dot: 'bg-amber-400',
    countBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  },
  'in-progress': {
    label: 'In Progress',
    accent: 'bg-blue-500',
    headerBg: 'bg-blue-50 dark:bg-blue-900/20',
    dot: 'bg-blue-500',
    countBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  },
  completed: {
    label: 'Completed',
    accent: 'bg-emerald-500',
    headerBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    dot: 'bg-emerald-500',
    countBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
};

export default function TaskColumn({ status, tasks, onEdit, onAddTask }) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className="flex flex-col min-w-[340px] sm:min-w-[400px] lg:min-w-[450px] xl:min-w-[500px] w-full flex-1 max-h-[600px] overflow-y-auto scrollbar-thin">


      {/* Column header */}
      <div className={cn('flex items-center justify-between px-4 py-3 rounded-xl mb-3', config.headerBg)}>
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', config.dot)} />
        <span className="font-semibold text-base">{config.label}</span>
        <span className={cn('text-sm font-semibold px-3 py-1 rounded-full', config.countBg)}>
          {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 min-h-[120px] max-h-[500px] overflow-y-auto space-y-2.5 p-2 rounded-xl transition-colors duration-200',
              snapshot.isDraggingOver && 'bg-primary/5 ring-2 ring-primary/20'
            )}
          >
            <AnimatePresence>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                    >
                      <TaskCard
                        task={task}
                        onEdit={onEdit}
                        dragHandleProps={dragProvided.dragHandleProps}
                        isDragging={dragSnapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                  <span className="text-lg opacity-40">
                    {status === 'pending' ? '📋' : status === 'in-progress' ? '⚡' : '✅'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">No tasks here</p>
                <button
                  onClick={() => onAddTask(status)}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Add one
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}