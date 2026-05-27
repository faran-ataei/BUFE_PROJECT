import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Home, SearchX } from "lucide-react"; // Modern ikonlar

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden">
      
      {/* Arka Plan Dekorasyonu - Hafif yeşil parıltı */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -z-10" />

      {/* 404 Numarası ve Animasyon */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12"
      >
        <h1 className="text-[10rem] md:text-[15rem] font-black text-green-950/10 leading-none tracking-tighter select-none">
          404
        </h1>
        
        {/* Etiket: Sayfa Bulunamadı */}
        <div className="bg-green-600 px-4 py-2 text-xs md:text-sm font-black text-white rounded-2xl rotate-12 absolute bottom-10 right-0 md:right-10 shadow-xl shadow-green-600/20 uppercase tracking-widest">
          Sayfa Bulunamadı
        </div>
      </motion.div>

      {/* Mesaj Alanı - Cam Panel İçinde */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-8 md:p-12 rounded-[3rem] bg-white/40 backdrop-blur-md border border-white/50 max-w-xl shadow-2xl"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <SearchX size={40} className="text-green-600" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-green-950 mb-4 tracking-tight">
          Eyvah! Çaylar soğudu... ☕
        </h2>
        
        <p className="text-green-900/60 font-medium mb-10 leading-relaxed text-sm md:text-base">
          Aradığınız sayfa masadan kalkmış veya hiç var olmamış olabilir. <br className="hidden md:block" />
          Endişelenmeyin, <span className="text-green-700 font-bold">Atakent</span>'in huzurlu bahçesine dönmek için bir yolumuz var.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2 px-10 py-4 font-black text-white bg-green-600 rounded-2xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Home size={20} />
            Ana Sayfaya Dön
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-10 py-4 font-black text-green-800/40 hover:text-green-800 transition-all w-full sm:w-auto justify-center"
          >
            Geri Dön
          </button>
        </div>
      </motion.div>

      {/* Alt Dekoratif İkon */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="mt-12 text-green-900/10"
      >
          <Coffee size={80} strokeWidth={1} />
      </motion.div>
    </div>
  );
}