import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Sun, Moon, Undo2, Redo2, Trash2, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/TaskContext';
import TaskForm from '@/components/taskboard/TaskForm';

export default function Header() {
  const { searchQuery, dispatch, toggleTheme, theme, canUndo, canRedo, selectedIds } = useTaskStore();
  const [showForm, setShowForm] = useState(false);
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const quotes = [
    "Vision without action is a daydream.",
    "Discipline beats motivation every single day.",
    "Wake up with a purpose today.",
    "Success starts with a single step.",
    "Hustle until your idols become rivals.",
    "Great things never come from comfort zones.",
    "Focus on progress, not perfection.",
    "Be the energy you want to attract.",
    "Hard work beats talent when talent doesn't work hard.",
    "The secret of getting ahead is getting started.",
    "Your future self will thank you for today.",
    "Don't wait for opportunity, create it.",
    "Results happen over time, not overnight.",
    "Consistency is the bridge between goals and accomplishment.",
    "🚀 Key takeaway: Motivation gets you going; discipline keeps you growing.",
    "To help you stay focused on your specific goal, tell me:",
    "What milestone you're aiming for next.",
    "If you need a short-term or long-term plan.",
    "Small daily improvements create stunning results.",
    "The best way to predict the future is to create it."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  const hasSelection = selectedIds.length > 0;

  function handleBulkDelete() {
    if (window.confirm(`Delete ${selectedIds.length} task(s)?`)) {
      dispatch({ type: 'DELETE_BULK', payload: selectedIds });
    }
  }

  function handleBulkMove(status) {
    dispatch({ type: 'MOVE_BULK', payload: { ids: selectedIds, status } });
    setBulkMoveOpen(false);
  }

  return (
    <>
      <header className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">T</span>
          </div>
          <span className="font-bold text-sm hidden sm:block">TaskFlow</span>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[220px] relative max-w-xl">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            placeholder="Search tasks..."
            className="w-full bg-muted/60 border border-transparent focus:border-primary/30 rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Rotating Quote */}
        <motion.div 
          key={currentQuoteIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-xl lg:text-2xl italic text-purple-600 font-medium max-w-xl hidden sm:block ml-4"
        >
          "{quotes[currentQuoteIndex]}"
        </motion.div>

        <div className="flex flex-wrap items-center gap-1.5 ml-auto">
          {/* Bulk actions */}
          <AnimatePresence>
            {hasSelection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1"
              >
                <span className="text-xs text-muted-foreground px-2">{selectedIds.length} selected</span>
                <div className="relative">
                  <button
                    onClick={() => setBulkMoveOpen(o => !o)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <MoveRight size={13} /> Move
                  </button>
                  {bulkMoveOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-lg p-1 z-50 min-w-[130px]">
                      {['pending', 'in-progress', 'completed'].map(s => (
                        <button key={s} onClick={() => handleBulkMove(s)} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-muted capitalize transition-colors">
                          {s.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={13} /> Delete
                </button>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Undo / Redo */}
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} className="text-muted-foreground" />
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-8 rounded-3xl hover:bg-muted transition-all shadow-sm hover:shadow-md text-3xl h-14 w-14 flex items-center justify-center"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Add Task */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus size={22} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </header>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </>
  );
}
