import { Smartphone, LayoutGrid, User, LogOut, Shield } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

interface NavbarProps {
  user: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
  onLogoClick: () => void;
}

export default function Navbar({ user, onLogin, onLogout, isAdmin, onAdminToggle, onLogoClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-midnight/60 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-brand-electric rounded flex items-center justify-center cursor-pointer" onClick={onLogoClick}>
            <span className="text-black font-black text-lg">+994X</span>
          </div>
          <span 
            className="text-2xl font-bold tracking-tight text-white font-display cursor-pointer" 
            onClick={onLogoClick}
          >
            Xəttim<span className="text-brand-electric">.az</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-white max-w-[150px] truncate">{user.email}</span>
                {isAdmin && (
                  <button 
                    onClick={onAdminToggle}
                    className="text-[9px] text-brand-electric uppercase tracking-widest font-black hover:underline px-1 py-0.5 bg-brand-electric/10 rounded"
                  >
                    Admin Panel
                  </button>
                )}
              </div>
              <button 
                onClick={onLogout}
                className="bg-gray-800 text-gray-400 p-2.5 rounded-full hover:text-red-400 transition-all border border-gray-700"
                title="Çıxış"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-white text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Daxil ol
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
