import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // siparişi veren kullanıcı
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  payment: { type: String, enum: ["kart", "nakit", "Kart", "Nakit"], required: true }, // ödeme yöntemi
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  status: { 
    type: String, 
    enum: ["Beklemede", "Hazırlanıyor", "Yolda", "Teslim Edildi", "İptal Edildi"], 
    default: "Beklemede" 
  },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30 gün sonra otomatik silinir
});

const Order = mongoose.model("Order", orderSchema);
export default Order;