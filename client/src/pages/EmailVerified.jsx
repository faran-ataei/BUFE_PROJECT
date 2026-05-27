import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coffee, Sparkles } from "lucide-react";

export default function EmailVerified() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Tüm kartın giriş animasyonu: Cam efekti ve doğa renkleri eklendi */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white/50 p-10 rounded-[3rem] shadow-2xl text-center relative overflow-hidden"
      >
        {/* Arka planda dekoratif bir parıltı */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
        
        {/* Onay Simgesi Animasyonu */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="bg-green-100 p-6 rounded-[2rem] shadow-inner">
              <CheckCircle2 className="text-green-600" size={64} strokeWidth={2.5} />
            </div>
            <motion.div 
              animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 text-green-500"
            >
              <Sparkles size={24} />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-black text-green-950 mb-4 tracking-tight"
        >
          Doğrulama Başarılı!
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-green-900/60 font-medium mb-10 leading-relaxed"
        >
          Harika! E-posta adresiniz onaylandı. <br />
          <span className="text-green-700 font-bold">Atakent Çay Bahçesi</span> ailesine hoş geldiniz. Taze çayınız sizi bekliyor!
        </motion.p>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/authentication/login")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-7 text-lg font-black rounded-2xl shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Hemen Giriş Yap
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full text-green-800/50 hover:text-green-900 hover:bg-green-100/50 font-bold rounded-2xl"
          >
            <Coffee className="mr-2" size={18} /> Anasayfaya Dön
          </Button>
        </div>

      </motion.div>
    </div>
  );
}