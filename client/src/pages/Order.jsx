import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postData } from "@/utils/fetchAPI";
import { clearCart } from "@/redux/slices/cart.slice";

const API_URL = import.meta.env.VITE_API_URL;

const helperText = {
  email: {
    required: "E-posta gereklidir",
    invalid: "Geçersiz e-posta",
  },
  phone: {
    required: "Telefon numarası gereklidir",
    invalid: "Geçersiz telefon numarası",
  },
  address: {
    required: "Adres gereklidir",
  },
  payment: {
    required: "Ödeme yöntemi seçilmelidir",
  },
};

export default function Orders() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      phone: "",
      address: "",
      payment: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await postData(`${API_URL}/orders`, {
        ...data,
        items: cartItems,
      });

      if (response?.status >= 200 && response?.status < 300) {
        alert("Siparişiniz başarıyla kaydedildi!");
        dispatch(clearCart());
        reset();
      } else {
        alert("Sipariş kaydedilirken hata oluştu.");
      }
    } catch (error) {
      console.error("Sipariş hatası:", error);
      alert("Sunucuya bağlanırken hata oluştu.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-lg mx-auto mt-20">
      <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-email">E-posta</FieldLabel>
            <Input
              id="form-email"
              type="email"
              placeholder="ali@example.com"
              {...register("email", {
                required: helperText.email.required,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: helperText.email.invalid,
                },
              })}
            />
            <FieldDescription>
              E-posta adresiniz kimseyle paylaşılmayacaktır.
            </FieldDescription>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="form-phone">Telefon</FieldLabel>
            <Input
              id="form-phone"
              type="tel"
              placeholder="+90 (555) 123-4567"
              {...register("phone", {
                required: helperText.phone.required,
                pattern: {
                  value: /^[0-9+\s()-]{10,}$/,
                  message: helperText.phone.invalid,
                },
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="form-address">Adres</FieldLabel>
            <Input
              id="form-address"
              type="text"
              placeholder="Atakent Mah. 123. Sok."
              {...register("address", {
                required: helperText.address.required,
              })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </Field>

          {/* Ödeme yöntemi seçimi */}
          <Field>
            <FieldLabel htmlFor="form-payment">Ödeme Yöntemi</FieldLabel>
            <Select
              onValueChange={(value) => setValue("payment", value)}
              defaultValue=""
              {...register("payment", {
                required: helperText.payment.required,
              })}
            >
              <SelectTrigger id="form-payment">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kart">Kart</SelectItem>
                <SelectItem value="nakit">Nakit</SelectItem>
              </SelectContent>
            </Select>
            {errors.payment && (
              <p className="text-red-500 text-sm mt-1">
                {errors.payment.message}
              </p>
            )}
          </Field>

          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => reset()}>
              İptal
            </Button>
            <Button type="submit">Gönder</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
