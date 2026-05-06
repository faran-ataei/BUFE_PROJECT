import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, decreaseQuantity, addToCart, clearCart } from "../redux/slices/cart.slice";
import { Link } from "react-router-dom";

function Basket() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return <div className="p-6 text-center text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Sepetiniz boş</div>;
  }

  return (
    <div className="p-6 mx-30">
      <h1 className="text-2xl font-bold mb-4 text-white">Sepetim</h1>
      <ul className="space-y-4 ">
        {cartItems.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between border rounded-lg p-4 bg-gray-700 mx-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1 px-6 text-white">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p>Fiyat: {item.price} ₺</p>
              <p>Adet: {item.quantity}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch(decreaseQuantity(item._id))}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                -
              </button>
              <button
                onClick={() => dispatch(addToCart(item))}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                +
              </button>
              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Kaldır
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center ">
        <button
          onClick={() => dispatch(clearCart())}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Sepeti Temizle
        </button>
        <Link to="/orders">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Sipariş Ver
          </button>
        </Link>
      </div>

      <div className="mt-4 text-right text-lg font-bold mx-20 text-white">
        Toplam: {totalPrice} ₺
      </div>
    </div>
  );
}

export default Basket;
