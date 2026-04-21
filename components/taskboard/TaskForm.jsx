import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Calendar, Flag, Tag as TagIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/TaskContext';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITIES = [
  { value: 'high', label: 'High', color: 'text-red-500' },
  { value: 'medium', label: 'Medium', color: 'text-orange-500' },
  { value: 'low', label: 'Low', color: 'text-green-500' },
];

const SUGGESTED_TAGS = ['frontend', 'backend', 'design', 'mobile', 'testing', 'docs', 'bug', 'feature'];

export default function TaskForm({ task, initialStatus, onClose }) {
  const { dispatch, allTags } = useTaskStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: initialStatus || 'pending',
    priority: 'medium',
    tags: [],
    dueDate: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [tagDropdown, setTagDropdown] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        tags: task.tags || [],
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    }
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [task]);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function addTag(tag) {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (clean && !form.tags.includes(clean)) {
      setForm(f => ({ ...f, tags: [...f.tags, clean] }));
    }
    setTagInput('');
  }

  function removeTag(tag) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      setForm(f => ({ ...f, tags: f.tags.slice(0, -1) }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, ...payload } });
    } else {
      dispatch({ type: 'ADD_TASK', payload });
    }
    onClose();
  }

  const availableTags = [...new Set([...SUGGESTED_TAGS, ...allTags])].filter(
    t => !form.tags.includes(t) && (!tagInput || t.includes(tagInput.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl p-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-border">
            <h2 className="font-semibold text-xl">{task ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={onClose} className="p-3 rounded-xl hover:bg-muted transition-colors">
              <X size={24} className="text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title */}
            <div>
              <input
                ref={titleRef}
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Task title..."
                className="w-full bg-transparent text-2xl font-bold placeholder:text-muted-foreground/50 outline-none border-b border-border pb-4 focus:border-primary transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Add a description..."
                rows={4}
                className="w-full bg-muted/50 rounded-2xl px-6 py-6 text-lg placeholder:text-muted-foreground/50 outline-none resize-none border border-transparent focus:border-primary/40 transition-colors"
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-lg font-semibold text-muted-foreground mb-4 block flex items-center gap-2">
                  Status
                </label>
                <div className="flex flex-col gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set('status', s.value)}
                      className={cn(
                        'text-lg px-8 py-4 rounded-2xl border text-left transition-all shadow-sm hover:shadow-md',
                        form.status === s.value
                          ? 'border-primary bg-accent text-accent-foreground font-semibold'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-lg font-semibold text-muted-foreground mb-4 block flex items-center gap-2">
                  Priority
                </label>
                <div className="flex flex-col gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => set('priority', p.value)}
                      className={cn(
                        'text-lg px-8 py-4 rounded-2xl border text-left transition-all shadow-sm hover:shadow-md flex items-center gap-3',
                        form.priority === p.value
                          ? 'border-primary bg-accent text-accent-foreground font-semibold'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      )}
                    >
                      <Flag size={24} className={form.priority === p.value ? p.color : ''} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-lg font-semibold text-muted-foreground mb-4 block flex items-center gap-2">
                <Calendar size={24} /> Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
                className="bg-muted/50 border border-transparent focus:border-primary/40 rounded-2xl px-8 py-6 text-xl outline-none transition-colors w-full font-semibold"
              />
            </div>

            {/* Tags */}
            <div className="relative">
              <label className="text-lg font-semibold text-muted-foreground mb-4 block flex items-center gap-2">
                <TagIcon size={24} /> Tags
              </label>
              <div className="flex flex-wrap gap-3 bg-muted/50 rounded-2xl px-6 py-6 border border-transparent focus-within:border-primary/40 transition-colors min-h-[80px]">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl text-base font-semibold shadow-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X size={16} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={e => { setTagInput(e.target.value); setTagDropdown(true); }}
                  onKeyDown={handleTagKeyDown}
                  onFocus={() => setTagDropdown(true)}
                  onBlur={() => setTimeout(() => setTagDropdown(false), 150)}
                  placeholder={form.tags.length === 0 ? 'Add tags (press Enter or ,)...' : ''}
                  className="flex-1 min-w-[200px] bg-transparent text-lg outline-none placeholder:text-muted-foreground/50 font-semibold"
                />
              </div>

              {tagDropdown && availableTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 z-10 mt-2 bg-popover border border-border rounded-2xl shadow-xl p-4 flex flex-wrap gap-2"
                >
                  {availableTags.slice(0, 10).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onMouseDown={() => addTag(tag)}
                      className="text-base px-6 py-3 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground transition-all shadow-sm hover:shadow-md font-semibold"
                    >
                      + {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-6 rounded-2xl border border-border text-xl font-semibold hover:bg-muted transition-all shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-6 rounded-2xl bg-primary text-primary-foreground text-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
