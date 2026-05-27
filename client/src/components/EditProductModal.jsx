import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux"; // 🌟 ONAYLANDI: Redux entegrasyonu için eklendi
import { X, Save, DollarSign, Package, Image, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { putData } from "@/utils/fetchAPI";
import { toast } from "sonner";
import { updateProductInStore } from "@/redux/slices/products.slice";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}) {
  const dispatch = useDispatch(); // 🌟 ONAYLANDI
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Ürün değiştiğinde form değerlerini doldurma
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description || "", // 🌟 ONAYLANDI
      });
    }
  }, [product, reset]);

// 📝 Ürün güncelleme formunu sunucuya gönderme fonksiyonu
const onSubmit = async (data) => {
  const updateProcess = async () => {
    // 1. Sunucuya PUT isteği gönderiliyor
    const response = await putData(`${API_URL}/products/${product._id}`, data);

    // 2. Yanıtın başarılı olup olmadığını kontrol et
    if (response?.data?.success || response?.status === 200 || response?.success) {
      
      // Backend'den dönen güncel ürün objesini al
      const updatedData = response.data?.data || response.data || response;

      if (!updatedData || !updatedData._id) {
        throw new Error("Sunucudan geçerli bir ürün verisi alınamadı.");
      }

      // 🌟 ONAYLANDI: Redux Store'daki ürünü doğrudan güncelliyoruz
      // Bu sayede sayfa değiştirmeye gerek kalmadan detay sayfası anında yenilenir!
      dispatch(updateProductInStore(updatedData));
      
      // 3. Modalı kapat
      onClose(); 
      
      return "Ürün başarıyla güncellendi! 🌿";
    }
    
    throw new Error(response?.data?.message || "Güncelleme sırasında bir hata oluştu.");
  };

  toast.promise(updateProcess(), {
    loading: "Ürün güncelleniyor...",
    success: (msg) => msg,
    error: (err) => err.message,
  });
};

  const inputClasses =
    "h-12 bg-green-900/5 border-green-900/5 rounded-xl focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all font-medium pl-10 text-green-950";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-6 shadow-2xl font-sans">
        <DialogHeader className="text-center pb-4 border-b border-green-900/5">
          <DialogTitle className="text-2xl font-black text-green-950 tracking-tight flex items-center justify-center gap-2">
            ✏️ Ürünü Düzenle
          </DialogTitle>
          <DialogDescription className="text-green-800/50 text-xs font-medium mt-1">
            Ürün bilgilerini güncelledikten sonra kaydet butonuna basın.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Ürün Adı */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest pl-2 block">
              Ürün Adı
            </label>
            <div className="relative">
              <Package
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700/30"
                size={16}
              />
              <Input
                className={inputClasses}
                placeholder="Örn: Türk Kahvesi"
                {...register("name", { required: "Ürün adı zorunludur" })}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-[11px] font-bold pl-2">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* 🌟 ONAYLANDI: Ürün Açıklaması (Description) Giriş Alanı */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest pl-2 block">
              Ürün Açıklaması
            </label>
            <div className="relative">
              <FileText
                className="absolute left-3.5 top-4 text-green-700/30"
                size={16}
              />
              <textarea
                className={`${inputClasses} w-full p-3 pl-10 h-20 resize-none flex`}
                placeholder="Ürün detayları..."
                {...register("description")}
              />
            </div>
          </div>

          {/* Ürün Fiyatı */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest pl-2 block">
              Ürün Fiyatı (₺)
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700/30"
                size={16}
              />
              <Input
                type="number"
                className={inputClasses}
                placeholder="Örn: 60"
                {...register("price", { required: "Fiyat zorunludur" })}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-[11px] font-bold pl-2">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Ürün Görseli */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest pl-2 block">
              Görsel URL Adresi
            </label>
            <div className="relative">
              <Image
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700/30"
                size={16}
              />
              <Input
                className={inputClasses}
                placeholder="https://..."
                {...register("image", { required: "Görsel linki zorunludur" })}
              />
            </div>
            {errors.image && (
              <p className="text-red-500 text-[11px] font-bold pl-2">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Butonlar */}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-green-900/5 w-full">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full sm:flex-1 h-12 rounded-xl font-black text-green-900/40 hover:bg-red-50 hover:text-red-500 transition-all order-2 sm:order-1"
            >
              <X size={16} className="mr-2" /> Kapat
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-[2] h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-sm shadow-lg shadow-green-600/20 active:scale-95 transition-all group order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              <Save size={16} /> Değişiklikleri Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
