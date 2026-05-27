import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form"; // 🌟 ONAYLANDI: Select entegrasyonu için Controller eklendi
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  X,
  TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postData } from "@/utils/fetchAPI";
import { clearCart } from "@/redux/slices/cart.slice";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

// Form hata bildirim metinleri
const helperText = {
  email: {
    required: "E-posta adresi gereklidir",
    invalid: "Geçersiz e-posta adresi",
  },
  phone: {
    required: "Telefon numarası gereklidir",
    invalid: "Geçersiz telefon numarası",
  },
  address: { required: "Teslimat adresi gereklidir" },
  payment: { required: "Lütfen bir ödeme yöntemi seçin" },
};

export default function Orders() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // Form kancası ve varsayılan değerleri
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control, // 🌟 ONAYLANDI: Shadcn Select kontrolü için eklendi
  } = useForm({
    defaultValues: { email: "", phone: "", address: "", payment: "" },
  });

  // Sipariş gönderme işlemi
  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      toast.error("Sepetiniz boş! 🛒", {
        description: "Sipariş vermek için lütfen önce ürün ekleyin.",
      });
      return;
    }

    const processOrder = async () => {
      const response = await postData(`${API_URL}/orders`, {
        ...data,
        items: cartItems,
      });

      if (response?.status >= 200 && response?.status < 300) {
        dispatch(clearCart());
        reset();
        return "Siparişiniz başarıyla alındı! 🎉";
      }
      throw new Error("Sipariş kaydedilirken bir hata oluştu.");
    };

    toast.promise(processOrder(), {
      loading: "Siparişiniz iletiliyor...",
      success: (msg) => msg,
      error: (err) => err.message,
    });
  };

  // Ortak input stil sınıfları
  const inputClasses =
    "h-14 bg-white/50 border-green-900/5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all font-medium";

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl p-6 md:p-12 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Arka Plan Süslemesi */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />

        {/* Başlık ve İkon Alanı */}
        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-16 h-16 bg-green-600 rounded-[1.5rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-green-600/20">
            <TreePine size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-green-950 tracking-tighter italic">
            Siparişi Tamamla
          </h1>
          <p className="text-green-800/50 text-xs sm:text-sm font-medium mt-2">
            Lezzetlerimizi size ulaştırmak için bilgilerinizi girin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 relative z-10"
        >
          {/* E-posta Giriş Alanı */}
          <div className="space-y-2">
            <label className="text-xs font-black text-green-900/40 uppercase tracking-widest ml-4">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30"
                size={18}
              />
              <Input
                className={`${inputClasses} pl-12`}
                placeholder="ornek@posta.com"
                {...register("email", {
                  required: helperText.email.required,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: helperText.email.invalid,
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-bold ml-4">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Telefon Giriş Alanı */}
          <div className="space-y-2">
            <label className="text-xs font-black text-green-900/40 uppercase tracking-widest ml-4">
              Telefon Numarası
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30"
                size={18}
              />
              <Input
                className={`${inputClasses} pl-12`}
                placeholder="05XX XXX XX XX"
                {...register("phone", {
                  required: helperText.phone.required,
                  pattern: {
                    value: /^[0-9+\s()-]{10,}$/,
                    message: helperText.phone.invalid,
                  },
                })}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs font-bold ml-4">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Adres Giriş Alanı */}
          <div className="space-y-2">
            <label className="text-xs font-black text-green-900/40 uppercase tracking-widest ml-4">
              Teslimat Adresi
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-green-700/30"
                size={18}
              />
              <textarea
                className={`${inputClasses} w-full p-4 pl-12 h-28 resize-none flex`}
                placeholder="Mahalle, sokak ve kapı no..."
                {...register("address", {
                  required: helperText.address.required,
                })}
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-xs font-bold ml-4">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Ödeme Yöntemi Seçim Alanı */}
          <div className="w-full space-y-2">
            <label className="text-xs font-black text-green-900/40 uppercase tracking-widest ml-4 block">
              Ödeme Yöntemi
            </label>

            {/* 🌟 ONAYLANDI: Select bileşeni react-hook-form ile entegre edildi */}
            <Controller
              name="payment"
              control={control}
              rules={{ required: helperText.payment.required }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full h-14 bg-white/50 border border-green-900/5 rounded-2xl px-4 text-sm font-bold text-green-950 focus:ring-4 focus:ring-green-500/10 shadow-sm flex items-center justify-between">
                    <SelectValue placeholder="Ödeme Yöntemi Seçin" />
                  </SelectTrigger>

                  <SelectContent className="z-50 bg-white/95 backdrop-blur-lg border border-green-100 rounded-2xl shadow-2xl p-1 min-w-[200px]">
                    <SelectItem
                      value="kart"
                      className="text-xs sm:text-sm font-bold text-green-900 focus:bg-green-50 focus:text-green-950 rounded-xl py-2.5 px-3 my-0.5 cursor-pointer flex items-center gap-2"
                    >
                      💳 Kapıda Kart ile Ödeme
                    </SelectItem>
                    <SelectItem
                      value="nakit"
                      className="text-xs sm:text-sm font-bold text-green-900 focus:bg-green-50 focus:text-green-950 rounded-xl py-2.5 px-3 my-0.5 cursor-pointer flex items-center gap-2"
                    >
                      💵 Kapıda Nakit
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.payment && (
              <p className="text-red-500 text-xs font-bold ml-4">
                {errors.payment.message}
              </p>
            )}
          </div>

          {/* 🌟 ONAYLANDI: Butonlar mobil cihazlar için alt alta (flex-col), masaüstü için yan yana (sm:flex-row) yapıldı */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full">
            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              className="w-full sm:flex-1 h-14 rounded-2xl font-black text-green-900/40 hover:bg-red-50 hover:text-red-500 transition-all order-2 sm:order-1"
            >
              <X size={18} className="mr-2" /> Vazgeç
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-[2] h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-green-600/20 active:scale-95 transition-all group order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              <span>Siparişi Ver</span>
              <Send
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}