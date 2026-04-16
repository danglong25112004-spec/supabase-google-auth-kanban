import { useAuth } from '../hooks/useAuth';
import { UserCircle, Mail, Calendar, ShieldCheck, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export function Profile() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Hồ sơ cá nhân</h1>
        <p className="text-slate-400">Quản lý thông tin tài khoản và cài đặt của bạn.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <img 
              src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.user_metadata?.full_name || 'User'}`} 
              alt="Avatar" 
              className="w-24 h-24 rounded-3xl border-4 border-slate-900 shadow-xl"
            />
            <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all">
              Chỉnh sửa hồ sơ
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.user_metadata?.full_name}</h2>
              <p className="text-slate-400">Thành viên từ {new Date(user?.created_at || '').toLocaleDateString('vi-VN')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Vai trò</p>
                  <p className="text-white font-medium">Quản trị viên</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Lần đăng nhập cuối</p>
                  <p className="text-white font-medium">{new Date(user?.last_sign_in_at || '').toLocaleString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="p-2.5 bg-amber-500/10 rounded-xl">
                  <UserCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">ID Người dùng</p>
                  <p className="text-white font-medium truncate max-w-[150px]">{user?.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 px-8 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold rounded-2xl transition-all group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          Đăng xuất tài khoản
        </button>
      </div>
    </div>
  );
}
