// storage service stub
const STORAGE_KEY = 'taskflow_tasks';
const HISTORY_KEY = 'taskflow_history';

const DEFAULT_TASKS = [
  {
    id: 'demo-1',
    title: 'Design system setup',
    description: 'Define color tokens, typography scale, and component library foundation.',
    status: 'completed',
    priority: 'high',
    tags: ['design', 'frontend'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    dueDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Build authentication flow',
    description: 'Implement login, signup, and password reset screens with form validation.',
    status: 'in-progress',
    priority: 'high',
    tags: ['backend', 'security'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Dashboard analytics',
    description: 'Create charts and KPI cards for the main dashboard overview.',
    status: 'in-progress',
    priority: 'medium',
    tags: ['frontend', 'charts'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
  },
  {
    id: 'demo-4',
    title: 'API integration layer',
    description: 'Abstract all API calls into a service layer with error handling and retry logic.',
    status: 'pending',
    priority: 'high',
    tags: ['backend', 'architecture'],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Write unit tests',
    description: 'Cover core business logic with Jest and React Testing Library.',
    status: 'pending',
    priority: 'medium',
    tags: ['testing', 'quality'],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
  },
  {
    id: 'demo-6',
    title: 'Mobile responsiveness audit',
    description: 'Review and fix layout issues on mobile breakpoints across all pages.',
    status: 'pending',
    priority: 'low',
    tags: ['mobile', 'design'],
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
  },
];

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export const storageService = {
  getTasks() {
    // Fix for persistent bad data - force fresh demo tasks
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    this.saveTasks(DEFAULT_TASKS);
    return DEFAULT_TASKS;
  },

  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  updateTask(updated) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === updated.id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updated };
    this.saveTasks(tasks);
    return tasks[idx];
  },

  deleteTask(id) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  },

  deleteTasks(ids) {
    const set = new Set(ids);
    const tasks = this.getTasks().filter(t => !set.has(t.id));
    this.saveTasks(tasks);
  },

  // Undo/Redo history
  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
  },
};