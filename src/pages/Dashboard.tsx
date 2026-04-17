import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { taskService, projectService } from '../services/dataService';
import { Task, Project } from '../types';
import { useSearch } from '../hooks/useSearch';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FolderKanban,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const { searchTerm } = useSearch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    description: ''
  });

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    const lowerSearch = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerSearch) || 
      task.description?.toLowerCase().includes(lowerSearch)
    );
  }, [tasks, searchTerm]);

  const loadData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects()
      ]);
      setTasks(tasksData || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('[Dashboard] Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectService.createProject(projectFormData.name, projectFormData.description);
      setIsProjectModalOpen(false);
      setProjectFormData({ name: '', description: '' });
      loadData();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const stats = [
    { 
      label: 'Dự án', 
      value: projects?.length || 0, 
      icon: FolderKanban, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Công việc', 
      value: searchTerm ? filteredTasks.length : (tasks?.length || 0), 
      icon: Clock, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-500/10' 
    },
    { 
      label: 'Hoàn thành', 
      value: (searchTerm ? filteredTasks : tasks).filter(t => t.status === 'done').length, 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      label: 'Việc gấp', 
      value: (searchTerm ? filteredTasks : tasks).filter(t => t.priority === 'High' && t.status !== 'done').length, 
      icon: AlertCircle, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10' 
    },
  ];

  if (loading) {
    console.log('[Dashboard] Rendering loading state');
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  console.log('[Dashboard] Rendering main UI');
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">
          Chào mừng trở lại, {user?.user_metadata?.full_name?.split(' ')[0] || 'bạn'}! 👋
        </h1>
        <p className="text-slate-400">Dưới đây là tổng quan về công việc của bạn hôm nay.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Công việc gần đây</h2>
            <Link to="/app/board" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-2 transition-all">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {filteredTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'High' ? 'bg-rose-500' : 
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.status.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400">
                    {new Date(task.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 italic">
                  {searchTerm ? 'Không tìm thấy công việc nào phù hợp.' : 'Chưa có công việc nào.'}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Dự án hiện tại</h2>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-2 transition-all"
            >
              Thêm mới <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {projects.map(project => (
              <div key={project.id} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all">
                <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{project.description || 'Không có mô tả.'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full">
                    {tasks.filter(t => t.project_id === project.id).length} công việc
                  </span>
                  <span className="text-xs text-slate-500">
                    Tạo ngày {new Date(project.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-500 italic">Chưa có dự án nào.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Tạo dự án mới</h2>
                  <button 
                    onClick={() => setIsProjectModalOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tên dự án</label>
                    <input
                      required
                      type="text"
                      value={projectFormData.name}
                      onChange={e => setProjectFormData({ ...projectFormData, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="VD: Website Marketing, Mobile App..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mô tả</label>
                    <textarea
                      value={projectFormData.description}
                      onChange={e => setProjectFormData({ ...projectFormData, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                      placeholder="Nhập mô tả dự án..."
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsProjectModalOpen(false)}
                      className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      Tạo dự án
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
