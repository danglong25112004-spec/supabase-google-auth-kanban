import { useEffect, useState } from 'react';
import { taskService } from '../services/dataService';
import { Task } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

export function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const statusData = [
    { name: 'Cần làm', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'Đang làm', value: tasks.filter(t => t.status === 'doing').length },
    { name: 'Hoàn thành', value: tasks.filter(t => t.status === 'done').length },
  ];

  const priorityData = [
    { name: 'Thấp', value: tasks.filter(t => t.priority === 'Low').length, color: '#10b981' },
    { name: 'Trung bình', value: tasks.filter(t => t.priority === 'Medium').length, color: '#f59e0b' },
    { name: 'Cao', value: tasks.filter(t => t.priority === 'High').length, color: '#f43f5e' },
  ];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-10 w-48 bg-slate-800 rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-96 bg-slate-800 rounded-3xl" />
      <div className="h-96 bg-slate-800 rounded-3xl" />
    </div>
  </div>;

  return (
    <div className="space-y-10">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Phân tích công việc</h1>
        </div>
        <p className="text-slate-400">Trực quan hóa hiệu suất và tiến độ của bạn.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Trạng thái công việc</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Mức độ ưu tiên</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {priorityData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
