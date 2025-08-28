  import { Search, Bell, LogOut } from 'lucide-react';

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin';
  }

  const Header = () => {
    return (
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-row md:items-center justify-between px-4 md:px-6 py-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-yellow-400 rounded-lg" />
            <h1 className="text-xl font-semibold text-white">Kofinity Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                placeholder="Search..."
                className="w-full md:w-64 pl-10 bg-slate-800/50 border border-slate-700 rounded-lg text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button className="rounded-full p-2 hover:bg-slate-700 text-slate-400">
              <Bell size={20} />
            </button> */}
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <button
              onClick={handleLogout}
              className="flex   w-8 h-8 p-2 rounded-full items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              
            </button>
          </div>
        </div>
      </header>
    );
  };

  export default Header;