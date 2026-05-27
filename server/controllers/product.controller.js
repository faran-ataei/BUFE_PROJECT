import Product from "../model/products.model.js";
import User from "../model/user.model.js";

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create new product
const createProduct = async (req, res) => {
  try {
    // kullanıcı bilgisi alınabilir.
    const user = await User.findOne({ _id: req.user.id });
    
    if (!user.admin) {
      return res.status(403).json({ message: "Yetkili kullanıcı degil" });
    }

    const { name, description, price, image } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      image,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🌟 ONAYLANDI: Ürün güncelleme kontrolörü (Backend)
const updateProduct = async (req, res) => {
  try {
    // 1. İstekte bulunan kullanıcının admin olup olmadığını kontrol et
    const user = await User.findOne({ _id: req.user.id });
    
    if (!user || !user.admin) {
      return res.status(403).json({ message: "Yetkili kullanıcı değilsiniz." });
    }

    const { name, description, price, image } = req.body;

    // 2. Ürünü bul ve veritabanında güncelle
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description, // 🌟 Hem backend hem frontend tarafında senkronize edildi
        price,
        image,
      },
      { 
        new: true, // Güncellenmiş yeni veriyi geri döndürür
        runValidators: true // Şema (Schema) kurallarını (örn: min fiyat) kontrol eder
      }
    );

    // 3. Ürün sistemde yoksa 404 hatası fırlat
    if (!updatedProduct) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    // 4. Güncellenen veriyi başarılı (200) koduyla frontend'e gönder
    // 🌟 ÖNEMLİ: EditProductModal'ın `response.data` olarak okuyabilmesi için obje yapısını netleştirdik
    res.status(200).json({
      success: true,
      message: "Ürün başarıyla güncellendi.",
      data: updatedProduct 
    });

  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    res.status(500).json({ message: error.message });
  }
};

// delete product by id
const deleteProduct = async (req, res) => {
  try {
    // kullanıcı bilgisi alınabilir.
    const user = await User.findOne({ _id: req.user.id });
    
    if (!user.admin) {
      return res.status(403).json({ message: "Yetkili kullanıcı degil" });
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
