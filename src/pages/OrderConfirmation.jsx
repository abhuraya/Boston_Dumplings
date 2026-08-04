import { Link, useLocation } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

export default function OrderConfirmation() {
  const location = useLocation();

  const {
    orderId = "",
    customerName = "Customer",
    email = "",
    items = [],
    total = 0,
    orderType = "delivery",
  } = location.state || {};
  const isPickup = orderType === "pickup";

  return (
    <Box component="main" className="soft-grid" sx={{ py: { xs: 7, md: 11 } }}>
      <Container maxWidth="md">
        <Card sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              py: { xs: 6, md: 7 },
              px: 3,
              textAlign: "center",
              bgcolor: "secondary.dark",
              color: "#fffdf9",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: "auto",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,.9)",
                color: "secondary.dark",
              }}
            >
              <CheckRoundedIcon sx={{ fontSize: 38 }} />
            </Box>
            <Typography
              variant="h1"
              sx={{ mt: 3, fontSize: { xs: "3rem", sm: "4.2rem" } }}
            >
              Order confirmed.
            </Typography>
            <Typography sx={{ mt: 2, color: "rgba(255,255,255,.76)" }}>
              Thanks, {customerName}. We received your order.
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {email && (
              <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
                A confirmation was sent to <strong>{email}</strong>.
              </Typography>
            )}

            {items.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                  p: { xs: 2.5, sm: 3.5 },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,.5)",
                }}
              >
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Box>
                    <Typography className="eyebrow">Order summary</Typography>
                    {orderId && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Order #{orderId}
                      </Typography>
                    )}
                  </Box>
                  <Typography fontWeight={800}>
                    {isPickup ? "Pickup" : "Delivery"}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 3 }} />
                <Stack spacing={2} divider={<Divider flexItem />}>
                  {items.map((item) => (
                    <Stack key={item.id} direction="row" justifyContent="space-between" gap={2}>
                      <Typography color="text.secondary">
                        {item.name} × {item.quantity}
                      </Typography>
                      <Typography fontWeight={800}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 3 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography fontWeight={800}>Total</Typography>
                  <Typography variant="h3" sx={{ fontSize: "1.8rem" }}>
                    ${Number(total).toFixed(2)}
                  </Typography>
                </Stack>
              </Box>
            )}

            <Alert severity="success" sx={{ mt: 3 }}>
              {isPickup
                ? "We will contact you when your order is ready for pickup."
                : "We will contact you with an update about preparation and delivery."}
            </Alert>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button component={Link} to="/" variant="contained">
                Return to menu
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
