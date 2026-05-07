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