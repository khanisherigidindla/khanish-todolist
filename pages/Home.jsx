// Home page stub
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/sidebar';
import TaskBoard from '@/components/taskboard/TaskBoard';
import { TaskProvider } from '@/store/TaskContext';

export const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TaskProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
          <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted text-foreground transition hover:border-primary hover:text-primary focus:outline-none lg:hidden"
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
                <h1 className="text-2xl font-semibold sm:text-3xl">Your task workspace</h1>
              </div>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">Manage tasks with drag-and-drop, filters, and a clean dashboard optimized for both desktop and mobile.</p>
          </div>
        </div>

        <Header />

        <div className="flex w-full h-screen flex-col gap-0 px-4 py-0 sm:px-6 lg:flex-row lg:px-8 lg:gap-6">
          <aside className="hidden w-80 shrink-0 lg:block lg:h-screen overflow-y-auto">
            <Sidebar className="h-full border-r border-border" />
          </aside>

          <main className="flex-1 flex flex-col space-y-6 overflow-auto">
            <section className="grid gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">TaskFlow dashboard</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">Organize your day with clarity.</h2>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Create tasks, track work, and switch views easily on large screens or smaller devices.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Fast setup</p>
                  <p className="mt-2 text-xl font-semibold">Ready to begin</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Drag & drop</p>
                  <p className="mt-2 text-xl font-semibold">Move tasks easily</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Mobile friendly</p>
                  <p className="mt-2 text-xl font-semibold">Work anywhere</p>
                </div>
              </div>
            </section>

            <section className="flex-1 rounded-3xl border border-border bg-card p-5 shadow-sm overflow-auto">
              <div className="flex items-center justify-between gap-3 pb-4 sm:flex-row sm:gap-4 flex-none">
                <div>
                  <h3 className="text-xl font-semibold">Task board</h3>
                  <p className="text-sm text-muted-foreground">Swipe horizontally on smaller screens and use the sidebar filters when needed.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary lg:hidden"
                >
                  <Menu size={16} /> Show filters
                </button>
              </div>
              <TaskBoard />
            </section>
          </main>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="relative z-10 h-full w-[85vw] max-w-sm overflow-y-auto border-r border-border bg-card p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold">Filters</div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
              <Sidebar className="w-full" />
            </aside>
          </div>
        )}
      </div>
    </TaskProvider>
  );
};

