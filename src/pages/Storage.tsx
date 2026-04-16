import { Archive, Search, Filter } from 'lucide-react';

export function Storage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Archive className="w-6 h-6 text-indigo-500" />
            <h1 className="text-3xl font-bold text-white">Lưu trữ</h1>
          </div>
          <p className="text-slate-400">Xem lại các công việc đã hoàn thành hoặc đã lưu trữ.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-2">
          <Archive className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-bold text-white">Kho lưu trữ trống</h3>
        <p className="text-slate-500 max-w-xs">Các công việc bạn lưu trữ sẽ xuất hiện tại đây để bạn có thể xem lại bất cứ lúc nào.</p>
      </div>
    </div>
  );
}
