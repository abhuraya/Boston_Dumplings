import dumplingImage from "../../assets/Image-_3_.png";


export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div
          className="product-card-image-frame rounded-4 bg-dark mb-3 d-flex align-items-center justify-content-center"
        >
          <img
            className="product-card-image"
            src={dumplingImage}
            alt={`${product.name} illustration`}
          />
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
