import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  HelpCircle,
  MessageSquare,
  Smartphone,
  LogOut,
  ChevronRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { UserButton, useClerk } from "@clerk/clerk-react";
import clsx from "clsx";

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const navItems = [
    { name: "Layanan", path: "/admin/features", icon: Zap },
    { name: "Produk/Harga", path: "/admin/services", icon: LayoutDashboard },
    { name: "Portofolio", path: "/admin/portfolio", icon: Briefcase },
    { name: "FAQ", path: "/admin/faq", icon: HelpCircle },
    { name: "Testimoni", path: "/admin/testimonials", icon: MessageSquare },
    { name: "Numpak App", path: "/admin/numpak", icon: Smartphone },
  ];

  return (
    <div className="flex min-h-screen bg-[#05091D] text-white font-poppins">
      <aside className="w-64 bg-[#0C1838] border-r border-[#334679] flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-3 border-b border-[#334679]">
          <img src="/images/sakte.png" className="w-10 h-auto" alt="logo" />
          <span className="font-bold text-lg tracking-wider uppercase text-p1">
            Admin
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                pathname === item.path
                  ? "bg-p1/10 text-p1 border border-p1/20"
                  : "text-p5 hover:bg-[#334679]/30 hover:text-white",
              )}
            >
              <item.icon
                size={20}
                className={clsx(
                  pathname === item.path
                    ? "text-p1"
                    : "text-p5 group-hover:text-white",
                )}
              />
              <span className="text-sm font-medium">{item.name}</span>
              {pathname === item.path && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#334679] space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-p5 hover:bg-p3/10 hover:text-p3 transition-all"
          >
            <ExternalLink size={20} />
            <span className="text-sm">Lihat Website</span>
          </a>
          <button
            onClick={() => signOut(() => navigate("/"))}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-[#0C1838]/50 backdrop-blur-md border-b border-[#334679] flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="text-xl font-semibold capitalize">
            {pathname.split("/").pop()}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-p5">Halo, Admin</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <div className="p-10 container mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
