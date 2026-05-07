import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5050", {
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
        console.log(response);
        setOrders(response.data);
      } catch (error) {
        console.error("Siparişler çekilirken hata oluştu:", error);
      }
    };

    fetchOrders();

    socket.on("newOrderReceived", (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
      audio.play().catch(e => console.log("Ses çalما hatası:", e));
    });

    return () => socket.off("newOrderReceived");
  }, []);

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-5 font-sans min-h-screen">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
        Sipariş Yönetimi <span className="text-xl">📋</span>
      </h1>
      <hr className="mb-6" />
      
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 italic">Henüz kayıtlı bir sipariş bulunmamaktadır.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Header: Müşteri Bilgisi و Tarih */}
              <div className="flex justify-between items-center mb-4">
                <strong className="text-lg text-blue-700">
                  👤 Müşteri: {order.user?.name || "Misafir Kullanıcı"}
                </strong>
                <span className="text-sm text-gray-400 font-medium">
                  📅 {new Date(order.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
              
              {/* Detay Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p>📧 <span className="font-semibold">E-posta:</span> {order.email}</p>
                <p>📍 <span className="font-semibold">Adres:</span> {order.address}</p>
                <p>📞 <span className="font-semibold">Telefon:</span> {order.phone}</p>
                <p>💳 <span className="font-semibold">Ödeme:</span> {order.payment}</p>
              </div>
              
              {/* Tablo */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-blue-500">
                      <th className="p-3 font-semibold text-gray-700">Ürün Adı</th>
                      <th className="p-3 font-semibold text-gray-700">Adet</th>
                      <th className="p-3 font-semibold text-gray-700">Birim Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-gray-800">{item.name}</td>
                        <td className="p-3 text-gray-800 font-medium">{item.quantity}</td>
                        <td className="p-3 text-gray-800">{item.price?.toLocaleString('tr-TR')} TL</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Toplam Tutar */}
              <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-100 flex justify-between items-center text-red-600">
                <span className="text-gray-700 font-medium text-lg">Toplam Tutar:</span>
                <span className="text-2xl font-bold underline decoration-double decoration-red-200">
                  {calculateTotal(order.items).toLocaleString('tr-TR')} TL
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;