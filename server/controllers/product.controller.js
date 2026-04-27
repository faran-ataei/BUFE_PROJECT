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

// update product by id
const updateProduct = async (req, res) => {
  try {
    // kullanıcı bilgisi alınabilir.
    const user = await User.findOne({ _id: req.user.id });
    
    if (!user.admin) {
      return res.status(403).json({ message: "Yetkili kullanıcı degil" });
    }

    const { name, description, price, image } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        image,
      },
      { new: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
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
