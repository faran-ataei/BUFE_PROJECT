import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react"; // 🌟 ONAYLANDI: useEffect ve currentProduct kaldırıldı
import { Button } from "@/components/ui/button";
import { addToCart } from "../redux/slices/cart.slice";
import { toast } from "sonner";
import { ShoppingBag, Clock, Leaf, ArrowLeft, Edit } from "lucide-react";
import { motion } from "framer-motion";
import EditProductModal from "@/components/EditProductModal";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🌟 ONAYLANDI: Sadece modalın açık/kapalı durumunu takip ediyoruz
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 🌟 ONAYLANDI: Ürünü doğrudan Redux Store'dan dinliyoruz.
  // Redux güncellendiği an bu sayfa da anında tetiklenecek ve otomatik olarak yenilenecektir.
  const product = useSelector((state) =>
    state.products.products.find((p) => p._id === id)
  );
  
  const user = useSelector((state) => state.user.user);

  // Ürün sistemde hiç yoksa hata ekranı gösterilir
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-green-950 font-sans">
        <h2 className="text-2xl font-black italic">Ürün Bulunamadı!</h2>
        <Button onClick={() => navigate("/")} variant="link" className="mt-4 text-green-600 font-bold">
          Menüye Geri Dön
        </Button>
      </div>
    );
  }

  // Müşteriler için sepete ekleme fonksiyonu
  const handleAddToCart = () => {
    dispatch(addToCart(product));
    
    toast.success(`${product.name} Sepete Eklendi!`, {
      description: "Bu taze lezzet şimdi sepetinizde sizi bekliyor.",
      icon: <ShoppingBag className="text-green-600" size={18} />,
      duration: 3000,
      action: {
        label: "Sepete Git",
        onClick: () => navigate("/basket")
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 md:p-10 font-sans">
      {/* Geri Dön Butonu */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-800/40 hover:text-green-700 font-black text-[10px] uppercase tracking-widest mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Geri Dön
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3.5rem] shadow-2xl overflow-hidden p-6 md:p-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          
          {/* Ürün Görseli */}
          <div className="relative">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] md:h-[500px] object-cover rounded-[3rem] shadow-2xl shadow-green-900/10 border-4 border-white"
            />
          </div>

          {/* Ürün Detayları */}
          <div className="flex flex-col py-4">
            <h2 className="text-4xl md:text-5xl font-black text-green-950 mb-6 tracking-tighter leading-tight italic">
              {product.name}
            </h2>

            <p className="text-green-900/60 font-medium leading-relaxed mb-8 text-lg">
              {product.description || "Atakent Çay Bahçesi'nin özenle hazırlanan taze ve doğal lezzetlerinden biri."}
            </p>

            {/* Özellik Rozetleri */}
            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="flex items-center gap-3 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <Leaf className="text-green-600" size={20} />
                  <span className="text-[10px] font-black text-green-800 uppercase tracking-wide">Doğal İçerik</span>
               </div>
               <div className="flex items-center gap-3 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <Clock className="text-green-600" size={20} />
                  <span className="text-[10px] font-black text-green-800 uppercase tracking-wide">Günlük Taze</span>
               </div>
            </div>
            
            {/* Alt Fiyat ve Aksiyon Alanı */}
            <div className="mt-auto pt-8 border-t border-green-900/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-green-900/30 uppercase tracking-[0.2em]">Birim Fiyat</span>
                <span className="text-4xl font-black text-green-950 tracking-tighter">
                  {product.price.toLocaleString('tr-TR')} <span className="text-sm font-bold opacity-40 ml-1">₺</span>
                </span>
              </div>

              {/* Kullanıcı rolüne göre buton mantığı */}
              {user ? (
                user.admin ? (
                  /* Giriş yapan kullanıcı ADMIN ise: Düzenleme Butonu */
                  <Button
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white h-16 px-10 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-amber-500/20 group"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Ürünü Düzenle 
                    <Edit size={22} className="group-hover:rotate-12 transition-transform" />
                  </Button>
                ) : (
                  /* Giriş yapan kullanıcı MÜŞTERİ ise: Sepete Ekle Butonu */
                  <Button
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white h-16 px-10 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-green-600/20 group"
                    onClick={handleAddToCart}
                  >
                    Sepete Ekle 
                    <ShoppingBag size={22} className="group-hover:-rotate-12 transition-transform" />
                  </Button>
                )
              ) : (
                /* Kullanıcı hiç giriş yapmadıysa: Uyarı mesajı */
                <div className="w-full sm:w-auto text-center sm:text-right bg-red-50 p-3 rounded-xl border border-red-100">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-tight">
                    Sipariş İçin <br /> Giriş Yapmalısınız
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>

      {/* 🌟 ONAYLANDI: Düzenleme Modalı Entegrasyonu */}
      {/* onProductUpdated kaldırıldı çünkü sayfa artık doğrudan merkezi Redux state'ini dinliyor */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
      />
    </div>
  );
}