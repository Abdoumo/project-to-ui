// Profile & Settings Script

document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
});

const loadProfileData = () => {
  const user = getUser();
  if (!user) return;

  // Update sidebar
  document.getElementById('sidebarUserName').textContent = user.name;
  document.getElementById('sidebarUserEmail').textContent = user.email;

  // Profile Tab
  document.getElementById('avatarDisplay').textContent = user.avatar;
  document.getElementById('fullName').value = user.name;
  document.getElementById('emailAddress').value = user.email;
  document.getElementById('timezone').value = user.timezone || 'UTC-5';
  document.getElementById('language').value = 'en';

  // Preferences Tab
  document.getElementById('theme').value = user.theme || 'light';
  document.getElementById('sortOrder').value = 'due-date';
  document.getElementById('defaultPriority').value = 'medium';
  document.getElementById('showCompleted').checked = true;

  // Notifications Tab
  document.getElementById('emailNotifications').checked = user.notifications !== false;
  document.getElementById('taskReminders').checked = true;
  document.getElementById('dailySummary').checked = true;
  document.getElementById('browserNotifications').checked = false;
  document.getElementById('reminderTime').value = '09:00';
};

const switchTab = (tabName) => {
  // Hide all tabs
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from all nav items
  document.querySelectorAll('.settings-nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show selected tab
  const tabElement = document.getElementById(tabName + 'Tab');
  if (tabElement) {
    tabElement.classList.add('active');
  }

  // Mark nav item as active
  event.target.classList.add('active');
};

const setAvatar = (emoji) => {
  document.getElementById('avatarDisplay').textContent = emoji;
};

const handleProfileUpdate = (e) => {
  e.preventDefault();

  const user = getUser();
  user.name = document.getElementById('fullName').value;
  user.email = document.getElementById('emailAddress').value;
  user.timezone = document.getElementById('timezone').value;

  saveUser(user);

  // Update sidebar
  document.getElementById('sidebarUserName').textContent = user.name;
  document.getElementById('sidebarUserEmail').textContent = user.email;

  alert('Profile updated successfully!');
};

const handlePreferencesUpdate = (e) => {
  e.preventDefault();

  const user = getUser();
  user.theme = document.getElementById('theme').value;

  saveUser(user);

  alert('Preferences updated successfully!');
};

const handleNotificationsUpdate = (e) => {
  e.preventDefault();

  const user = getUser();
  user.notifications = document.getElementById('emailNotifications').checked;

  saveUser(user);

  alert('Notification settings updated successfully!');
};

const exportData = () => {
  const tasks = getTasks();
  const user = getUser();
  
  const data = {
    user,
    tasks,
    exportedAt: new Date().toISOString()
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  alert('Data exported successfully!');
};

const clearAllTasks = () => {
  const confirmed = confirm('Are you sure you want to delete ALL tasks? This action cannot be undone!');
  
  if (confirmed) {
    const doubleConfirm = confirm('This will permanently delete all your tasks. Are you absolutely sure?');
    
    if (doubleConfirm) {
      localStorage.setItem('tasks', JSON.stringify([]));
      alert('All tasks have been deleted.');
      window.location.href = '../dashboard/index.html';
    }
  }
};

const resetToDefaults = () => {
  const confirmed = confirm('Are you sure you want to reset all settings to defaults?');
  
  if (confirmed) {
    const defaultUser = {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '👤',
      timezone: 'UTC-5',
      theme: 'light',
      notifications: true
    };
    
    saveUser(defaultUser);
    loadProfileData();
    alert('Settings have been reset to defaults.');
  }
};
