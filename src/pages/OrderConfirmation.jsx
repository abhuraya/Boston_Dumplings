import { Link, useLocation } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const customerName = location.state?.customerName;

  return (
    <main className="container py-5 text-center">
      <div
        className="card border-0 shadow-sm mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="card-body p-5">
          <h1 className="h2 mb-3">Order confirmed!</h1>

          <p className="text-muted mb-4">
            {customerName
              ? `Thank you, ${customerName}. Your order was submitted successfully.`
              : "Your order was submitted successfully."}
          </p>

          <p className="text-muted">
            Check your email for the order confirmation.
          </p>

          <Link to="/" className="btn btn-success mt-3">
            Return to menu
          </Link>
        </div>
      </div>
    </main>
  );
}