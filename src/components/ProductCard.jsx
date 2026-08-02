export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div
          className="rounded-4 bg-light mb-3 d-flex align-items-center justify-content-center"
          style={{ minHeight: "180px" }}
        >
          <span className="text-muted">Product image</span>
        </div>

        <h2 className="h5">{product.name}</h2>

        <p className="text-muted flex-grow-1">
          {product.description}
        </p>

        <div className="d-flex align-items-center justify-content-between">
          <strong>${product.price.toFixed(2)}</strong>

          <button
            type="button"
            className="btn btn-success"
            onClick={() => onAddToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}