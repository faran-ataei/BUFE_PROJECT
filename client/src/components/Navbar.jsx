import { logout } from "@/redux/slices/user.slice";
import { ShoppingBasket } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const location = useLocation(); // aktif route bilgisi

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      alert("Çıkış yapıldı!");
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white"
      : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white";

  if (user) {
    return (
      <nav className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  src="/logo/logo.png"
                  alt="Your Company"
                  className="h-10 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link to="/" className={linkClass("/")}>
                    Ana Sayfa
                  </Link>
                  <Link to="/basket" className={linkClass("/basket")}>
                    <span className="flex items-center gap-2">
                      Sepet <ShoppingBasket />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 font-bold">
                Hoşgeldin {capitalize(user.name)} {capitalize(user.lastName)}
              </span>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                onClick={handleLogout}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="relative bg-gray-800/50 text-white after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex shrink-0 items-center">
            <img
              src="/logo/logo.png"
              alt="Your Company"
              className="h-10 w-auto"
            />
            <h1 className="font-bold text-xl">Atakent Çay Bahçesi</h1>
          </div>
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              <Link to="/" className={linkClass("/")}>
                Ana Sayfa
              </Link>
              <Link
                to="/authentication/login"
                className={linkClass("/authentication/login")}
              >
                Giriş Yap
              </Link>
              <Link
                to="/authentication/signup"
                className={linkClass("/authentication/signup")}
              >
                Hesap Oluştur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
