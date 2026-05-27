import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetError } from "../redux/slices/user.slice";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Coffee, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const helperText = {
  email: { required: "E-posta adresi gereklidir", invalid: "Geçersiz e-posta adresi" },
  password: { required: "Şifre gereklidir", short: "Şifre en az 6 karakter olmalıdır" },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, isLoading } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
    dispatch(resetError());
  }, [user, navigate, dispatch]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Hoş Geldiniz!");
      navigate("/");
    } else {
      toast.error("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  // Diğer sayfalardakiyle aynı tutarlı stil (pr-12 göz ikonu için yer açar)
  const inputStyle = "w-full h-14 pl-12 pr-12 bg-white/50 border border-green-900/5 rounded-2xl text-green-950 placeholder:text-green-900/20 focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium shadow-sm";

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 md:p-12 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-500/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
            <Coffee className="text-green-600" size={36} />
          </div>
          <h2 className="text-4xl font-black text-green-950 tracking-tighter italic leading-tight">
            Giriş Yap
          </h2>
          <p className="text-green-800/50 text-sm font-medium mt-2">
            Atakent Çay Bahçesi’ne hoş geldiniz.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {/* E-posta */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-[0.2em] ml-4">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={20} />
              <input 
                type="email" 
                placeholder="ornek@posta.com"
                className={`${inputStyle} ${errors.email ? "border-red-300" : ""}`}
                {...register("email", { required: helperText.email.required })} 
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.email.message}</p>}
          </div>

          {/* Şifre */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-[0.2em] ml-4">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className={`${inputStyle} ${errors.password ? "border-red-300" : ""}`}
                {...register("password", { required: helperText.password.required })} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700/40 hover:text-green-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="flex justify-end px-2">
              <Link 
                to="/authentication/forgot-password" 
                className="text-[11px] font-bold text-green-700/60 hover:text-green-700 transition-all hover:underline decoration-2 underline-offset-4"
              >
                Şifremi unuttum?
              </Link>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 active:scale-[0.98] transition-all mt-2 group"
          >
             {isLoading ? (
               "İşleniyor..."
             ) : (
               <span className="flex items-center gap-3">
                 Giriş Yap <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
               </span>
             )}
          </Button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <p className="text-xs font-bold text-green-900/40 uppercase tracking-widest">
            Hesabınız yok mu? <Link to="/authentication/signup" className="text-green-600 font-black hover:text-green-700 ml-1 transition-colors">Hemen Kayıt Ol</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}