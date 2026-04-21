import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useTaskStore } from '@/store/TaskContext';
import TaskColumn from '@/components/taskboard/TaskColumn';
import TaskForm from '@/components/taskboard/TaskForm';

const STATUSES = ['pending', 'in-progress', 'completed'];

export default function TaskBoard() {
  const { filteredTasks, dispatch } = useTaskStore();
  const [editingTask, setEditingTask] = useState(null);
  const [addingToStatus, setAddingToStatus] = useState(null);

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = filteredTasks.find(t => t.id === draggableId);
    if (!task) return;
    dispatch({
      type: 'UPDATE_TASK',
      payload: { ...task, status: destination.droppableId },
    });
  }

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = filteredTasks.filter(t => t.status === s);
    return acc;
  }, {});

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 lg:gap-8 h-full overflow-x-auto overflow-y-auto pb-8 pl-4 scrollbar-thin max-h-full">
          {STATUSES.map(status => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onEdit={setEditingTask}
              onAddTask={setAddingToStatus}
            />
          ))}
        </div>
      </DragDropContext>


      {(editingTask || addingToStatus) && (
        <TaskForm
          task={editingTask}
          initialStatus={addingToStatus || undefined}
          onClose={() => { setEditingTask(null); setAddingToStatus(null); }}
        />
      )}
    </>
  );
}