import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  Phone,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
});

export default function ClientMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/my-orders`,
          {
            withCredentials: true,
          },
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Siparişler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();

    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order,
        ),
      );
    });

    return () => socket.off("orderStatusUpdated");
  }, []);

  const getStatusDetails = (status) => {
    switch (status) {
      case "Beklemede":
        return {
          text: "Onay Bekliyor",
          color: "text-amber-700 bg-amber-500/10 border-amber-500/20",
          icon: <Clock size={14} />,
          pulse: "bg-amber-500",
        };
      case "Hazırlanıyor":
        return {
          text: "Hazırlanıyor",
          color: "text-blue-700 bg-blue-500/10 border-blue-500/20",
          icon: <Package size={14} />,
          pulse: "bg-blue-500",
        };
      case "Yolda":
        return {
          text: "Kuryede / Yolda",
          color: "text-purple-700 bg-purple-500/10 border-purple-500/20",
          icon: <Truck size={14} />,
          pulse: "bg-purple-500",
        };
      case "Teslim Edildi":
        return {
          text: "Teslim Edildi",
          color: "text-green-700 bg-green-500/10 border-green-500/20",
          icon: <CheckCircle2 size={14} />,
          pulse: "bg-green-500",
        };
      case "İptal Edildi":
        return {
          text: "İptal Edildi",
          color: "text-red-700 bg-red-500/10 border-red-500/20",
          icon: <XCircle size={14} />,
          pulse: "bg-red-500",
        };
      default:
        return {
          text: "Bilinmiyor",
          color: "text-gray-700 bg-gray-500/10 border-gray-500/20",
          icon: <Clock size={14} />,
          pulse: "bg-gray-500",
        };
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-green-800 font-bold">
        Siparişleriniz yükleniyor...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto mt-6 font-sans min-h-screen">
      <div className="mb-8 bg-black/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-green-950 mb-2 flex items-center gap-2 drop-shadow-sm">
          🛍️ Siparişlerim
        </h1>
        <p className="text-xs sm:text-sm text-green-900 font-bold bg-white/40 px-2 py-1 rounded-md inline-block">
          Siparişlerinizin anlık durumunu ve geçmiş detaylarını buradan takip
          edebilirsiniz.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center p-12 bg-white/70 backdrop-blur-md border border-white/60 rounded-[2rem] shadow-xl">
          <Package
            className="mx-auto text-green-800/40 mb-4 animate-bounce"
            size={56}
          />
          <p className="text-green-950 font-black text-sm sm:text-base tracking-tight">
            Henüz hiçbir sipariş vermediniz.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {orders.map((order) => {
              const status = getStatusDetails(order.status || "Beklemede");
              const isExpanded = expandedOrder === order._id;

              return (
                <motion.div
                  key={order._id}
                  layout
                  className="bg-white/60 backdrop-blur-md border border-white/50 rounded-[2rem] shadow-lg overflow-hidden transition-all duration-300"
                >
                  <div
                    className="p-5 flex justify-between items-center cursor-pointer select-none gap-4"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-green-800/40 font-black uppercase tracking-wider">
                        📅 {new Date(order.createdAt).toLocaleString("tr-TR")}
                      </div>
                      <div className="font-black text-green-950 text-sm sm:text-base">
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        Adet Ürün
                      </div>
                      <div className="text-green-600 font-black text-lg tracking-tight">
                        {calculateTotal(order.items).toLocaleString("tr-TR")}{" "}
                        <span className="text-xs">TL</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${status.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.pulse} animate-pulse`}
                        ></span>
                        {status.text}
                      </span>
                      <button className="text-green-800/40 p-1 hover:bg-green-600/5 rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-green-900/5 bg-green-600/[0.02] px-5 pb-5 pt-4 space-y-4"
                    >
                      <h3 className="text-[10px] font-black text-green-800/40 uppercase tracking-widest">
                        Sipariş İçeriği
                      </h3>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between items-center text-xs sm:text-sm bg-white/80 p-3 rounded-xl border border-white/50 shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-black text-green-950">
                                {item.name}
                              </span>
                              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-bold">
                                x{item.quantity}
                              </span>
                            </div>
                            <span className="font-bold text-green-700">
                              {(item.price * item.quantity).toLocaleString(
                                "tr-TR",
                              )}{" "}
                              TL
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-green-900/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                        <div className="flex items-center gap-2 text-green-950/70 bg-white/40 p-2 rounded-xl border border-white/30">
                          <MapPin
                            size={14}
                            className="text-green-600 shrink-0"
                          />
                          <span className="truncate font-medium">
                            <b>Adres:</b> {order.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-green-950/70 bg-white/40 p-2 rounded-xl border border-white/30">
                          <Phone
                            size={14}
                            className="text-green-600 shrink-0"
                          />
                          <span className="font-medium">
                            <b>Tel:</b> {order.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-green-950/70 bg-white/40 p-2 rounded-xl border border-white/30">
                          <CreditCard
                            size={14}
                            className="text-green-600 shrink-0"
                          />
                          <span className="font-medium uppercase">
                            <b>Ödeme:</b> {order.payment}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
