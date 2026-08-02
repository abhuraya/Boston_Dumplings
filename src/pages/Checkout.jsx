import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

export default function Checkout() {
  const { cartItems, clearCart } = useOutletContext();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [name]: value,
    }));
  }

async function handleSubmit(event) {
  event.preventDefault();

  setIsSubmitting(true);
  setMessage("");

  try {
    const response = await fetch(
      "/.netlify/functions/send-order-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          items: cartItems,
          total,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "The order could not be submitted."
      );
    }

    setMessage("Your order was submitted successfully.");
    setOrderComplete(true);
    clearCart();
  } catch (error) {
    setMessage(error.message);
  } finally {
    setIsSubmitting(false);
  }
}
  if (cartItems.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1>Your cart is empty</h1>
        <p className="text-muted">
          Add some dumplings before checking out.
        </p>

        <Link to="/" className="btn btn-success">
          Return to menu
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row g-4">
        <section className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4">Checkout</h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={customer.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={customer.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={customer.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Delivery address
                  </label>

                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    value={customer.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="notes" className="form-label">
                    Order notes
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    className="form-control"
                    rows="4"
                    value={customer.notes}
                    onChange={handleChange}
                  />
                </div>
                {message && (
                  <div
                    className={`alert ${
                      orderComplete ? "alert-success" : "alert-danger"
                    }`}
                    role="alert"
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting order..." : "Place order"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <aside className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Order summary</h2>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-3"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <strong>
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}