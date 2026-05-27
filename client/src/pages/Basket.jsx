import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, decreaseQuantity, addToCart, clearCart } from "../redux/slices/cart.slice";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Basket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  // Toplam sepet tutarını hesaplama
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🌟 ONAYLANDI: Boş sepet görünümü yüksek kontrastlı cam kart olarak güncellendi
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 font-sans">
        {/* Arka plan ağaç görselinden ayrışması için %80 opaklıkta beyaz kart eklendi */}
        <div className="text-center p-8 sm:p-12 bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] shadow-2xl max-w-md w-full mx-auto">
          
          {/* Sepet İkon Bölümü */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
            <ShoppingBasket size={48} className="text-green-600" />
          </div>

          {/* Başlık - Maksimum okunabilirlik için text-green-950 yapıldı */}
          <h2 className="text-2xl sm:text-3xl font-black text-green-950 mb-3 drop-shadow-sm tracking-tight">
            Sepetiniz Boş
          </h2>

          {/* Açıklama Metni - Arka planda kaybolmaması için kalınlaştırıldı ve koyu yeşil yapıldı */}
          <p className="text-sm text-green-900 font-bold bg-white/50 px-4 py-2 rounded-xl inline-block mb-8 border border-green-900/5">
            Görünüşe göre henüz bir ürün seçmediniz.
          </p>

          {/* Menüye Yönlendirme Butonu */}
          <Button 
            onClick={() => navigate("/")} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-base rounded-2xl h-14 shadow-lg shadow-green-600/30 transition-all active:scale-95"
          >
            Menüyü İncele
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 font-sans">
      {/* Sayfa Başlığı */}
      <div className="flex items-center gap-3 mb-8 border-b border-green-900/5 pb-6">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
          <ShoppingBasket size={20} />
        </div>
        <h1 className="text-3xl font-black text-green-950 tracking-tight">Sepetim</h1>
      </div>
      
      {/* Sepetteki Ürünlerin Listesi */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-center justify-between border border-white/50 rounded-[2rem] p-5 bg-white/60 backdrop-blur-md shadow-sm gap-4 hover:shadow-md transition-all duration-300"
          >
            {/* Ürün Görseli ve Detayları */}
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-2xl border border-white shadow-sm shrink-0"
              />
              <div>
                <h2 className="font-black text-green-950 text-lg leading-tight">{item.name}</h2>
                <p className="text-green-600 font-black mt-1">{item.price.toLocaleString('tr-TR')} ₺</p>
              </div>
            </div>

            {/* Adet Kontrolleri ve Silme Butonu */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-green-900/5">
              
              {/* Adet Kontrol Paneli */}
              <div className="flex items-center bg-green-900/5 rounded-xl p-1 border border-green-900/5">
                <button
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                  className="p-2 hover:bg-white hover:text-green-600 rounded-lg transition-all text-green-900/40"
                  title="Azalt"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="px-4 font-black text-green-950 w-10 text-center">{item.quantity}</span>
                <button
                  onClick={() => dispatch(addToCart(item))}
                  className="p-2 hover:bg-white hover:text-green-600 rounded-lg transition-all text-green-900/40"
                  title="Artır"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Tekli Ürün Silme Butonu */}
              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 shrink-0"
                title="Ürünü Sil"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sipariş Toplam Özeti Kartı */}
      <div className="mt-10 bg-white/80 border border-white p-8 rounded-[2.5rem] shadow-xl shadow-green-900/5 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex flex-col">
            <span className="text-green-900/40 text-xs font-black uppercase tracking-widest">Ödenecek Toplam</span>
            <span className="text-[10px] text-green-600 font-bold italic mt-0.5">KDV Dahildir</span>
          </div>
          <span className="text-4xl font-black text-green-950 tracking-tighter">
            {totalPrice.toLocaleString('tr-TR')} <span className="text-sm">₺</span>
          </span>
        </div>
        
        {/* Alt Eylem Butonları */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sepeti Tamamen Temizleme Butonu */}
          <button
            onClick={() => dispatch(clearCart())}
            className="flex-1 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-sm transition-all border border-red-100 uppercase tracking-widest active:scale-95"
          >
            Sepeti Temizle
          </button>
          
          {/* Siparişi Onaylama ve Adres Sayfasına Geçiş Butonu */}
          <Link to="/orders" className="flex-[2]">
            <button className="group w-full h-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-3">
              Siparişi Onayla
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Basket;