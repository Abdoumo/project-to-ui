// Dashboard Script

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  setDefaultDueDate();
});

const renderDashboard = () => {
  const tasks = getTasks();
  const todaysTasks = getTodaysTasks();
  const upcomingTasks = getUpcomingTasks();
  const projects = getProjects();

  // Update counts
  document.getElementById('todayCount').textContent = todaysTasks.length;
  document.getElementById('upcomingCount').textContent = upcomingTasks.length;
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('completedCount').textContent = tasks.filter(t => t.status === 'completed').length;

  // Render today's tasks
  const todayTasksList = document.getElementById('todayTasksList');
  const noTodayTasks = document.getElementById('noTodayTasks');
  
  if (todaysTasks.length > 0) {
    todayTasksList.innerHTML = todaysTasks.map(task => createTaskCard(task)).join('');
    noTodayTasks.style.display = 'none';
  } else {
    todayTasksList.innerHTML = '';
    noTodayTasks.style.display = 'block';
  }

  // Render upcoming tasks
  const upcomingTasksList = document.getElementById('upcomingTasksList');
  const noUpcomingTasks = document.getElementById('noUpcomingTasks');
  
  if (upcomingTasks.length > 0) {
    upcomingTasksList.innerHTML = upcomingTasks.map(task => createTaskCard(task)).join('');
    noUpcomingTasks.style.display = 'none';
  } else {
    upcomingTasksList.innerHTML = '';
    noUpcomingTasks.style.display = 'block';
  }

  // Render projects
  const projectsList = document.getElementById('projectsList');
  projectsList.innerHTML = projects.map(project => {
    const projectTasks = getTasksByProject(project);
    return `
      <div class="project-card" onclick="goToProject('${project}')">
        <div class="project-name">${project}</div>
        <div class="project-count">${projectTasks.length}</div>
        <p style="font-size: var(--font-size-sm); color: var(--text-tertiary); margin: 0;">tasks</p>
      </div>
    `;
  }).join('');
};

const createTaskCard = (task) => {
  const overdue = isOverdue(task.dueDate, task.status);
  const priorityBadge = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  }[task.priority] || '🟡';

  return `
    <div class="task-card" onclick="goToTask(${task.id})">
      <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''} onclick="event.stopPropagation(); toggleTaskStatus(${task.id})">
      <div class="task-content">
        <p class="task-title">${task.title}</p>
        <div class="task-meta">
          <span class="task-project">${task.project}</span>
          <span>${priorityBadge} ${task.priority}</span>
          <span class="task-date ${overdue ? 'overdue' : ''}">${getRelativeDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  `;
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
  renderDashboard();
};

const toggleTaskStatus = (id) => {
  const task = getTask(id);
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    saveTask(task);
    renderDashboard();
  }
};

const goToTask = (id) => {
  window.location.href = `../task-detail/index.html?id=${id}`;
};

const goToProject = (project) => {
  window.location.href = `../task-list/index.html?project=${encodeURIComponent(project)}`;
};

// Close modal when clicking outside
document.getElementById('createTaskModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'createTaskModal') {
    closeCreateTaskModal();
  }
});
