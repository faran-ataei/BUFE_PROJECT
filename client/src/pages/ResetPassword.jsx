import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordAction, resetError } from "../redux/slices/user.slice";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const { token } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading } = useSelector((state) => state.user);

  // Şifre görünürlüğü için yerel state'ler
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const handleReset = async () => {
      const res = await dispatch(
        resetPasswordAction({ token, password: data.password }),
      );

      if (resetPasswordAction.fulfilled.match(res)) {
        navigate("/authentication/login");
        return "Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz. 🔑";
      } else {
        throw new Error(res.payload || "Şifre güncelleme işlemi başarısız oldu.");
      }
    };

    toast.promise(handleReset(), {
      loading: "Şifreniz güncelleniyor...",
      success: (msg) => msg,
      error: (err) => err.message,
    });
  };

  // Ortak input stilleri (Sağ taraftaki göz ikonu için pr-12 eklendi)
  const inputStyle = "w-full h-14 pl-12 pr-12 bg-white/50 border border-green-900/5 rounded-2xl text-green-950 placeholder:text-green-900/20 focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium shadow-sm";

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 md:p-12 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        {/* Dekoratif Arka Plan Görseli */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-500/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
            <KeyRound className="text-green-600" size={36} />
          </div>
          <h2 className="text-3xl font-black text-green-950 tracking-tighter leading-tight italic">
            Yeni Şifre Belirle
          </h2>
          <p className="text-green-800/50 text-sm font-medium mt-2 leading-relaxed">
            Hesabınız için güvenli ve yeni bir şifre seçerek güvenliğinizi tazeleyin.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {/* Yeni Şifre Girişi */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-[0.2em] ml-4">Yeni Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputStyle} ${errors.password ? "border-red-300" : ""}`}
                {...register("password", {
                  required: "Yeni şifre alanı zorunludur",
                  minLength: { value: 6, message: "Şifre en az 6 karakterden oluşmalıdır" },
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
            {errors.password && (
              <p className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.password.message}</p>
            )}
          </div>

          {/* Şifre Onay Girişi */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-[0.2em] ml-4">Şifreyi Onayla</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputStyle} ${errors.confirmPassword ? "border-red-300" : ""}`}
                {...register("confirmPassword", {
                  required: "Şifre onayı zorunludur",
                  validate: (value) =>
                    value === watch("password") || "Girdiğiniz şifreler eşleşmiyor",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700/40 hover:text-green-600 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px] ml-4 font-bold uppercase">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 active:scale-[0.98] transition-all mt-6 group"
          >
            {isLoading ? (
              "Güncelleniyor..."
            ) : (
              <span className="flex items-center gap-3">
                Şifreyi Güncelle <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <p className="text-[10px] font-black text-green-900/20 uppercase tracking-[0.2em]">
            Güvenliğiniz bizim önceliğimizdir
          </p>
        </div>
      </motion.div>
    </div>
  );
}