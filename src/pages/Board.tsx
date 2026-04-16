import React, { useEffect, useState } from 'react';
import { taskService, projectService } from '../services/dataService';
import { Task, Project, TaskStatus, TaskPriority } from '../types';
import { 
  Plus, 
  MoreVertical, 
  Star, 
  Calendar, 
  Trash2, 
  Edit2,
  CheckCircle2,
  Clock,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    due_date: ''
  });

  useEffect(() => {
    const loadData = async () => {
      console.log('[Board] Loading projects...');
      try {
        const projectsData = await projectService.getProjects();
        console.log('[Board] Projects loaded:', projectsData?.length);
        setProjects(projectsData || []);
        if (projectsData && projectsData.length > 0) {
          setSelectedProjectId(projectsData[0].id);
        }
      } catch (error) {
        console.error('[Board] Error loading projects:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      console.log('[Board] Project selected, loading tasks for:', selectedProjectId);
      loadTasks();
    }
  }, [selectedProjectId]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await taskService.getTasks(selectedProjectId);
      console.log('[Board] Tasks loaded:', tasksData?.length);
      setTasks(tasksData || []);
    } catch (error) {
      console.error('[Board] Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'Medium',
        due_date: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData);
      } else {
        // Ensure project_id is null if selectedProjectId is empty
        const projectId = selectedProjectId && selectedProjectId !== "" ? selectedProjectId : null;
        
        await taskService.createTask({
          ...formData,
          project_id: projectId as string
        });
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (error) {
      // Error is already handled in taskService (alert + console.error)
      console.error('Board handleSubmit error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      try {
        await taskService.deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleStar = async (task: Task) => {
    try {
      await taskService.updateTask(task.id, { is_starred: !task.is_starred });
      loadTasks();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const columns: { title: string; status: TaskStatus; color: string }[] = [
    { title: 'Cần làm', status: 'todo', color: 'bg-slate-400' },
    { title: 'Đang làm', status: 'doing', color: 'bg-blue-500' },
    { title: 'Hoàn thành', status: 'done', color: 'bg-emerald-500' },
  ];

  return (
    <div className="h-full flex flex-col space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layout className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Bảng Kanban</h1>
          </div>
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Thêm công việc
        </button>
      </header>

      <div className="flex-1 overflow-x-auto pb-8">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map(column => (
            <div key={column.status} className="w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", column.color)} />
                  <h3 className="font-bold text-slate-200">{column.title}</h3>
                  <span className="text-xs font-bold bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                    {(tasks || []).filter(t => t.status === column.status).length}
                  </span>
                </div>
                <button className="p-1 text-slate-500 hover:text-slate-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 min-h-[200px]">
                {(tasks || [])
                  .filter(t => t.status === column.status)
                  .map(task => (
                    <motion.div
                      layout
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                          task.priority === 'High' ? "bg-rose-500/10 text-rose-500" :
                          task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                          "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {task.priority}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(task)}
                            className="p-1.5 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(task.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{task.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleStar(task)}
                            className={cn(
                              "transition-all",
                              task.is_starred ? "text-amber-500" : "text-slate-600 hover:text-slate-400"
                            )}
                          >
                            <Star className={cn("w-4 h-4", task.is_starred && "fill-current")} />
                          </button>
                          {task.due_date && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-medium">
                                {new Date(task.due_date).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex -space-x-2">
                          <img 
                            src={`https://ui-avatars.com/api/?name=User&background=random`} 
                            className="w-6 h-6 rounded-full border-2 border-slate-900" 
                            alt="Assignee" 
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                
                <button 
                  onClick={() => handleOpenModal()}
                  className="w-full py-3 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 hover:text-slate-400 hover:border-slate-700 hover:bg-slate-900/50 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Thêm mới
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tiêu đề</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Nhập tiêu đề công việc..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                      placeholder="Nhập mô tả chi tiết..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Trạng thái</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="todo">Cần làm</option>
                        <option value="doing">Đang làm</option>
                        <option value="done">Hoàn thành</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ưu tiên</label>
                      <select
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="Low">Thấp</option>
                        <option value="Medium">Trung bình</option>
                        <option value="High">Cao</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hạn chót</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      {editingTask ? 'Cập nhật' : 'Tạo mới'}
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
