// Task Management App - Shared Logic

// Initialize app data from localStorage
const initializeApp = () => {
  if (!localStorage.getItem('tasks')) {
    const defaultTasks = [
      {
        id: 1,
        title: 'Design dashboard UI',
        description: 'Create wireframes and mockups for the main dashboard',
        project: 'Product Design',
        priority: 'high',
        dueDate: '2024-01-25',
        status: 'in-progress',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Review project proposal',
        description: 'Go through the Q1 project proposal and provide feedback',
        project: 'Business',
        priority: 'high',
        dueDate: '2024-01-23',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        project: 'Development',
        priority: 'medium',
        dueDate: '2024-01-28',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Client meeting prep',
        description: 'Prepare slides and talking points for Q1 review meeting',
        project: 'Business',
        priority: 'high',
        dueDate: '2024-01-23',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Code review',
        description: 'Review pull requests for the authentication module',
        project: 'Development',
        priority: 'medium',
        dueDate: '2024-01-26',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Bug fixes',
        description: 'Fix reported bugs in the user settings page',
        project: 'Development',
        priority: 'high',
        dueDate: '2024-01-24',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        title: 'Team standup notes',
        description: 'Document action items from daily standup',
        project: 'Business',
        priority: 'low',
        dueDate: '2024-01-23',
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('tasks', JSON.stringify(defaultTasks));
  }

  if (!localStorage.getItem('user')) {
    const defaultUser = {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '👤',
      timezone: 'UTC-5',
      theme: 'light',
      notifications: true
    };
    localStorage.setItem('user', JSON.stringify(defaultUser));
  }
};

// Get all tasks
const getTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

// Get a specific task by ID
const getTask = (id) => {
  return getTasks().find(t => t.id === parseInt(id));
};

// Save task (create or update)
const saveTask = (task) => {
  let tasks = getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  
  if (index > -1) {
    tasks[index] = task;
  } else {
    task.id = Math.max(...tasks.map(t => t.id), 0) + 1;
    tasks.push(task);
  }
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
  return task;
};

// Delete task
const deleteTask = (id) => {
  const tasks = getTasks().filter(t => t.id !== parseInt(id));
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Get user data
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Save user data
const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get today's tasks
const getTodaysTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  return getTasks().filter(t => t.dueDate === today);
};

// Get upcoming tasks (next 7 days)
const getUpcomingTasks = () => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return getTasks().filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate > today && dueDate <= nextWeek && t.status !== 'completed';
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

// Get tasks by project
const getTasksByProject = (project) => {
  return getTasks().filter(t => t.project === project);
};

// Get all projects
const getProjects = () => {
  const tasks = getTasks();
  const projects = [...new Set(tasks.map(t => t.project))];
  return projects.sort();
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateString === today.toISOString().split('T')[0]) {
    return 'Today';
  } else if (dateString === tomorrow.toISOString().split('T')[0]) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format relative date
const getRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diff = date - today;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 0) return 'Overdue';
  if (days <= 7) return `In ${days} days`;
  return formatDate(dateString);
};

// Check if task is overdue
const isOverdue = (dateString, status) => {
  if (status === 'completed') return false;
  const date = new Date(dateString);
  return date < new Date();
};

// Navigation helper
const navigateTo = (path) => {
  window.location.href = path;
};

// Initialize app on load
document.addEventListener('DOMContentLoaded', initializeApp);
