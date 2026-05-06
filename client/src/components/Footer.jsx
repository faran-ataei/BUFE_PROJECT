import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top section: brand + social */}
        <div className="flex flex-col md:flex-row md:justify-around md:items-center gap-8">
          
          {/* Brand / About */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Atakent Çay Bahçesi
            </h2>
            <p className="text-sm leading-relaxed">
              Doğal ortamda keyifli sohbetler ve sıcak çay için en doğru adres.
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Bizi Takip Edin
            </h3>
            <div className="flex gap-6 text-2xl">
              <a href="https://www.facebook.com/atakentcaybahcesi" className="hover:text-white">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/atakent_cay_bahcesi_ve_bufe/" className="hover:text-white">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://wa.me/905452399317?text=Merhaba%20sipari%C5%9F%20verecektim%20%F0%9F%98%8A" className="hover:text-white">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-5 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Atakent Çay Bahçesi. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
