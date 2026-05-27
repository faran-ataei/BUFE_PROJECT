import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/slices/products.slice";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CardImage } from "@/components/ProductsCard";
import { LayoutGrid, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen pb-20">
      {/* Üst Başlık Alanı - Marka ve Karşılama */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-black text-green-950 tracking-tighter flex items-center justify-center gap-3">
          <ShoppingBag className="text-green-600" size={40} />
          Ürün Listesi
        </h1>
        <p className="text-green-800/50 font-medium mt-3 tracking-widest uppercase text-[10px] md:text-xs">
          Atakent Çay Bahçesi • Taze ve Doğal Lezzetler
        </p>
        
        {/* Yönetici Modu Rozeti */}
        {user?.admin && (
          <div className="inline-block mt-4 px-4 py-1 bg-orange-100 border border-orange-200 rounded-full">
            <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">
              Yönetici Paneli Görünümü
            </span>
          </div>
        )}
      </div>

      {/* Yükleme Durumu (Loading) */}
      {loading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 flex flex-col items-center gap-4 shadow-xl">
            <Spinner className="text-green-600 w-10 h-10" />
            <span className="text-green-950 font-black text-sm uppercase tracking-widest italic">Menü Hazırlanıyor...</span>
          </div>
        </div>
      )}

      {/* Hata Durumu */}
      {error && (
        <div className="max-w-md mx-auto mt-10 p-8 bg-red-50 border border-red-100 rounded-[2rem] text-center shadow-sm">
          <p className="text-red-600 font-bold mb-4">Bir hata oluştu: {error}</p>
          <Button 
            onClick={() => dispatch(fetchProducts())} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
          >
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* Ürün Izgarası (Grid) */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <CardImage product={product} key={product._id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/20 backdrop-blur-sm rounded-[3rem] border border-white/40 shadow-inner">
              <LayoutGrid className="mx-auto text-green-900/10 mb-6" size={64} />
              <p className="text-green-950/40 font-bold italic text-lg tracking-tight">Henüz bir ürün listelenmemiş.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}