import { useEffect, useState, useMemo } from 'react';
import { Archive, Search, Trash2, Calendar, Star, Clock } from 'lucide-react';
import { taskService } from '../services/dataService';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

export function Storage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadArchivedTasks = async () => {
    setLoading(true);
    try {
      // Lấy toàn bộ task và lọc những cái có is_starred = true
      const allTasks = await taskService.getTasks();
      setTasks(allTasks.filter(t => t.is_starred));
    } catch (error) {
      console.error('Error loading archived tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    const lowerSearch = searchTerm.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowerSearch) || 
      t.description?.toLowerCase().includes(lowerSearch)
    );
  }, [tasks, searchTerm]);

  const handleUnarchive = async (task: Task) => {
    try {
      await taskService.updateTask(task.id, { is_starred: false });
      setTasks(prev => prev.filter(t => t.id !== task.id));
    } catch (error) {
      console.error('Error unarchiving task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn công việc này?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Archive className="w-6 h-6 text-indigo-500" />
            <h1 className="text-3xl font-bold text-white">Lưu trữ</h1>
          </div>
          <p className="text-slate-400">Xem lại các công việc đã quan trọng hoặc đã đánh dấu sao.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={loadArchivedTasks}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Làm mới"
          >
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-900 border border-slate-800 rounded-3xl" />
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map(task => (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-indigo-500/50 transition-all shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 -mr-8 -mt-8 rounded-full blur-2xl" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg",
                    task.priority === 'High' ? "bg-rose-500/10 text-rose-500" :
                    task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                    "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {task.priority}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUnarchive(task)}
                      className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                      title="Bỏ lưu trữ"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-3 mb-6 leading-relaxed flex-1">{task.description || 'Không có mô tả.'}</p>

                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium">
                      {new Date(task.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.status === 'done' ? "bg-emerald-500" :
                      task.status === 'doing' ? "bg-blue-500" : "bg-slate-500"
                    )} />
                    <span className="text-[10px] uppercase font-bold text-slate-400">{task.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-2 shadow-inner">
            <Archive className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white">Kho lưu trữ trống</h3>
          <p className="text-slate-500 max-w-xs leading-relaxed">
            {searchTerm 
              ? `Không tìm thấy kết quả nào cho "${searchTerm}"`
              : "Các công việc bạn đánh dấu sao sẽ được chuyển vào đây để không gian làm việc của bạn gọn gàng hơn."
            }
          </p>
        </div>
      )}
    </div>
  );
}
