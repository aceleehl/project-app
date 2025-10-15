import React, { useState, useEffect } from 'react';
import { Calendar, Users, BarChart3, MessageSquare, Clock, AlertTriangle, Plus, Edit3, Trash2, CheckCircle, XCircle, Send, UserPlus, Link, User, UserX, UserCheck, TrendingUp, Target, Activity, FileText, Award, PieChart } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      status: 'in-progress',
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
  const [projectAction, setProjectAction] = useState('add'); // 'add', 'edit'
  const [teamMemberAction, setTeamMemberAction] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  
  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  
  // Task form state for project creation
  const [projectTasks, setProjectTasks] = useState([
    { id: 1, name: '', assignee: '', startDate: '', endDate: '' }
  ]);
  
  // Individual task form state
  const [taskForm, setTaskForm] = useState({
    name: '',
    assignee: '',
    startDate: '',
    endDate: ''
  });

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

  const createProject = () => {
    if (projectForm.name && projectForm.startDate && projectForm.endDate) {
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
    if (selectedProject && projectForm.name && projectForm.startDate && projectForm.endDate) {
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
      setTaskForm({ name: '', assignee: '', startDate: '', endDate: '' });
      setShowTaskModal(false);
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

  const deleteTeamMember = (memberId) => {
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
                <div className="text-xs text-gray-500">{task.assignee || 'Unassigned'}</div>
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

  const resetProjectForm = () => {
    setProjectForm({ name: '', description: '', startDate: '', endDate: '' });
    setProjectTasks([{ id: 1, name: '', assignee: '', startDate: '', endDate: '' }]);
  };

  const addProjectTask = () => {
    setProjectTasks([...projectTasks, { 
      id: Date.now(), 
      name: '', 
      assignee: '', 
      startDate: '', 
      endDate: '' 
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

  // Initialize form when editing project
  useEffect(() => {
    if (showProjectModal && projectAction === 'edit' && selectedProject) {
      setProjectForm({
        name: selectedProject.name,
        description: selectedProject.description,
        startDate: selectedProject.startDate,
        endDate: selectedProject.endDate
      });
      
      // Initialize tasks form
      if (selectedProject.tasks.length > 0) {
        setProjectTasks(selectedProject.tasks.map(task => ({
          id: task.id,
          name: task.name,
          assignee: task.assignee,
          startDate: task.startDate,
          endDate: task.endDate
        })));
      } else {
        setProjectTasks([{ id: 1, name: '', assignee: '', startDate: '', endDate: '' }]);
      }
    } else if (showProjectModal && projectAction === 'add') {
      resetProjectForm();
    }
  }, [showProjectModal, projectAction, selectedProject]);

  const [newTeamMember, setNewTeamMember] = useState({ name: '', email: '', role: '' });

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
                    <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
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
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Team Performance</h2>
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
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
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
                            <div className="font-medium text-gray-900">{projectCompletion.percentage}%</div>
                            <div className="text-xs text-gray-500">Project Completion</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setActiveTab('gantt');
                          }}
                          className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const projectCompletion = getProjectCompletion(project);
                return (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {project.teamMembers.length} members
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span>{projectCompletion.completed}/{projectCompletion.total} tasks completed</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <PieChart className="h-4 w-4 mr-2" />
                          <span>Project Completion: {projectCompletion.percentage}%</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setActiveTab('gantt');
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                        >
                          View Timeline
                        </button>
                        <button
                          onClick={() => {
                            setProjectAction('edit');
                            setSelectedProject(project);
                            setShowProjectModal(true);
                          }}
                          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Edit3 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'gantt' && selectedProject && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                <p className="text-gray-600">{selectedProject.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setProjectAction('edit');
                    setShowProjectModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-medium"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Project</span>
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Back to Projects
                </button>
              </div>
            </div>
            
            {/* Project Completion Summary */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Project Completion</h3>
                  <p className="text-sm text-gray-600">
                    {getProjectCompletion(selectedProject).completed}/{getProjectCompletion(selectedProject).total} tasks completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{getProjectCompletion(selectedProject).percentage}%</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${getProjectCompletion(selectedProject).percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Members Section with Task Stats */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Team Members & Task Stats</h3>
                <button
                  onClick={() => {
                    setTeamMemberAction('add');
                    setShowTeamMemberModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Member</span>
                </button>
              </div>
              <div className="space-y-3">
                {selectedProject.teamMembers.map((memberName, index) => {
                  const member = teamMembers.find(m => m.name === memberName);
                  const taskStats = getMemberTaskStats(memberName);
                  return (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {memberName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{memberName}</div>
                          <div className="text-xs text-gray-500">
                            {taskStats.completed}/{taskStats.total} tasks completed
                          </div>
                        </div>
                      </div>
                      {member && (
                        <button
                          onClick={() => {
                            setTeamMemberAction('delete');
                            setSelectedTeamMember(member);
                            setShowTeamMemberModal(true);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {selectedProject.teamMembers.length === 0 && (
                  <p className="text-gray-500 text-sm">No team members assigned</p>
                )}
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {renderGanttChart(selectedProject)}
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                <button
                  onClick={() => {
                    setSelectedProject(selectedProject);
                    setShowTaskModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
              </div>
              <div className="space-y-4">
                {selectedProject.tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{task.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Assigned to: {task.assignee || 'Unassigned'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(task.startDate)} - {formatDate(task.endDate)}
                      {task.completedDate && (
                        <span className="ml-2 text-green-600">
                          Completed: {formatDate(task.completedDate)}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <Clock className="h-4 w-4" />
                        <span>In Progress</span>
                      </button>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'pending')}
                        className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Pending</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">All Tasks</h2>
              <p className="text-gray-600 text-sm mt-1">View tasks across all projects with project links</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {projects.flatMap(project => 
                  project.tasks.map(task => ({
                    ...task,
                    projectName: project.name,
                    projectId: project.id
                  }))
                ).map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.name}</h4>
                        <div className="flex items-center text-sm text-blue-600 mt-1">
                          <Link className="h-3 w-3 mr-1" />
                          <button
                            onClick={() => {
                              const project = projects.find(p => p.id === task.projectId);
                              if (project) {
                                setSelectedProject(project);
                                setActiveTab('gantt');
                              }
                            }}
                            className="hover:underline"
                          >
                            {task.projectName}
                          </button>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Assigned to: {task.assignee || 'Unassigned'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due: {formatDate(task.endDate)}
                      {task.completedDate && (
                        <span className="ml-2 text-green-600">
                          Completed: {formatDate(task.completedDate)}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      <button className="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded text-sm font-medium transition-colors">
                        Request Extension
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                  <p className="text-gray-600 text-sm mt-1">Manage your team members and view their task statistics</p>
                </div>
                <button
                  onClick={() => {
                    setTeamMemberAction('add');
                    setShowTeamMemberModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Team Member</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Completed</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getTeamMembersWithProjects().map((member) => {
                      const taskStats = getMemberTaskStats(member.name);
                      return (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-medium text-sm">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.projects.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {taskStats.completed}/{taskStats.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setTeamMemberAction('edit');
                                setSelectedTeamMember(member);
                                setNewTeamMember({ name: member.name, email: member.email, role: member.role });
                                setShowTeamMemberModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setTeamMemberAction('delete');
                                setSelectedTeamMember(member);
                                setShowTeamMemberModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {projectAction === 'add' ? 'Create New Project' : 'Edit Project'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Tasks Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Project Tasks</h4>
                  <button
                    onClick={addProjectTask}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Task</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {projectTasks.map((task, index) => (
                    <div key={task.id} className="border border-gray-200 rounded-md p-3">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={task.name}
                            onChange={(e) => updateProjectTask(task.id, 'name', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Task name"
                          />
                        </div>
                        <div className="col-span-3">
                          <select
                            value={task.assignee}
                            onChange={(e) => updateProjectTask(task.id, 'assignee', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Unassigned</option>
                            {teamMembers.map((member) => (
                              <option key={member.id} value={member.name}>{member.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="date"
                            value={task.startDate}
                            onChange={(e) => updateProjectTask(task.id, 'startDate', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="date"
                            value={task.endDate}
                            onChange={(e) => updateProjectTask(task.id, 'endDate', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          {projectTasks.length > 1 && (
                            <button
                              onClick={() => removeProjectTask(task.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
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
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={projectAction === 'add' ? createProject : updateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {projectAction === 'add' ? 'Create Project' : 'Update Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                <input
                  type="text"
                  value={taskForm.name}
                  onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <select
                  value={taskForm.assignee}
                  onChange={(e) => setTaskForm({...taskForm, assignee: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select team member</option>
                  {selectedProject.teamMembers.map((memberName) => (
                    <option key={memberName} value={memberName}>{memberName}</option>
                  ))}
                  <option value="">Unassigned</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={taskForm.startDate}
                    onChange={(e) => setTaskForm({...taskForm, startDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={taskForm.endDate}
                    onChange={(e) => setTaskForm({...taskForm, endDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Modal */}
      {showTeamMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {teamMemberAction === 'add' && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Team Member</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newTeamMember.email}
                      onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter role (e.g., Developer, Designer)"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowTeamMemberModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTeamMember}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Member
                  </button>
                </div>
              </>
            )}
            
            {teamMemberAction === 'edit' && selectedTeamMember && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Team Member</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newTeamMember.email}
                      onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter role"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowTeamMemberModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateTeamMember}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Member
                  </button>
                </div>
              </>
            )}
            
            {teamMemberAction === 'delete' && selectedTeamMember && (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserX className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Team Member</h3>
                  <p className="text-gray-600">
                    Are you sure you want to delete <span className="font-medium">{selectedTeamMember.name}</span>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This will remove them from all projects and unassign their tasks permanently.
                  </p>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowTeamMemberModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTeamMember(selectedTeamMember.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Member
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;