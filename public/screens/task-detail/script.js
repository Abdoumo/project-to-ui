// Task Detail Script

let currentTask = null;
let taskId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Get task ID from URL
  const params = new URLSearchParams(window.location.search);
  taskId = parseInt(params.get('id'));

  if (!taskId) {
    document.querySelector('.page-content').innerHTML = '<p class="empty-state">Task not found</p>';
    return;
  }

  currentTask = getTask(taskId);
  if (!currentTask) {
    document.querySelector('.page-content').innerHTML = '<p class="empty-state">Task not found</p>';
    return;
  }

  renderTaskDetail();
  attachEventListeners();
});

const renderTaskDetail = () => {
  if (!currentTask) return;

  // Task title
  document.getElementById('taskTitle').textContent = currentTask.title;

  // Task description
  document.getElementById('taskDescription').value = currentTask.description || '';

  // Task status
  document.getElementById('taskStatus').value = currentTask.status;
  document.getElementById('taskCompleteCheckbox').checked = currentTask.status === 'completed';

  // Task priority
  document.getElementById('taskPriority').value = currentTask.priority;

  // Task project
  document.getElementById('taskProject').value = currentTask.project;

  // Task due date
  document.getElementById('taskDueDate').value = currentTask.dueDate;

  // Task dates
  const createdDate = new Date(currentTask.createdAt);
  document.getElementById('createdDate').textContent = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Update date
  const updatedDate = new Date();
  document.getElementById('updatedDate').textContent = updatedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Status badges
  renderStatusBadges();
};

const renderStatusBadges = () => {
  const badgesContainer = document.getElementById('taskStatusBadges');
  const priorityBadge = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  }[currentTask.priority] || '🟡';

  const statusDisplay = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'completed': '✓ Completed'
  }[currentTask.status] || currentTask.status;

  const overdue = isOverdue(currentTask.dueDate, currentTask.status);
  const dueDate = getRelativeDate(currentTask.dueDate);

  badgesContainer.innerHTML = `
    <span class="badge badge-status">${statusDisplay}</span>
    <span class="badge badge-priority ${currentTask.priority}">${priorityBadge} ${currentTask.priority}</span>
    <span class="badge ${overdue ? 'badge-danger' : ''}">${dueDate}</span>
  `;
};

const attachEventListeners = () => {
  // Handle title edit
  const titleElement = document.getElementById('taskTitle');
  titleElement.addEventListener('blur', () => {
    currentTask.title = titleElement.textContent;
    updateTask();
  });

  // Handle description edit
  const descElement = document.getElementById('taskDescription');
  descElement.addEventListener('blur', () => {
    currentTask.description = descElement.value;
    updateTask();
  });
};

const updateTask = () => {
  if (!currentTask) return;

  // Update from form fields
  currentTask.title = document.getElementById('taskTitle').textContent;
  currentTask.description = document.getElementById('taskDescription').value;
  currentTask.status = document.getElementById('taskStatus').value;
  currentTask.priority = document.getElementById('taskPriority').value;
  currentTask.project = document.getElementById('taskProject').value;
  currentTask.dueDate = document.getElementById('taskDueDate').value;

  // Save to localStorage
  saveTask(currentTask);

  // Update UI
  renderStatusBadges();
};

const saveTask = () => {
  updateTask();
  alert('Task saved successfully!');
  // You could also show a toast notification instead
};

const toggleCompleteStatus = () => {
  const checkbox = document.getElementById('taskCompleteCheckbox');
  currentTask.status = checkbox.checked ? 'completed' : 'pending';
  document.getElementById('taskStatus').value = currentTask.status;
  updateTask();
  renderStatusBadges();
};

const deleteTask = () => {
  if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
    const id = currentTask.id;
    deleteTask(id);
    alert('Task deleted successfully!');
    goBack();
  }
};

const goBack = () => {
  window.history.back();
};

// Auto-save on field changes
document.addEventListener('change', () => {
  if (currentTask) {
    updateTask();
  }
});
