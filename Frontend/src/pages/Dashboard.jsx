import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUSES = ['To Do', 'In Progress', 'Done'];

const columnStyles = {
  'To Do': {
    header: 'bg-gray-100 text-gray-800',
    border: 'border-gray-200',
    drop: 'bg-gray-50',
  },
  'In Progress': {
    header: 'bg-blue-100 text-blue-800',
    border: 'border-blue-200',
    drop: 'bg-blue-50',
  },
  Done: {
    header: 'bg-green-100 text-green-800',
    border: 'border-green-200',
    drop: 'bg-green-50',
  },
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (priorityFilter) params.priority = priorityFilter;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, priorityFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setDeleteConfirm(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverStatus(null);

    const taskId = e.dataTransfer.getData('taskId');
    const currentStatus = e.dataTransfer.getData('currentStatus');

    if (!taskId || currentStatus === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    setUpdatingId(taskId);

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: currentStatus } : t))
      );
      alert(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} · Drag cards between columns
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
          >
            Try again
          </button>
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.map((status) => {
            const columnTasks = getTasksByStatus(status);
            const styles = columnStyles[status];
            const isDropTarget = dragOverStatus === status;

            return (
              <div
                key={status}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
                className={`flex flex-col rounded-xl border-2 transition-colors min-h-[280px] ${isDropTarget
                    ? `${styles.border} ${styles.drop} border-dashed`
                    : 'border-transparent bg-gray-50/80'
                  }`}
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl ${styles.header}`}
                >
                  <h2 className="font-semibold text-sm">{status}</h2>
                  <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="flex-1 p-2 sm:p-3 space-y-3 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-24 text-sm text-gray-400">
                      {isDropTarget ? 'Drop here' : 'No tasks'}
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task._id}
                        className={updatingId === task._id ? 'opacity-60 pointer-events-none' : ''}
                      >
                        <TaskCard
                          task={task}
                          onEdit={handleEdit}
                          onDelete={(id) => setDeleteConfirm(id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state when no tasks at all */}
      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-8 mt-4">
          <p className="text-gray-500 text-sm">
            {search || priorityFilter
              ? 'No tasks match your filters'
              : 'Create your first task to get started'}
          </p>
          {!search && !priorityFilter && (
            <button
              onClick={handleCreate}
              className="mt-3 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
            >
              Create Task
            </button>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Task"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
