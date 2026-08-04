import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function Cart({ items, onIncrease, onDecrease, onRemove }) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Card component="aside" className="order-card">
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: "#efe2d9",
              color: "primary.dark",
            }}
          >
            <ShoppingBagOutlinedIcon />
          </Box>
          <Box>
            <Typography className="eyebrow">Your order</Typography>
            <Typography variant="h3" sx={{ mt: 0.4, fontSize: "1.75rem" }}>
              A good meal starts here.
            </Typography>
          </Box>
        </Stack>

        {items.length === 0 ? (
          <Box
            sx={{
              mt: 4,
              p: 3,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,.48)",
            }}
          >
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Your order is empty. Add a favorite from the menu.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={2.5} divider={<Divider flexItem />} sx={{ mt: 4 }}>
              {items.map((item) => (
                <Box key={item.id}>
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Box>
                      <Typography fontWeight={800}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        ${item.price.toFixed(2)} each
                      </Typography>
                    </Box>
                    <Typography fontWeight={800}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => onDecrease(item.id)}
                      aria-label={`Decrease ${item.name} quantity`}
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <RemoveRoundedIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ minWidth: 32, textAlign: "center", fontWeight: 800 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onIncrease(item.id)}
                      aria-label={`Increase ${item.name} quantity`}
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      sx={{ ml: "auto !important", color: "primary.main" }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography fontWeight={800}>Total</Typography>
              <Typography variant="h3" sx={{ fontSize: "1.8rem" }}>
                ${total.toFixed(2)}
              </Typography>
            </Stack>

            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
            >
              Continue to checkout
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

Cart.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
