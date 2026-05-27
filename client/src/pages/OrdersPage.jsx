import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { ClipboardList, User, MapPin, Phone, CreditCard, Calendar, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true
});

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
          withCredentials: true 
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Siparişler çekilirken hata oluştu:", error);
      }
    };

    fetchOrders();

    socket.on("newOrderReceived", (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
      audio.play().catch(e => console.log("Ses çalma hatası:", e));
    });

    return () => socket.off("newOrderReceived");
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Sipariş durumu güncellenirken hata oluştu:", error);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const getStatusPulseColor = (status) => {
    switch (status) {
      case "Beklemede": return "bg-amber-500 text-amber-700 bg-amber-500/10 border-amber-500/20";
      case "Hazırlanıyor": return "bg-blue-500 text-blue-700 bg-blue-500/10 border-blue-500/20";
      case "Yolda": return "bg-purple-500 text-purple-700 bg-purple-500/10 border-purple-500/20";
      case "Teslim Edildi": return "bg-green-500 text-green-700 bg-green-500/10 border-green-500/20";
      case "İptal Edildi": return "bg-red-500 text-red-700 bg-red-500/10 border-red-500/20";
      default: return "bg-gray-500 text-gray-700 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen max-w-7xl mx-auto">
      {/* Başlık Bölümü */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-black text-green-950 flex items-center gap-3">
          <ClipboardList className="text-green-600 shrink-0" size={32} />
          Sipariş Yönetimi
        </h1>
        <div className="self-start sm:self-center bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold shadow-sm border border-green-200">
          Canlı Takip Aktif
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {orders.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-green-900/40 italic text-center py-20 bg-white/20 backdrop-blur-md rounded-[2rem] border border-white/40"
            >
              Henüz kayıtlı bir sipariş bulunmamaktadır.
            </motion.p>
          ) : (
            orders.map((order) => (
              <motion.div 
                key={order._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 shadow-xl backdrop-blur-md"
              >
                {/* Sipariş Üst Bilgisi */}
                <div className="bg-green-600/5 p-4 sm:p-5 border-b border-green-600/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="font-black text-green-950 uppercase tracking-tight text-sm sm:text-base">
                        {order.user?.name || "Misafir Kullanıcı"} {order.user?.lastName || ""}
                      </h2>
                      <span className="text-[10px] font-bold text-green-700/60 flex items-center gap-1 uppercase tracking-widest mt-0.5">
                        <Calendar size={12} /> {new Date(order.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                  <div className="sm:text-right border-t sm:border-t-0 border-green-900/5 pt-2 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <span className="text-[10px] font-black text-green-800/40 uppercase">Sipariş No</span>
                    <span className="text-xs font-mono font-bold text-green-900 italic">#{order._id.slice(-6)}</span>
                  </div>
                </div>
                
                {/* Müşteri Detayları Grid */}
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <DetailItem icon={<MapPin size={16}/>} label="Adres" value={order.address} />
                  <DetailItem icon={<Phone size={16}/>} label="Telefon" value={order.phone} />
                  <DetailItem icon={<CreditCard size={16}/>} label="Ödeme Türü" value={order.payment} />
                  <DetailItem icon={<Package size={16}/>} label="E-posta" value={order.email} />
                </div>
                
                {/* Ürün Listesi - Mobil Uyumlu */}
                <div className="px-4 sm:px-6 pb-2">
                  <div className="bg-white/40 rounded-2xl overflow-hidden border border-green-900/5 shadow-inner overflow-x-auto">
                    <table className="w-full text-left min-w-[500px] sm:min-w-0">
                      <thead>
                        <tr className="bg-green-600 text-white text-xs uppercase tracking-widest">
                          <th className="p-3 sm:p-4 font-black">Ürün</th>
                          <th className="p-3 sm:p-4 font-black text-center w-20">Adet</th>
                          <th className="p-3 sm:p-4 font-black text-right w-32">Birim Fiyat</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-medium text-green-900">
                        {order.items.map((item) => (
                          <tr key={item._id} className="border-b border-green-900/5 hover:bg-green-600/5 transition-colors">
                            <td className="p-3 sm:p-4">{item.name}</td>
                            <td className="p-3 sm:p-4 text-center font-black bg-green-900/5">{item.quantity}</td>
                            <td className="p-3 sm:p-4 text-right">{item.price?.toLocaleString('tr-TR')} TL</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Toplam Tutar ve Shadcn UI Durum Yönetim Alanı */}
                <div className="p-4 sm:p-6 pt-2 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-2">
                  
                  {/* بخش اصلاح شده با استفاده از Shadcn UI Select و کاملاً ریسپانسیو */}
                  <div className="flex items-center gap-3 bg-white/80 border border-green-900/5 px-4 py-2 rounded-2xl shadow-sm w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${getStatusPulseColor(order.status || "Beklemede").split(" ")[0]} animate-pulse`}></span>
                      <span className="text-xs font-black text-green-950 uppercase tracking-wider">Durum:</span>
                    </div>
                    
                    <Select
                      value={order.status || "Beklemede"}
                      onValueChange={(value) => handleStatusChange(order._id, value)}
                    >
                      <SelectTrigger className="w-[160px] h-9 bg-white/50 border-green-900/10 rounded-xl text-xs font-bold text-green-900 focus:ring-green-600/20">
                        <SelectValue placeholder="Durum Seç" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border-green-100 rounded-xl shadow-xl">
                        <SelectItem value="Beklemede" className="text-xs font-bold text-amber-700 focus:bg-amber-50 focus:text-amber-800 rounded-lg">Onay Bekliyor</SelectItem>
                        <SelectItem value="Hazırlanıyor" className="text-xs font-bold text-blue-700 focus:bg-blue-50 focus:text-blue-800 rounded-lg">Hazırlanıyor</SelectItem>
                        <SelectItem value="Yolda" className="text-xs font-bold text-purple-700 focus:bg-purple-50 focus:text-purple-800 rounded-lg">Kuryede / Yolda</SelectItem>
                        <SelectItem value="Teslim Edildi" className="text-xs font-bold text-green-700 focus:bg-green-50 focus:text-green-800 rounded-lg">Teslim Edildi</SelectItem>
                        <SelectItem value="İptal Edildi" className="text-xs font-bold text-red-700 focus:bg-red-50 focus:text-red-800 rounded-lg">İptal Edildi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-right flex sm:flex-col justify-between sm:justify-end items-center sm:items-end border-t sm:border-t-0 border-green-900/5 pt-3 sm:pt-0">
                    <span className="text-xs font-bold text-green-800/40 uppercase">Genel Toplam</span>
                    <span className="text-2xl sm:text-3xl font-black text-green-600 tracking-tighter">
                      {calculateTotal(order.items).toLocaleString('tr-TR')} <span className="text-sm">TL</span>
                    </span>
                  </div>

                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm flex items-start gap-3 overflow-hidden">
    <div className="text-green-600 mt-1 shrink-0">{icon}</div>
    <div className="overflow-hidden w-full">
      <span className="text-[9px] font-black text-green-800/40 uppercase block tracking-tighter">{label}</span>
      <span className="text-xs font-bold text-green-950 block truncate" title={value}>{value || "Belirtilmedi"}</span>
    </div>
  </div>
);

export default OrdersPage;