import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../redux/slices/user.slice";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  Inbox, 
  ArrowRight, 
  TreePine, 
  Sparkles, 
  X, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const helperText = {
  email: { required: "E-posta adresi gereklidir", invalid: "Geçersiz e-posta formatı" },
  password: { required: "Şifre gereklidir", short: "Şifre en az 6 karakter olmalı" },
  name: { required: "Ad alanı zorunludur" },
  lastName: { required: "Soyad alanı zorunludur" },
};

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // States
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    const processRequest = async () => {
      const res = await dispatch(registerNewUser(data));
      if (registerNewUser.fulfilled.match(res)) {
        setEmailValue(data.email);
        setShowModal(true);
        reset();
        return "Aramıza hoş geldin! 🎉";
      }
      throw new Error(res.payload || "Kayıt işlemi sırasında bir hata oluştu.");
    };

    toast.promise(processRequest(), {
      loading: "Hesabınız oluşturuluyor...",
      success: (msg) => msg,
      error: (err) => err.message,
    });
  };

  const inputStyle = "w-full h-14 pl-12 pr-12 bg-white/50 border border-green-900/5 rounded-2xl text-green-950 placeholder:text-green-900/20 focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium shadow-sm";

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      {/* --- FORM KARTI --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md p-10 md:p-12 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        {/* Dekoratif Arka Plan */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner relative">
            <TreePine className="text-green-600" size={36} />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-2 right-2 text-green-400"
            >
              <Sparkles size={16} />
            </motion.div>
          </div>
          <h2 className="text-4xl font-black text-green-950 tracking-tighter leading-none italic">
            Atakent'e Katıl
          </h2>
          <p className="text-green-800/50 text-sm font-medium mt-3">
            Doğanın kalbinde lezzetli bir yolculuğa başlayın.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Ad & Soyad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={18} />
              <input 
                placeholder="Ad" 
                className={`${inputStyle} ${errors.name ? "border-red-300" : ""}`} 
                {...register("name", { required: helperText.name.required })} 
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={18} />
              <input 
                placeholder="Soyad" 
                className={`${inputStyle} ${errors.lastName ? "border-red-300" : ""}`} 
                {...register("lastName", { required: helperText.lastName.required })} 
              />
            </div>
          </div>

          {/* E-posta */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={18} />
            <input 
              type="email" 
              placeholder="E-posta Adresiniz" 
              className={`${inputStyle} ${errors.email ? "border-red-300" : ""}`} 
              {...register("email", { required: helperText.email.required })} 
            />
          </div>

          {/* Şifre */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Şifre" 
              className={`${inputStyle} ${errors.password ? "border-red-300" : ""}`} 
              {...register("password", { 
                required: helperText.password.required, 
                minLength: { value: 6, message: helperText.password.short } 
              })} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700/40 hover:text-green-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[10px] font-bold ml-4 uppercase">{errors.password.message}</p>}

          <Button type="submit" className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-green-600/20 active:scale-95 transition-all mt-4 group">
            Kayıt Ol <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="flex flex-col gap-3 text-center pt-6">
            <Link to="/authentication/login" className="text-xs font-black text-green-800/40 hover:text-green-700 uppercase tracking-widest transition-colors">
              Zaten üye misiniz? Giriş yapın
            </Link>
          </div>
        </form>
      </motion.div>

      {/* --- BAŞARI MODALI --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-green-950/20 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-center z-10 border border-white"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-green-900/20 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                <Inbox className="text-green-600" size={40} />
                <Sparkles className="absolute -top-1 -right-1 text-orange-400" size={20} />
              </div>

              <h3 className="text-2xl font-black text-green-950 mb-3 tracking-tighter">E-postanı Kontrol Et!</h3>
              <p className="text-green-900/60 text-sm mb-8 leading-relaxed">
                Kaydın başarıyla tamamlandı. <br />
                <span className="font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-lg inline-block my-1">
                  {emailValue}
                </span> <br />
                adresine bir aktivasyon linki gönderdik.
              </p>

              <div className="space-y-3">
                <Button 
                  onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox`, "_blank")}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-2xl font-black shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  E-postayı Aç <Mail size={18} />
                </Button>
                
                <button 
                  onClick={() => {
                    setShowModal(false);
                    navigate("/authentication/login");
                  }}
                  className="text-xs font-bold text-green-900/30 hover:text-green-900 uppercase tracking-widest transition-all"
                >
                  Anladım, Giriş Yap
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}