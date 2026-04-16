import { Users, UserPlus } from 'lucide-react';

export function Team() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
      <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 shadow-xl">
        <Users className="w-12 h-12 text-slate-700" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold text-white">Tính năng Nhóm</h2>
        <p className="text-slate-400">Bạn hiện đang là thành viên duy nhất của nhóm này. Hãy mời thêm đồng nghiệp để cùng cộng tác.</p>
      </div>
      <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
        <UserPlus className="w-5 h-5" />
        Mời thành viên
      </button>
    </div>
  );
}
