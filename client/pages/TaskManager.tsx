import { useState, useEffect, useRef } from 'react';
import '../styles/task-manager.css';

interface Task {
  id: number;
  title: string;
  description: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User>({ name: 'Alex Johnson', email: 'alex@example.com', avatar: '👤' });
  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'detail' | 'profile'>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('profile');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! 👋 I\'m your TaskFlow AI assistant. I can help you create, manage, and organize your tasks. What would you like to do?',
      timestamp: new Date(Date.now() - 60000),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize tasks
  useEffect(() => {
    const defaultTasks: Task[] = [
      {
        id: 1,
        title: 'Design dashboard UI',
        description: 'Create wireframes and mockups for the main dashboard',
        project: 'Product Design',
        priority: 'high',
        dueDate: '2024-01-25',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Review project proposal',
        description: 'Go through the Q1 project proposal and provide feedback',
        project: 'Business',
        priority: 'high',
        dueDate: '2024-01-23',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        project: 'Development',
        priority: 'medium',
        dueDate: '2024-01-28',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        title: 'Client meeting prep',
        description: 'Prepare slides and talking points for Q1 review meeting',
        project: 'Business',
        priority: 'high',
        dueDate: '2024-01-23',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        title: 'Code review',
        description: 'Review pull requests for the authentication module',
        project: 'Development',
        priority: 'medium',
        dueDate: '2024-01-26',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 6,
        title: 'Bug fixes',
        description: 'Fix reported bugs in the user settings page',
        project: 'Development',
        priority: 'high',
        dueDate: '2024-01-24',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];
    setTasks(defaultTasks);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate === today);
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks
      .filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate > today && dueDate <= nextWeek && t.status !== 'completed';
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getProjects = () => [...new Set(tasks.map(t => t.project))];

  const getTasksByStatus = (status: string) => {
    const filtered = tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = status === 'all' || t.status === status;
      return matchesSearch && matchesStatus;
    });
    return filtered;
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return 'Overdue';
    if (days <= 7) return `In ${days} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString: string, status: string) => {
    if (status === 'completed') return false;
    const date = new Date(dateString);
    return date < new Date();
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const createTask = (title: string, description: string, project: string, priority: 'high' | 'medium' | 'low', dueDate: string) => {
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      title,
      description,
      project,
      priority,
      dueDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setShowModal(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Great! I'll help you with: "${inputValue}". You can use the screens on the right to manage your tasks.`,
        `I understand you want to ${inputValue.toLowerCase()}. The task manager on the right has all the tools you need!`,
        `Perfect! Let me help you ${inputValue.toLowerCase()}. Check out the design preview to get started.`,
      ];
      
      const assistantMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setInputValue('');
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priorityBadge = { high: '🔴', medium: '🟡', low: '🟢' }[task.priority];
    const overdue = isOverdue(task.dueDate, task.status);

    return (
      <div className="task-card" onClick={() => { setSelectedTaskId(task.id); setCurrentView('detail'); }}>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status === 'completed'}
          onChange={(e) => {
            e.stopPropagation();
            updateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' });
          }}
        />
        <div className="task-content">
          <p className="task-title">{task.title}</p>
          <div className="task-meta">
            <span className="task-project">{task.project}</span>
            <span>{priorityBadge} {task.priority}</span>
            <span className={`task-date ${overdue ? 'overdue' : ''}`}>{getRelativeDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="task-manager-layout">
      {/* Left Chat Sidebar (Builder.io style) */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>TaskFlow AI</h2>
          <button className="chat-menu-btn">⋮</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.type}`}>
              <div className="message-avatar">{msg.type === 'user' ? '👤' : '🤖'}</div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="chat-input"
          />
          <button className="send-btn" onClick={handleSendMessage}>➤</button>
        </div>
      </div>

      {/* Right Screen Preview */}
      <div className="screen-preview">
        {/* Navigation Tabs */}
        <div className="screen-nav">
          <button className={`screen-tab ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
            Dashboard
          </button>
          <button className={`screen-tab ${currentView === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentView('tasks')}>
            All Tasks
          </button>
          <button className={`screen-tab ${currentView === 'profile' ? 'active' : ''}`} onClick={() => setCurrentView('profile')}>
            Settings
          </button>
        </div>

        {/* Screen Content */}
        <div className="screen-content">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <>
              <div className="screen-header">
                <h1>Dashboard</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
              </div>

              <div className="screen-body">
                <div className="overview-grid">
                  <div className="overview-card">
                    <div className="card-value">{getTodaysTasks().length}</div>
                    <p className="card-label">Today</p>
                  </div>
                  <div className="overview-card">
                    <div className="card-value">{getUpcomingTasks().length}</div>
                    <p className="card-label">Upcoming</p>
                  </div>
                  <div className="overview-card">
                    <div className="card-value">{tasks.length}</div>
                    <p className="card-label">Total Tasks</p>
                  </div>
                  <div className="overview-card">
                    <div className="card-value">{tasks.filter(t => t.status === 'completed').length}</div>
                    <p className="card-label">Completed</p>
                  </div>
                </div>

                <section className="dashboard-section">
                  <h2>Today's Tasks</h2>
                  {getTodaysTasks().length > 0 ? (
                    <div className="tasks-container">
                      {getTodaysTasks().map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                  ) : (
                    <p className="empty-state">No tasks for today. Great job! 🎉</p>
                  )}
                </section>

                <section className="dashboard-section">
                  <h2>Upcoming (Next 7 Days)</h2>
                  {getUpcomingTasks().length > 0 ? (
                    <div className="tasks-container">
                      {getUpcomingTasks().map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                  ) : (
                    <p className="empty-state">No upcoming tasks</p>
                  )}
                </section>

                <section className="dashboard-section">
                  <h2>By Project</h2>
                  <div className="projects-container">
                    {getProjects().map(project => {
                      const projectTasks = tasks.filter(t => t.project === project);
                      return (
                        <div key={project} className="project-card">
                          <div className="project-name">{project}</div>
                          <div className="project-count">{projectTasks.length}</div>
                          <p>tasks</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* All Tasks View */}
          {currentView === 'tasks' && (
            <>
              <div className="screen-header">
                <h1>All Tasks</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
              </div>

              <div className="screen-body">
                <div className="filters-section">
                  <input
                    type="text"
                    className="search-box"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <div className="filter-group">
                    {['all', 'pending', 'in-progress', 'completed'].map(status => (
                      <button
                        key={status}
                        className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tasks-container">
                  {getTasksByStatus(statusFilter).length > 0 ? (
                    getTasksByStatus(statusFilter).map(task => <TaskCard key={task.id} task={task} />)
                  ) : (
                    <p className="empty-state">No tasks found</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <>
              <div className="screen-header">
                <h1>Profile & Settings</h1>
              </div>

              <div className="screen-body">
                <div className="settings-container">
                  <nav className="settings-nav">
                    {['profile', 'preferences', 'notifications'].map(tab => (
                      <button
                        key={tab}
                        className={`settings-nav-item ${currentTab === tab ? 'active' : ''}`}
                        onClick={() => setCurrentTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>

                  <div className="settings-content">
                    {currentTab === 'profile' && (
                      <section>
                        <h2>Profile Information</h2>
                        <div className="profile-avatar-section">
                          <div className="avatar-large">{user.avatar}</div>
                          <div>
                            <h3>Profile Picture</h3>
                            <div className="emoji-picker">
                              {['👤', '😊', '🙂', '😎', '🤓', '👨‍💼', '👩‍💼', '🧑‍💻'].map(emoji => (
                                <button
                                  key={emoji}
                                  className="emoji-btn"
                                  onClick={() => setUser({ ...user, avatar: emoji })}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); }}>
                          <div className="input-group">
                            <label>Full Name</label>
                            <input
                              type="text"
                              value={user.name}
                              onChange={(e) => setUser({ ...user, name: e.target.value })}
                            />
                          </div>
                          <div className="input-group">
                            <label>Email Address</label>
                            <input
                              type="email"
                              value={user.email}
                              onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                          </div>
                          <button type="submit" className="btn btn-primary">Save Profile</button>
                        </form>
                      </section>
                    )}

                    {currentTab === 'preferences' && (
                      <section>
                        <h2>Preferences</h2>
                        <p className="empty-state">Preference settings available here</p>
                      </section>
                    )}

                    {currentTab === 'notifications' && (
                      <section>
                        <h2>Notifications</h2>
                        <p className="empty-state">Notification settings available here</p>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && <CreateTaskModal onClose={() => setShowModal(false)} onCreate={createTask} />}
    </div>
  );
}

function CreateTaskModal({ onClose, onCreate }: { onClose: () => void; onCreate: (title: string, desc: string, project: string, priority: 'high' | 'medium' | 'low', dueDate: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('General');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title, description, project, priority, dueDate);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Task Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Design landing page" />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add more details..." />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Project</label>
              <select value={project} onChange={(e) => setProject(e.target.value)}>
                <option value="Development">Development</option>
                <option value="Product Design">Product Design</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="input-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
