import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { taskService, projectService } from '../services/dataService';
import { Task, Project } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FolderKanban,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, projectsData] = await Promise.all([
          taskService.getTasks(),
          projectService.getProjects()
        ]);
        setTasks(tasksData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    { 
      label: 'Dự án', 
      value: projects.length, 
      icon: FolderKanban, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Công việc', 
      value: tasks.length, 
      icon: Clock, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-500/10' 
    },
    { 
      label: 'Hoàn thành', 
      value: tasks.filter(t => t.status === 'done').length, 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      label: 'Quá hạn', 
      value: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length, 
      icon: AlertCircle, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10' 
    },
  ];

  if (loading) {
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
            {tasks.slice(0, 5).map(task => (
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
                    {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : 'Không có hạn'}
                  </p>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 italic">Chưa có công việc nào.</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Dự án hiện tại</h2>
            <button className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-2 transition-all">
              Thêm mới <ArrowRight className="w-4 h-4" />
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
          </div>
        </section>
      </div>
    </div>
  );
}
