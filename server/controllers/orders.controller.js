import Order from "../model/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const order = new Order({ ...req.body, user: userId });
    await order.save();

    const fullOrder = await Order.findById(order._id).populate("user", "name email");

    const io = req.app.get("socketio");
    if (io) {
      io.emit("newOrderReceived", fullOrder);
      console.log("🔔 Yeni sipariş bildirimi gönderildi!");
    }

    res.status(201).json(fullOrder);
  } catch (error) {
    console.error("Sipariş hatası:", error);
    res.status(500).json({ error: "Sipariş kaydedilemedi" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Sipariş listesi hatası:", error);
    res.status(500).json({ error: "Siparişler alınamadı" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Siparişleriniz alınamadı" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const allowedStatuses = ["Beklemede", "Hazırlanıyor", "Yolda", "Teslim Edildi", "İptal Edildi"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Geçersiz sipariş durumu" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!updatedOrder) {
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    const io = req.app.get("socketio");
    if (io) {
      io.emit("orderStatusUpdated", updatedOrder);
      console.log(`⚡ Sipariş #${id} durumu '${status}' olarak güncellendi ve bildirildi!`);
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Sipariş durumu güncelleme hatası:", error);
    res.status(500).json({ error: "Sipariş durumu güncellenemedi" });
  }
};