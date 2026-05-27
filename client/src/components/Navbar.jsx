import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/redux/slices/user.slice";
import {
  ShoppingBasket,
  Menu,
  LogOut,
  Home,
  UserCircle,
  LayoutDashboard,
  Leaf,
  ClipboardList, // 🌟 اضافه شدن آیکون سفارشات
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

const getLinkClass = (path, currentPath) =>
  currentPath === path
    ? "rounded-xl bg-green-600/10 px-4 py-2 text-sm font-bold text-green-700 flex items-center gap-2 border border-green-600/20 shadow-sm"
    : "rounded-xl px-4 py-2 text-sm font-medium text-green-800/70 hover:bg-green-600/5 hover:text-green-800 flex items-center gap-2 transition-all duration-300";

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const NavLinks = ({ user, currentPath, isMobile, onLogout, cartCount }) => (
  <div
    className={`flex ${isMobile ? "flex-col gap-3 mt-8" : "space-x-2 items-center"}`}
  >
    <Link to="/" className={getLinkClass("/", currentPath)}>
      <Home size={18} /> Ana Sayfa
    </Link>

    {user ? (
      <>
        {user.admin ? (
          <Link
            to="/admin/panel"
            className={getLinkClass("/admin/panel", currentPath)}
          >
            <LayoutDashboard size={18} /> Panel
          </Link>
        ) : (
          <>
            {/* 🌟 اضافه شدن لینک سفارشات من برای مشتری */}
            <Link to="/my-orders" className={getLinkClass("/my-orders", currentPath)}>
              <ClipboardList size={18} /> Siparişlerim
            </Link>

            <Link to="/basket" className={`${getLinkClass("/basket", currentPath)} relative`}>
              <div className="relative">
                <ShoppingBasket size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Sepetim</span>
            </Link>
          </>
        )}

        {isMobile && (
          <button
            className="flex items-center gap-2 text-red-600 px-4 py-3 text-sm font-bold hover:bg-red-50 rounded-xl transition-all text-left mt-4 border border-red-100 w-full"
            onClick={onLogout}
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        )}
      </>
    ) : (
      <>
        <Link
          to="/authentication/login"
          className={getLinkClass("/authentication/login", currentPath)}
        >
          Giriş Yap
        </Link>
        <Link
          to="/authentication/signup"
          className="rounded-xl bg-green-600 px-5 py-2 text-sm font-black text-white hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all text-center"
        >
          Kayıt Ol
        </Link>
      </>
    )}
  </div>
);

export default function Navbar() {
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart?.items) || []; // جلوگیری از ارور احتمالی کارت خالی
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/authentication/login");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg shadow-black/5 rounded-[2rem] h-16 flex items-center justify-between px-6">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-3 group">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:rotate-12 transition-transform duration-300">
              <Leaf className="text-white" size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-black text-xl text-green-900 leading-none tracking-tighter">
                ATAKENT
              </h1>
              <span className="text-[11px] font-bold text-green-700/70 uppercase tracking-[0.2em] leading-none mt-1">
                Çay Bahçesi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavLinks user={user} currentPath={location.pathname} cartCount={cartCount} />
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex items-center gap-4 border-l border-green-900/10 pl-4 ml-2">
                <div className="flex flex-col items-end">
                  <span className="text-green-900 text-xs font-black">
                    {capitalize(user.name)}
                  </span>
                  <span className="text-[10px] text-green-700/60 font-bold uppercase tracking-tighter">
                    {user.admin ? "Admin" : "Müşteri"}
                  </span>
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-100"
                  onClick={handleLogout}
                  title="Çıkış Yap"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}

            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden flex items-center gap-2">
              {user && !user.admin && cartCount > 0 && (
                <Link to="/basket" className="relative p-2 text-green-800 bg-green-600/5 rounded-xl">
                  <ShoppingBasket size={22} />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                </Link>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl text-green-800 hover:bg-green-600/10 transition-all cursor-pointer">
                    <Menu size={26} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-white/95 backdrop-blur-lg border-l border-green-100 w-[280px] rounded-l-[2.5rem]"
                >
                  <SheetHeader className="text-left border-b border-green-50 pb-6 mt-4">
                    <SheetTitle className="text-green-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCircle className="text-green-600" size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black">
                          {user ? capitalize(user.name) : "Hoş Geldiniz"}
                        </span>
                        <span className="text-[10px] text-green-600/60 uppercase">
                          Menü Navigasyon
                        </span>
                      </div>
                    </SheetTitle>
                    <SheetDescription className="sr-only">Navigasyon menüsü</SheetDescription>
                  </SheetHeader>

                  <NavLinks
                    user={user}
                    currentPath={location.pathname}
                    isMobile={true}
                    onLogout={handleLogout}
                    cartCount={cartCount}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}