import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resendVerify, resetError } from "../redux/slices/user.slice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, RefreshCw, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResendVerification() {
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    await dispatch(resendVerify(data));
  };

  const inputStyle = "w-full h-14 pl-12 bg-white/50 border border-green-900/5 rounded-2xl text-green-950 placeholder:text-green-900/20 focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium shadow-sm";

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 md:p-12 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        {/* Dekoratif Arka Plan */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-green-500/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
            <RefreshCw className="text-green-600" size={36} />
          </div>
          <h2 className="text-3xl font-black text-green-950 tracking-tighter italic">Onay E-postası</h2>
          <p className="text-green-800/50 text-sm font-medium mt-2 leading-relaxed">
            Hesabınızı doğrulamak için bilgilerinizi girin, size yeni bir doğrulama bağlantısı gönderelim.
          </p>
        </div>

        {/* Başarı Mesajı */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-100 p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-sm"
          >
            <div className="bg-green-500 rounded-full p-1 text-white">
              <RefreshCw size={12} />
            </div>
            <p className="text-green-700 text-xs font-bold uppercase tracking-wide leading-tight">{message}</p>
          </motion.div>
        )}

        {/* Hata Mesajı */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-8 shadow-sm"
          >
            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {/* E-posta Alanı */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-[0.2em] ml-4">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={20} />
              <input
                type="email"
                placeholder="ornek@posta.com"
                className={`${inputStyle} ${errors.email ? "border-red-300" : ""}`}
                {...register("email", { required: "E-posta adresi gereklidir" })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.email.message}</p>}
          </div>

          {/* Şifre Alanı */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-[0.2em] ml-4">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className={`${inputStyle} ${errors.password ? "border-red-300" : ""}`}
                {...register("password", { required: "Şifre gereklidir" })}
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 active:scale-[0.98] transition-all mt-4 group"
          >
            {isLoading ? (
              "Gönderiliyor..."
            ) : (
              <span className="flex items-center gap-3">
                Bağlantıyı Gönder <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <Link 
            to="/authentication/login" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-green-800/40 hover:text-green-700 uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Giriş Sayfasına Dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}