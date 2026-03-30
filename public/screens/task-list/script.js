// Task List Script

let currentStatusFilter = 'all';
let currentView = 'list';

document.addEventListener('DOMContentLoaded', () => {
  renderTaskList();
  setDefaultDueDate();
  loadFilterFromURL();
});

const loadFilterFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const project = params.get('project');
  if (project) {
    document.getElementById('projectFilter').value = project;
    filterTasks();
  }
};

const filterTasks = () => {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const priorityFilter = document.getElementById('priorityFilter').value;
  const projectFilter = document.getElementById('projectFilter').value;

  const tasks = getTasks().filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                         task.description.toLowerCase().includes(searchTerm);
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    const matchesProject = !projectFilter || task.project === projectFilter;
    const matchesStatus = currentStatusFilter === 'all' || task.status === currentStatusFilter;

    return matchesSearch && matchesPriority && matchesProject && matchesStatus;
  });

  renderTasks(tasks);
  renderBoard(tasks);
};

const renderTaskList = () => {
  filterTasks();
};

const renderTasks = (tasks) => {
  const tasksList = document.getElementById('tasksList');
  const noTasks = document.getElementById('noTasks');

  if (tasks.length > 0) {
    tasksList.innerHTML = tasks.map(task => createTaskCardHTML(task)).join('');
    noTasks.style.display = 'none';
  } else {
    tasksList.innerHTML = '';
    noTasks.style.display = 'block';
  }
};

const renderBoard = (tasks) => {
  const statuses = ['pending', 'in-progress', 'completed'];

  statuses.forEach(status => {
    const statusTasks = tasks.filter(t => t.status === status);
    const boardColumn = document.getElementById(`board${status.charAt(0).toUpperCase() + status.slice(1).replace('-', '')}`);

    if (boardColumn) {
      boardColumn.innerHTML = statusTasks.map(task => createBoardTaskCardHTML(task)).join('');
    }
  });
};

const createTaskCardHTML = (task) => {
  const overdue = isOverdue(task.dueDate, task.status);
  const priorityBadge = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  }[task.priority] || '🟡';

  const statusDisplay = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'completed': 'Completed'
  }[task.status] || task.status;

  return `
    <div class="task-card">
      <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''} 
             onclick="event.stopPropagation(); toggleTaskStatus(${task.id}); filterTasks();">
      <div class="task-content">
        <p class="task-title">${task.title}</p>
        ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
        <div class="task-meta">
          <span class="task-project">${task.project}</span>
          <span>${priorityBadge} ${task.priority}</span>
          <span class="task-date ${overdue ? 'overdue' : ''}">${getRelativeDate(task.dueDate)}</span>
          <span class="task-status ${task.status}">${statusDisplay}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-edit" onclick="event.stopPropagation(); goToTask(${task.id})">✎</button>
        <button class="btn-delete" onclick="event.stopPropagation(); deleteTaskConfirm(${task.id})">🗑</button>
      </div>
    </div>
  `;
};

const createBoardTaskCardHTML = (task) => {
  const priorityBadge = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  }[task.priority] || '🟡';

  return `
    <div class="board-task-card" onclick="goToTask(${task.id})">
      <p class="board-task-title">${task.title}</p>
      <div class="board-task-meta">
        <span class="task-project">${task.project}</span>
        <span>${priorityBadge}</span>
        <span class="task-date">${getRelativeDate(task.dueDate)}</span>
      </div>
    </div>
  `;
};

const filterByStatus = (status) => {
  currentStatusFilter = status;

  // Update button styles
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.style.backgroundColor = '';
    btn.style.color = '';
  });
  
  const buttons = {
    'all': 'statusAll',
    'pending': 'statusPending',
    'in-progress': 'statusInProgress',
    'completed': 'statusCompleted'
  };

  const activeBtn = document.getElementById(buttons[status]);
  if (activeBtn) {
    activeBtn.style.backgroundColor = 'var(--primary)';
    activeBtn.style.color = 'white';
  }

  filterTasks();
};

const setView = (view) => {
  currentView = view;

  document.getElementById('listView').style.display = view === 'list' ? 'block' : 'none';
  document.getElementById('boardView').style.display = view === 'board' ? 'block' : 'none';

  document.getElementById('listViewBtn').classList.toggle('active');
  document.getElementById('boardViewBtn').classList.toggle('active');
};

const openCreateTaskModal = () => {
  document.getElementById('createTaskModal').classList.add('open');
};

const closeCreateTaskModal = () => {
  document.getElementById('createTaskModal').classList.remove('open');
  document.getElementById('createTaskForm').reset();
};

const setDefaultDueDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toISOString().split('T')[0];
  document.getElementById('taskDueDate').value = dateString;
};

const handleCreateTask = (e) => {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const project = document.getElementById('taskProject').value || 'General';
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;

  const newTask = {
    id: Math.max(...getTasks().map(t => t.id), 0) + 1,
    title,
    description,
    project,
    priority,
    dueDate,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  saveTask(newTask);
  closeCreateTaskModal();
  filterTasks();
};

const toggleTaskStatus = (id) => {
  const task = getTask(id);
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    saveTask(task);
  }
};

const deleteTaskConfirm = (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTask(id);
    filterTasks();
  }
};

const goToTask = (id) => {
  window.location.href = `../task-detail/index.html?id=${id}`;
};

// Close modal when clicking outside
document.getElementById('createTaskModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'createTaskModal') {
    closeCreateTaskModal();
  }
});
