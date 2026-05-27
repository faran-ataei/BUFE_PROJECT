import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  return (
    // Alt bilgi alanı: Cam efekti (backdrop-blur) ve doğa temalı renkler kullanıldı
    <footer className="mt-20 border-t border-white/20 bg-white/40 backdrop-blur-md text-green-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Üst Bölüm: Marka kimliği ve sosyal medya ikonları */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-10">
          
          {/* Marka ve Logo Alanı: Boyutlar artırıldı ve görünürlük iyileştirildi */}
          <div className="flex items-center gap-5">
            {/* Logo Çerçevesi: Modern, yuvarlatılmış ve hafif gölgeli */}
            <div className="relative w-20 h-20 bg-white/80 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center p-3 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
              <img 
                src="/logo/logo.png" 
                alt="Atakent Logo" 
                className="w-16 h-16 object-contain" 
              />
              {/* Arka planda derinlik hissi veren hafif yeşil parıltı */}
              <div className="absolute inset-0 bg-green-600/5 rounded-[1.5rem] -z-10 blur-md" />
            </div>

            {/* Metin Alanı: Marka ismi ve slogan */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-black tracking-tighter text-green-950 leading-none">
                ATAKENT
              </h2>
              <span className="text-[12px] font-bold text-green-800/60 uppercase tracking-[0.25em] leading-none mt-2">
                Çay Bahçesi
              </span>
              <p className="text-[11px] font-medium text-green-800/40 max-w-[180px] leading-tight mt-3">
                Doğanın kalbinde, taze bir çay ve samimi bir mola noktası.
              </p>
            </div>
          </div>

          {/* Sosyal Medya Bölümü: İkonlar ve yönlendirmeler */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-green-900/40 text-center md:text-left">
              Bizi Takip Edin
            </h3>
            <div className="flex gap-4">
              {/* Her sosyal medya için özel hover renkleri eklendi */}
              <SocialLink href="https://www.facebook.com/atakentcaybahcesi" icon="bi-facebook" color="hover:bg-blue-600" />
              <SocialLink href="https://www.instagram.com/atakent_cay_bahcesi_ve_bufe/" icon="bi-instagram" color="hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500" />
              <SocialLink href="https://wa.me/905452399317" icon="bi-whatsapp" color="hover:bg-green-500" />
            </div>
          </div>
        </div>

        {/* Alt Bölüm: Telif hakkı ve yasal bağlantılar */}
        <div className="border-t border-green-900/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-green-900/40 uppercase tracking-[0.1em]">
          <p>© {new Date().getFullYear()} Atakent Çay Bahçesi. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-green-950 transition-colors tracking-widest">Gizlilik Politikası</Link>
            <Link to="/terms" className="hover:text-green-950 transition-colors tracking-widest">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Sosyal Medya Bağlantı Bileşeni
 * @param {string} href - Yönlendirilecek URL
 * @param {string} icon - Bootstrap icon sınıfı
 * @param {string} color - Üzerine gelindiğinde uygulanacak arka plan rengi
 */
function SocialLink({ href, icon, color }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`w-11 h-11 flex items-center justify-center rounded-xl bg-white/50 border border-white/80 text-green-900 transition-all duration-300 hover:text-white hover:scale-110 shadow-sm ${color}`}
    >
      <i className={`bi ${icon} text-xl`}></i>
    </a>
  );
}