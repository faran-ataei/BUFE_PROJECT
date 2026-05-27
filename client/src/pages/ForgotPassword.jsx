import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/slices/user.slice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Mail, ArrowLeft, Send, Sparkles, TreePine, Inbox } from "lucide-react";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);
  const [isSubmitted, setIsSubmitted] = useState(false); // Başarı ekranı kontrolü
  const [submittedEmail, setSubmittedEmail] = useState(""); // Gönderilen maili tutmak için

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const handleResetRequest = async () => {
      const res = await dispatch(forgotPassword(data));
      if (forgotPassword.fulfilled.match(res)) {
        setSubmittedEmail(data.email); // Başarı durumunda maili kaydet
        setIsSubmitted(true); // Başarı ekranına geç
        
        // Payload içinden string değer döndüğünden emin oluyoruz
        return typeof res.payload === "string" 
          ? res.payload 
          : res.payload?.message || "Sıfırlama bağlantısı gönderildi.";
      } else {
        // 🚨 HATA BURADAYDI: res.payload bir nesne (object) olduğunda stringe çeviriyoruz
        console.log(data);
        const errorMessage = typeof res.payload === "string"
          ? res.payload
          : res.payload?.message || res.payload?.error || "Bir hata oluştu, lütfen tekrar deneyin.";
          
        throw new Error(errorMessage);
      }
    };

    toast.promise(handleResetRequest(), {
      loading: "Bağlantı gönderiliyor...",
      success: (message) => message,
      error: (err) => err.message, // err.message artık güvenli bir string
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white/50 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div key="form" exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <TreePine className="text-green-600" size={32} />
                </div>
                <h2 className="text-3xl font-black text-green-950 tracking-tight italic">Şifremi Unuttum</h2>
                <p className="text-xs font-medium text-green-800/50 mt-3">
                  Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi girin.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-green-900/40 uppercase tracking-[0.2em] ml-2">E-posta Adresi</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30" size={18} />
                    <input
                      type="email"
                      placeholder="örnek@mail.com"
                      className={`w-full p-4 pl-12 rounded-2xl bg-white/50 border ${errors.email ? "border-red-400" : "border-green-900/5"} focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all font-medium text-green-950 placeholder:text-green-900/20`}
                      {...register("email", {
                        required: "E-posta adresi gerekli",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Geçersiz e-posta formatı",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] font-bold ml-2 uppercase tracking-wide">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 w-full mt-4 py-4 text-white rounded-2xl font-black shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:bg-green-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? "İşleniyor..." : <>Bağlantı Gönder <Send size={18} /></>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                <Inbox className="text-green-600" size={40} />
                <Sparkles className="absolute -top-1 -right-1 text-orange-400" size={20} />
              </div>
              <h3 className="text-2xl font-black text-green-950 mb-3 tracking-tighter">E-postanı Kontrol Et!</h3>
              <p className="text-green-900/60 text-sm mb-8 leading-relaxed">
                <span className="font-bold text-green-800 bg-green-50 px-2 py-0.5 rounded-lg inline-block my-1">{submittedEmail}</span>
                <br />adresine şifre sıfırlama talimatlarını gönderdik.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox`, "_blank")}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  E-postayı Aç <Mail size={18} />
                </button>
                <button onClick={() => setIsSubmitted(false)} className="text-xs font-bold text-green-900/30 hover:text-green-900 uppercase tracking-widest block w-full">
                  Yanlış e-posta mı? Tekrar Dene
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link to="/authentication/login" className="inline-flex items-center gap-2 text-xs font-black text-green-800/40 hover:text-green-700 uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Giriş sayfasına dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}