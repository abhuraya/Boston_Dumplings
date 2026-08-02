import { useOutletContext } from "react-router-dom";

import ProductCard from "../components/ProductCard.jsx";
import Cart from "../components/Cart.jsx";
import products from "../data/products.js";

export default function Landing() {
          const {
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
          } = useOutletContext();


  return (
    <main>
      <section className="bg-dark text-white py-5">
        <div className="container py-4 text-center">
          <p className="text-uppercase fw-semibold text-warning mb-2">
            Handmade in Boston
          </p>

          <h1 className="display-4 fw-bold">
            Boston Dumplings
          </h1>

          <p className="lead mx-auto mb-0" style={{ maxWidth: "650px" }}>
            Fresh handmade dumplings prepared with quality ingredients
            and ready for pickup or delivery.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="mb-4">
              <p className="text-uppercase text-success fw-semibold mb-2">
                Our menu
              </p>

              <h2 className="display-6 fw-bold">
                Choose your dumplings
              </h2>
            </div>

            <div className="row g-4">
              {products.map((product) => (
                <div className="col-md-6" key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: "24px" }}>
              <Cart
                items={cartItems}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeItem}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}