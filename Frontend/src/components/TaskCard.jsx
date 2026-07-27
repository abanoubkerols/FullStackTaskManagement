const statusColors = {
  'To Do': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Done: 'bg-green-100 text-green-800',
};

const priorityColors = {
  Low: 'bg-emerald-100 text-emerald-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-red-100 text-red-800',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'Done';

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
    e.dataTransfer.setData('currentStatus', task.status);
    e.dataTransfer.effectAllowed = 'move';
    // Add a slight delay to allow the drag image to render
    setTimeout(() => {
      e.target.classList.add('opacity-40');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-40');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        {task.dueDate && (
          <span
            className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}
          >
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
