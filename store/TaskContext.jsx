// TaskContext stub

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { storageService } from '@/services/storage';

const TaskContext = createContext(null);

const MAX_HISTORY = 30;

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK': {
      const newTask = storageService.addTask(action.payload);
      const newTasks = [...state.tasks, newTask];
      return pushHistory({ ...state, tasks: newTasks });
    }

    case 'UPDATE_TASK': {
      const updated = storageService.updateTask(action.payload);
      const newTasks = state.tasks.map(t => t.id === updated.id ? updated : t);
      return pushHistory({ ...state, tasks: newTasks });
    }

    case 'DELETE_TASK': {
      storageService.deleteTask(action.payload);
      const newTasks = state.tasks.filter(t => t.id !== action.payload);
      return pushHistory({ ...state, tasks: newTasks });
    }

    case 'DELETE_BULK': {
      storageService.deleteTasks(action.payload);
      const set = new Set(action.payload);
      const newTasks = state.tasks.filter(t => !set.has(t.id));
      return pushHistory({ ...state, tasks: newTasks, selectedIds: [] });
    }

    case 'MOVE_BULK': {
      const ids = new Set(action.payload.ids);
      const newTasks = state.tasks.map(t => {
        if (!ids.has(t.id)) return t;
        const updated = { ...t, status: action.payload.status };
        storageService.updateTask(updated);
        return updated;
      });
      return pushHistory({ ...state, tasks: newTasks, selectedIds: [] });
    }

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      storageService.saveTasks(previous);
      return {
        ...state,
        tasks: previous,
        past: state.past.slice(0, -1),
        future: [state.tasks, ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      storageService.saveTasks(next);
      return {
        ...state,
        tasks: next,
        past: [...state.past, state.tasks],
        future: state.future.slice(1),
      };
    }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };

    case 'RESET_FILTERS':
      return { ...state, filters: initialFilters };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'TOGGLE_SELECT': {
      const id = action.payload;
      const exists = state.selectedIds.includes(id);
      return {
        ...state,
        selectedIds: exists ? state.selectedIds.filter(s => s !== id) : [...state.selectedIds, id],
      };
    }

    case 'CLEAR_SELECTION':
      return { ...state, selectedIds: [] };

    case 'SELECT_ALL':
      return { ...state, selectedIds: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    default:
      return state;
  }
}

function pushHistory(state) {
  const past = [...state.past, state.tasks].slice(-MAX_HISTORY);
  return { ...state, past, future: [] };
}

const initialFilters = { status: 'all', priority: 'all', tags: [] };

const initialState = {
  tasks: [],
  filters: initialFilters,
  searchQuery: '',
  selectedIds: [],
  past: [],
  future: [],
  theme: 'light',
};

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('taskflow_theme') || 'light';
    dispatch({ type: 'SET_THEME', payload: saved });
    document.documentElement.classList.toggle('dark', saved === 'dark');
    const tasks = storageService.getTasks();
    dispatch({ type: 'LOAD_TASKS', payload: tasks });
  }, []);

  const toggleTheme = useCallback(() => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('taskflow_theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    dispatch({ type: 'SET_THEME', payload: next });
  }, [state.theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filteredTasks = React.useMemo(() => {
    let result = state.tasks;
    const { status, priority, tags } = state.filters;
    const q = state.searchQuery.toLowerCase().trim();

    if (status !== 'all') result = result.filter(t => t.status === status);
    if (priority !== 'all') result = result.filter(t => t.priority === priority);
    if (tags.length > 0) result = result.filter(t => tags.every(tag => t.tags?.includes(tag)));
    if (q) result = result.filter(t =>
      t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
    );

    return result;
  }, [state.tasks, state.filters, state.searchQuery]);

  const allTags = React.useMemo(() => {
    const tagSet = new Set();
    state.tasks.forEach(t => t.tags?.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [state.tasks]);

  const value = {
    ...state,
    filteredTasks,
    allTags,
    dispatch,
    toggleTheme,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskStore() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskStore must be used within TaskProvider');
  return ctx;
}