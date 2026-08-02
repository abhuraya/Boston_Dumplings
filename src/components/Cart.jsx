import { Link } from "react-router-dom";


export default function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <aside className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-4">Your order</h2>

        {items.length === 0 ? (
          <p className="text-muted mb-0">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="d-grid gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-bottom pb-3"
                >
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <h3 className="h6 mb-1">{item.name}</h3>
                      <p className="text-muted mb-2">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    <strong>
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onDecrease(item.id)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onIncrease(item.id)}
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger ms-auto"
                      onClick={() => onRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-4">
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <Link to="/checkout" className="btn btn-dark w-100 mt-4">
              Continue to checkout
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}