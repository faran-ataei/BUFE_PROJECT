import Order from "../model/order.model.js";


export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const order = new Order({ ...req.body, user: userId });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sipariş kaydedilemedi" });
  }
};


export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Siparişler alınamadı" });
  }
};
