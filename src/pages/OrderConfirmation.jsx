import { Link, useLocation } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();

  const {
    customerName = "Customer",
    email = "",
    items = [],
    total = 0,
  } = location.state || {};

  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <section
          className="card border-0 shadow-sm mx-auto overflow-hidden"
          style={{ maxWidth: "720px" }}
        >
          <div className="bg-success text-white text-center p-5">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-white text-success rounded-circle mb-4"
              style={{
                width: "72px",
                height: "72px",
                fontSize: "2rem",
                fontWeight: "700",
              }}
              aria-hidden="true"
            >
              ✓
            </div>

            <h1 className="display-6 fw-bold mb-2">
              Order confirmed!
            </h1>

            <p className="mb-0 opacity-75">
              Thanks, {customerName}. We received your order.
            </p>
          </div>

          <div className="card-body p-4 p-md-5">
            {email && (
              <p className="text-muted text-center mb-4">
                A confirmation was sent to{" "}
                <strong className="text-dark">{email}</strong>.
              </p>
            )}

            {items.length > 0 && (
              <div className="border rounded-4 p-4 mb-4">
                <h2 className="h5 mb-4">Order summary</h2>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between gap-3 mb-3"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <strong>
                      $
                      {(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>
                ))}

                <hr />

                <div className="d-flex justify-content-between fs-5">
                  <strong>Total</strong>
                  <strong>${Number(total).toFixed(2)}</strong>
                </div>
              </div>
            )}

            <div className="alert alert-success" role="status">
              We will contact you with an update about preparation and
              delivery.
            </div>

            <div className="text-center mt-4">
              <Link to="/" className="btn btn-dark px-4">
                Return to menu
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}