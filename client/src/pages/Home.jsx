import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/slices/products.slice";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CardImage } from "@/components/ProductsCard";
import { Navigate } from "react-router-dom";


export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (user && user.admin) {
    return <Navigate to="/admin/panel" />;
  } else {
    return (
      <div className="home-container relative">
        <h2 className="text-center text-2xl font-bold text-white mt-6">
          Ürünler Listesi
        </h2>

        {loading && (
          <div className="flex items-center gap-4 justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Button size="lg">
              <Spinner className="mr-4 " data-icon="inline-start" />
              Loading...
            </Button>
          </div>
        )}
        {error && <p className="error">{error}</p>}

        <div className="product-list grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center mt-10 mx-10">
          {products && products.length > 0 ? (
            products.map((product) => (
              <CardImage product={product} key={product._id} />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    );
  }
}
