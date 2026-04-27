import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/slices/products.slice";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CardImage } from "@/components/ProductsCard";

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="home-container relative">
      <h2 className="text-center text-2xl font-bold">Products</h2>

      {loading && (
        <div className="flex items-center gap-4 justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Button size="lg">
            <Spinner className="mr-4 " data-icon="inline-start" />
            Loading...
          </Button>
        </div>
      )}
      {error && <p className="error">{error}</p>}

      <div className="product-list flex flex-row flex-wrap gap-5 justify-center mt-10 mx-5">
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
