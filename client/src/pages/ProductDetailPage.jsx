import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cart.slice";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useSelector((state) => state.products);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const product = products.find((p) => p._id === id);

  if (!product) {
    return <p>Ürün bulunamadı</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-purple-100 rounded-lg shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-auto object-cover rounded-md mb-6"
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="flex justify-between">
        <p className="text-lg font-semibold text-blue-600">
          Fiyat: {product.price} ₺
        </p>
        {user && (
          <Button
            className="bg-green-600 h-10"
            onClick={() => dispatch(addToCart(product))}
          >
            Sepete Ekle <i class="bi bi-bag-plus"></i>
          </Button>
        )}
      </div>
    </div>
  );
}
