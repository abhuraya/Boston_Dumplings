import PropTypes from "prop-types";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import chickenImage from "../../assets/ChickenMeat.jpg";
import porkImage from "../../assets/Pork.jpg";
import vegetableImage from "../../assets/Veggies.jpg";

const productImages = {
  1: porkImage,
  2: chickenImage,
  3: vegetableImage,
};

const productTints = {
  1: "#f1e1d7",
  2: "#e8ece3",
  3: "#eee7dc",
};

export default function ProductCard({ product, onAddToCart }) {
  return (
    <Card
      component="article"
      className="product-card"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: productTints[product.id],
        overflow: "hidden",
      }}
    >
      <Box sx={{ height: 245, overflow: "hidden" }}>
        <img
          className="product-card-image"
          src={productImages[product.id]}
          alt={product.name}
        />
      </Box>

      <CardContent
        sx={{
          p: { xs: 3, md: 3.5 },
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Typography className="eyebrow">Handmade batch</Typography>
        <Typography variant="h3" sx={{ mt: 1.5, fontSize: "1.95rem" }}>
          {product.name}
        </Typography>
        <Typography
          sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.72, flex: 1 }}
        >
          {product.description}
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Button
            type="button"
            variant="contained"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => onAddToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};
