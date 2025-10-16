import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, BarChart3, MessageSquare, Clock, AlertTriangle, Plus, Edit3, Trash2, CheckCircle, XCircle, Send, UserPlus, Link, User, UserX, UserCheck, TrendingUp, Target, Activity, FileText, Award, PieChart, Download, List, Layers, Lock, Eye, EyeOff, Settings, Shield 
} from 'lucide-react';

// Mock Excel export function
const exportToExcel = (data, filename) => {
  console.log('Exporting to Excel:', filename, data);
  alert(`Exporting ${filename} to Excel (mock implementation)`);
};

const App = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin management state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminAction, setAdminAction] = useState('add');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [users, setUsers] = useState([{ username: 'admin', password: 'admin', role: 'admin' }]);

  // Main application state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      status: 'in-progress',
      type: 'Development',
      teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      tasks: [
        { id: 1, name: 'Design Mockups', assignee: 'Jane Smith', status: 'completed', startDate: '2024-01-15', endDate: '2024-01-25', progress: 100, completedDate: '2024-01-24' },
        { id: 2, name: 'Frontend Development', assignee: 'John Doe', status: 'in-progress', startDate: '2024-01-26', endDate: '2024-02-20', progress: 60 },
        { id: 3, name: 'Backend Integration', assignee: 'Mike Johnson', status: 'pending', startDate: '2024-02-21', endDate: '2024-03-10', progress: 0 },
        { id: 4, name: 'Testing & QA', assignee: 'Jane Smith', status: 'pending', startDate: '2024-03-11', endDate: '2024-03-25', progress: 0 },
        { id: 5, name: 'Launch', assignee: 'John Doe', status: 'pending', startDate: '2024-03-26', endDate: '2024-03-30', progress: 0 }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'iOS and Android mobile application',
      startDate: '2024-02-01',
      endDate: '2024-05-15',
      status: 'planning',
      type: 'Development',
      teamMembers: ['Sarah Wilson', 'David Brown', 'John Doe'],
      tasks: [
        { id: 6, name: 'Requirements Gathering', assignee: 'Sarah Wilson', status: 'completed', startDate: '2024-02-01', endDate: '2024-02-10', progress: 100, completedDate: '2024-02-09' },
        { id: 7, name: 'UI/UX Design', assignee: 'David Brown', status: 'in-progress', startDate: '2024-02-11', endDate: '2024-03-05', progress: 40 }
      ]
    }
  ]);

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'Developer', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Designer', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'Backend Developer', status: 'active' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', role: 'Product Manager', status: 'active' },
    { id: 5, name: 'David Brown', email: 'david.brown@company.com', role: 'UI/UX Designer', status: 'active' }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
  const [projectAction, setProjectAction] = useState('add');
  const [teamMemberAction, setTeamMemberAction] = useState('add');
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  // Form states
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: ''
  });

  const [projectTasks, setProjectTasks] = useState([
    { id: 1, name: '', assignee: '', startDate: '', endDate: '', role: '' }
  ]);

  const [taskForm, setTaskForm] = useState({
    name: '',
    assignee: '',
    startDate: '',
    endDate: '',
    role: ''
  });

  const [newTeamMember, setNewTeamMember] = useState({ name: '', email: '', role: '' });

  // Project and task types
  const projectTypes = ['Tender', 'BQ', 'Day 2 Support', 'Development'];
  
  // Added roles list as requested
  const rolesList = [
    'TPS',
    'Project Manager',
    'Project Lead',
    'Amazon Connect Eng',
    'Amazon Connect Eng Intern',
    'Amazon Connect Developer',
    'AWS Cloud Eng'
  ];

  const taskTypes = [
    'Amazon Connect Phase 1 – Base Setup',
    'Amazon Connect Phase 2 – AI Features',
    'Amazon Connect – Integration (D365 & SingPass + MyInfo)',
    'Amazon Connect – Integration (Salesforce & SingPass + MyInfo)',
    'Day 2 Support',
    'POC',
    'Change Request',
    'Setup',
    'Integration',
    'BQ',
    'Tender',
    'Transition',
    'Knowledge Transfer',
    'Others Please type in remarks'
  ];

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMemberTaskStats = (memberName) => {
    const memberTasks = projects.flatMap(project => 
      project.tasks.filter(task => task.assignee === memberName)
    );
    const completedTasks = memberTasks.filter(task => task.status === 'completed');
    const totalTasks = memberTasks.length;
    return { completed: completedTasks.length, total: totalTasks };
  };

  const getProjectCompletion = (project) => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { completed: completedTasks, total: totalTasks, percentage: completionPercentage };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Auth handlers
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  // Admin handlers
  const addAdminUser = () => {
    if (newAdmin.username && newAdmin.password) {
      const existingUser = users.find(u => u.username === newAdmin.username);
      if (existingUser) {
        alert('Username already exists');
        return;
      }
      setUsers([...users, { 
        username: newAdmin.username, 
        password: newAdmin.password, 
        role: 'admin' 
      }]);
      setNewAdmin({ username: '', password: '' });
      setShowAdminModal(false);
    }
  };

  const updateAdminUser = () => {
    if (selectedAdmin && newAdmin.username && newAdmin.password) {
      const updatedUsers = users.map(user => 
        user.username === selectedAdmin.username 
          ? { ...user, username: newAdmin.username, password: newAdmin.password }
          : user
      );
      setUsers(updatedUsers);
      setNewAdmin({ username: '', password: '' });
      setSelectedAdmin(null);
      setShowAdminModal(false);
    }
  };

  const deleteAdminUser = () => {
    if (selectedAdmin && selectedAdmin.username !== 'admin') {
      const updatedUsers = users.filter(user => user.username !== selectedAdmin.username);
      setUsers(updatedUsers);
      setSelectedAdmin(null);
      setShowAdminModal(false);
    } else if (selectedAdmin && selectedAdmin.username === 'admin') {
      alert('Cannot delete the default admin account');
    }
  };

  // Project handlers
  const createProject = () => {
    if (projectForm.name && projectForm.startDate && projectForm.endDate && projectForm.type) {
      const project = {
        id: projects.length + 1,
        ...projectForm,
        status: 'planning',
        teamMembers: [...new Set(projectTasks
          .filter(task => task.assignee)
          .map(task => task.assignee)
        )],
        tasks: projectTasks
          .filter(task => task.name && task.startDate && task.endDate)
          .map((task, index) => ({
            id: Date.now() + index,
            ...task,
            status: 'pending',
            progress: 0
          }))
      };
      setProjects([...projects, project]);
      resetProjectForm();
      setShowProjectModal(false);
    }
  };

  const updateProject = () => {
    if (selectedProject && projectForm.name && projectForm.startDate && projectForm.endDate && projectForm.type) {
      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id 
          ? { 
              ...project, 
              ...projectForm,
              teamMembers: [...new Set(projectTasks
                .filter(task => task.assignee)
                .map(task => task.assignee)
              )],
              tasks: projectTasks
                .filter(task => task.name && task.startDate && task.endDate)
                .map((task, index) => ({
                  id: project.tasks[index]?.id || Date.now() + index,
                  ...task,
                  status: project.tasks[index]?.status || 'pending',
                  progress: project.tasks[index]?.progress || 0
                }))
            }
          : project
      );
      setProjects(updatedProjects);
      const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedSelectedProject);
      resetProjectForm();
      setShowProjectModal(false);
    }
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
    }
    setShowProjectModal(false);
  };

  // Task handlers
  const createTask = () => {
    if (taskForm.name && taskForm.startDate && taskForm.endDate && selectedProject) {
      const task = {
        id: Date.now(),
        ...taskForm,
        status: 'pending',
        progress: 0
      };
      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id 
          ? { ...project, tasks: [...project.tasks, task] }
          : project
      );
      setProjects(updatedProjects);
      setSelectedProject({ ...selectedProject, tasks: [...selectedProject.tasks, task] });
      setTaskForm({ name: '', assignee: '', startDate: '', endDate: '', role: '' });
      setShowTaskModal(false);
    }
  };

  const deleteTask = (taskId) => {
    const updatedProjects = projects.map(project => ({
      ...project,
      tasks: project.tasks.filter(task => task.id !== taskId)
    }));
    setProjects(updatedProjects);
    if (selectedProject) {
      const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedSelectedProject);
    }
  };

  const completeTask = (taskId) => {
    const updatedProjects = projects.map(project => ({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId ? { 
          ...task, 
          status: 'completed', 
          progress: 100,
          completedDate: new Date().toISOString().split('T')[0]
        } : task
      )
    }));
    setProjects(updatedProjects);
    if (selectedProject) {
      const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedSelectedProject);
    }
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedProjects = projects.map(project => ({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 60 : 0 } : task
      )
    }));
    setProjects(updatedProjects);
    if (selectedProject) {
      const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedSelectedProject);
    }
  };

  // Team member handlers
  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.email) {
      const teamMember = {
        id: teamMembers.length + 1,
        ...newTeamMember,
        status: 'active'
      };
      setTeamMembers([...teamMembers, teamMember]);
      setNewTeamMember({ name: '', email: '', role: '' });
      setShowTeamMemberModal(false);
    }
  };

  const updateTeamMember = () => {
    if (selectedTeamMember && newTeamMember.name && newTeamMember.email) {
      const updatedTeamMembers = teamMembers.map(member => 
        member.id === selectedTeamMember.id 
          ? { ...member, ...newTeamMember }
          : member
      );
      setTeamMembers(updatedTeamMembers);
      setNewTeamMember({ name: '', email: '', role: '' });
      setSelectedTeamMember(null);
      setShowTeamMemberModal(false);
    }
  };

  const removeTeamMember = (memberId) => {
    const updatedTeamMembers = teamMembers.filter(member => member.id !== memberId);
    setTeamMembers(updatedTeamMembers);
    const updatedProjects = projects.map(project => ({
      ...project,
      teamMembers: project.teamMembers.filter(memberName => {
        const member = teamMembers.find(m => m.id === memberId);
        return memberName !== (member ? member.name : '');
      }),
      tasks: project.tasks.map(task => {
        const member = teamMembers.find(m => m.id === memberId);
        return task.assignee === (member ? member.name : '') ? { ...task, assignee: '' } : task;
      })
    }));
    setProjects(updatedProjects);
    if (selectedProject) {
      const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedSelectedProject);
    }
    setShowTeamMemberModal(false);
  };

  // Gantt chart renderer
  const renderGanttChart = (project) => {
    if (!project.tasks.length) return null;
    const allDates = project.tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));
    const totalDays = getDaysBetween(minDate, maxDate);
    
    return (
      <div className="space-y-2">
        {project.tasks.map((task, index) => {
          const taskStartDays = getDaysBetween(minDate, task.startDate);
          const taskDuration = getDaysBetween(task.startDate, task.endDate);
          const leftPercent = (taskStartDays / totalDays) * 100;
          const widthPercent = (taskDuration / totalDays) * 100;
          return (
            <div key={task.id} className="flex items-center space-x-4 py-2">
              <div className="w-48 flex-shrink-0">
                <div className="font-medium text-sm">{task.name}</div>
                <div className="text-xs text-gray-500">{task.assignee || 'Unassigned'}{task.role ? ` (${task.role})` : ''}</div>
              </div>
              <div className="flex-1 bg-gray-100 rounded h-8 relative">
                <div 
                  className={`absolute top-1 h-6 rounded transition-all duration-300 ${
                    task.status === 'completed' ? 'bg-green-500' : 
                    task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ 
                    left: `${leftPercent}%`, 
                    width: `${widthPercent}%`,
                    minWidth: '2px'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{task.progress}%</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 w-32">
                {formatDate(task.startDate)} - {formatDate(task.endDate)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Form helpers
  const resetProjectForm = () => {
    setProjectForm({ name: '', description: '', startDate: '', endDate: '', type: '' });
    setProjectTasks([{ id: 1, name: '', assignee: '', startDate: '', endDate: '', role: '' }]);
  };

  const addProjectTask = () => {
    setProjectTasks([...projectTasks, { 
      id: Date.now(), 
      name: '', 
      assignee: '', 
      startDate: '', 
      endDate: '', 
      role: '' 
    }]);
  };

  const updateProjectTask = (taskId, field, value) => {
    setProjectTasks(projectTasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const removeProjectTask = (taskId) => {
    if (projectTasks.length > 1) {
      setProjectTasks(projectTasks.filter(task => task.id !== taskId));
    }
  };

  // Export functions
  const exportDashboardData = () => {
    const dashboardData = {
      summary: {
        totalProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        activeTeamMembers,
        completedProjectsPercentage,
        completedTasksPercentage
      },
      teamPerformance: teamMembers.filter(m => m.status === 'active').map(member => {
        const taskStats = getMemberTaskStats(member.name);
        return {
          name: member.name,
          role: member.role,
          tasksCompleted: taskStats.completed,
          totalTasks: taskStats.total,
          completionRate: taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0
        };
      }),
      recentProjects: projects.slice(0, 3).map(project => {
        const completion = getProjectCompletion(project);
        return {
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          type: project.type,
          teamMembers: project.teamMembers.length,
          tasksCompleted: completion.completed,
          totalTasks: completion.total,
          completionPercentage: completion.percentage
        };
      })
    };
    exportToExcel(dashboardData, 'Project_Planner_Dashboard.xlsx');
  };

  const exportProjectTasks = () => {
    const projectTasksData = projects.flatMap(project => 
      project.tasks.map(task => ({
        projectName: project.name,
        projectType: project.type,
        taskName: task.name,
        assignee: task.assignee || 'Unassigned',
        role: task.role || 'N/A',
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate,
        completedDate: task.completedDate || '',
        progress: task.progress
      }))
    );
    exportToExcel(projectTasksData, 'Project_Tasks.xlsx');
  };

  const exportTeamDetails = () => {
    const teamData = teamMembers.map(member => {
      const taskStats = getMemberTaskStats(member.name);
      const memberProjects = projects.filter(project => 
        project.teamMembers.includes(member.name)
      ).map(project => project.name);
      return {
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status,
        projects: memberProjects.join(', '),
        tasksCompleted: taskStats.completed,
        totalTasks: taskStats.total,
        completionRate: taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0
      };
    });
    exportToExcel(teamData, 'Team_Details.xlsx');
  };

  // Dashboard calculations
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => 
    p.tasks.length > 0 && p.tasks.every(t => t.status === 'completed')
  ).length;
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => 
    acc + p.tasks.filter(t => t.status === 'completed').length, 0
  );
  const activeTeamMembers = teamMembers.filter(m => m.status === 'active').length;
  const completedProjectsPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
  const completedTasksPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getTeamMembersWithProjects = () => {
    const memberProjects = {};
    teamMembers.forEach(member => {
      memberProjects[member.id] = {
        ...member,
        projects: []
      };
    });
    projects.forEach(project => {
      project.teamMembers.forEach(memberName => {
        const member = teamMembers.find(m => m.name === memberName);
        if (member && memberProjects[member.id]) {
          memberProjects[member.id].projects.push({
            projectId: project.id,
            projectName: project.name,
            tasks: project.tasks.filter(task => task.assignee === memberName).length
          });
        }
      });
    });
    return Object.values(memberProjects);
  };

  // Effects
  useEffect(() => {
    if (showProjectModal && projectAction === 'edit' && selectedProject) {
      setProjectForm({
        name: selectedProject.name,
        description: selectedProject.description,
        startDate: selectedProject.startDate,
        endDate: selectedProject.endDate,
        type: selectedProject.type
      });
      if (selectedProject.tasks.length > 0) {
        setProjectTasks(selectedProject.tasks.map(task => ({
          id: task.id,
          name: task.name,
          assignee: task.assignee,
          startDate: task.startDate,
          endDate: task.endDate,
          role: task.role || '' // Added role field
        })));
      } else {
        setProjectTasks([{ id: 1, name: '', assignee: '', startDate: '', endDate: '', role: '' }]);
      }
    } else if (showProjectModal && projectAction === 'add') {
      resetProjectForm();
    }
  }, [showProjectModal, projectAction, selectedProject]);

  // Login view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Planner</h1>
            <p className="text-gray-600">Sign in to access your projects</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {loginError && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main app view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Project Planner</h1>
                <p className="text-sm text-gray-500">Team collaboration & timeline management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{activeTeamMembers} Active Members</span>
              </div>
              <div className="relative group">
                <button 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10 border">
                  <button
                    onClick={exportDashboardData}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard Data
                  </button>
                  <button
                    onClick={exportProjectTasks}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Project Tasks
                  </button>
                  <button
                    onClick={exportTeamDetails}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Team Details
                  </button>
                </div>
              </div>
              <button 
                onClick={() => {
                  setProjectAction('add');
                  setShowProjectModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </button>
              <div className="relative group">
                <button 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10 border">
                  <button
                    onClick={() => {
                      setAdminAction('add');
                      setShowAdminModal(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => {
                      setAdminAction('edit');
                      setShowAdminModal(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Projects</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Tasks</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Team</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{completedProjectsPercentage}%</p>
                    <p className="text-sm text-gray-500">{completedProjects}/{totalProjects} projects</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{completedTasksPercentage}%</p>
                    <p className="text-sm text-gray-500">{completedTasks}/{totalTasks} tasks</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Team Members</p>
                    <p className="text-2xl font-bold text-gray-900">{activeTeamMembers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Performance Overview */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Team Performance</h2>
                <button
                  onClick={exportTeamDetails}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.filter(m => m.status === 'active').map((member) => {
                    const taskStats = getMemberTaskStats(member.name);
                    return (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Task Completion</span>
                            <span className="font-medium text-gray-900">
                              {taskStats.completed}/{taskStats.total}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
                <button
                  onClick={exportProjectTasks}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Tasks</span>
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => {
                    const projectCompletion = getProjectCompletion(project);
                    return (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Layers className="h-4 w-4 mr-2" />
                          <span>Type: {project.type}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{project.teamMembers.length} members</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>{projectCompletion.completed}/{projectCompletion.total} tasks</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{projectCompletion.percentage}% Complete</div>
                            <div className="text-xs text-gray-500">
                              {formatDate(project.startDate)} - {formatDate(project.endDate)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          {renderGanttChart(project)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <button
                onClick={() => {
                  setProjectAction('add');
                  setShowProjectModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map(project => {
                const projectCompletion = getProjectCompletion(project);
                return (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Layers className="h-4 w-4 mr-2" />
                        <span>{project.type}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{project.teamMembers.length} members</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{projectCompletion.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${projectCompletion.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setProjectAction('edit');
                          setShowProjectModal(true);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-center space-x-1 text-sm"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg flex items-center justify-center space-x-1 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="space-y-4">
                  {projects.flatMap(project => 
                    project.tasks.map(task => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{task.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">{project.name}</span> • {task.assignee || 'Unassigned'}{task.role ? ` (${task.role})` : ''}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => completeTask(task.id)}
                                className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Complete</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setTaskForm({
                                  name: task.name,
                                  assignee: task.assignee,
                                  startDate: task.startDate,
                                  endDate: task.endDate,
                                  role: task.role || ''
                                });
                                setSelectedProject(project);
                                setShowTaskModal(true);
                              }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                            >
                              <Edit3 className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{task.progress}%</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
              <button
                onClick={() => {
                  setTeamMemberAction('add');
                  setShowTeamMemberModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Member</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{member.email}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTeamMember(member);
                        setNewTeamMember({ name: member.name, email: member.email, role: member.role });
                        setTeamMemberAction('edit');
                        setShowTeamMemberModal(true);
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-center space-x-1 text-sm"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => removeTeamMember(member.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg flex items-center justify-center space-x-1 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {projectAction === 'add' ? 'Add New Project' : 'Edit Project'}
                </h2>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter project description"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={projectForm.startDate}
                      onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={projectForm.endDate}
                      onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                  <select
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({...projectForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-900">Tasks</h3>
                    <button
                      onClick={addProjectTask}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Task</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {projectTasks.map((task, index) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">Task {index + 1}</h4>
                          {projectTasks.length > 1 && (
                            <button
                              onClick={() => removeProjectTask(task.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Task Name</label>
                            <input
                              type="text"
                              value={task.name}
                              onChange={(e) => updateProjectTask(task.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Task name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Assignee</label>
                            <select
                              value={task.assignee}
                              onChange={(e) => updateProjectTask(task.id, 'assignee', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Select assignee</option>
                              {teamMembers.map(member => (
                                <option key={member.id} value={member.name}>{member.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Role</label>
                            <select
                              value={task.role}
                              onChange={(e) => updateProjectTask(task.id, 'role', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Select role</option>
                              {rolesList.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={task.startDate}
                              onChange={(e) => updateProjectTask(task.id, 'startDate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">End Date</label>
                            <input
                              type="date"
                              value={task.endDate}
                              onChange={(e) => updateProjectTask(task.id, 'endDate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {projectAction === 'add' ? (
                  <button
                    onClick={createProject}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Project
                  </button>
                ) : (
                  <button
                    onClick={updateProject}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Project
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                  <input
                    type="text"
                    value={taskForm.name}
                    onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter task name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({...taskForm, assignee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select assignee</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={taskForm.role}
                    onChange={(e) => setTaskForm({...taskForm, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select role</option>
                    {rolesList.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={taskForm.startDate}
                      onChange={(e) => setTaskForm({...taskForm, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={taskForm.endDate}
                      onChange={(e) => setTaskForm({...taskForm, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Modal */}
      {showTeamMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {teamMemberAction === 'add' ? 'Add Team Member' : 'Edit Team Member'}
                </h2>
                <button
                  onClick={() => setShowTeamMemberModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter role"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTeamMemberModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {teamMemberAction === 'add' ? (
                  <button
                    onClick={addTeamMember}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={updateTeamMember}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => removeTeamMember(selectedTeamMember.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {adminAction === 'add' ? 'Add Admin User' : 'Manage Admin Users'}
                </h2>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {adminAction === 'add' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {users.map(user => (
                    <div key={user.username} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAdmin(user);
                            setNewAdmin({ username: user.username, password: user.password });
                            setAdminAction('edit');
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {user.username !== 'admin' && (
                          <button
                            onClick={() => {
                              setSelectedAdmin(user);
                              setAdminAction('delete');
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {adminAction === 'edit' && selectedAdmin && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              )}
              
              {adminAction === 'delete' && selectedAdmin && (
                <div className="mt-4">
                  <p className="text-gray-700">
                    Are you sure you want to delete user <span className="font-medium">{selectedAdmin.username}</span>?
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {adminAction === 'add' && (
                  <button
                    onClick={addAdminUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add User
                  </button>
                )}
                {adminAction === 'edit' && (
                  <button
                    onClick={updateAdminUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update User
                  </button>
                )}
                {adminAction === 'delete' && (
                  <button
                    onClick={deleteAdminUser}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;