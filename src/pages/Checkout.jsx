import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { API_BASE_URL } from "../config/api";
import { executeRecaptcha } from "../lib/recaptcha";

export default function Checkout() {
  const { cartItems, clearCart, user } = useOutletContext();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
  });
  const [orderType, setOrderType] = useState("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

    const orderCustomer = {
      ...customer,
      address: orderType === "delivery" ? customer.address.trim() : "",
    };

    try {
      const createOrderRecaptchaToken = await executeRecaptcha(
        "create_order"
      );
      const sendEmailRecaptchaToken = await executeRecaptcha(
        "send_order_email"
      );

      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: orderCustomer,
          items: cartItems,
          orderType,
          recaptchaToken: createOrderRecaptchaToken,
        }),
      });

      const savedOrder = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          savedOrder.message || "The order could not be saved."
        );
      }

      const emailResponse = await fetch(
        "/.netlify/functions/send-order-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: savedOrder.orderId,
            customer: orderCustomer,
            items: cartItems,
            total: savedOrder.total,
            orderType,
            recaptchaToken: sendEmailRecaptchaToken,
          }),
        }
      );

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(
          emailResult.message ||
            "The confirmation email could not be sent."
        );
      }

      navigate("/order-confirmation", {
        replace: true,
        state: {
          orderId: savedOrder.orderId,
          customerName: customer.name,
          email: customer.email,
          items: cartItems,
          total: savedOrder.total,
          orderType,
        },
      });

      setTimeout(() => {
        clearCart();
      }, 0);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <Box component="main" className="soft-grid auth-wrap">
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography className="eyebrow">Your order</Typography>
          <Typography
            variant="h1"
            sx={{ mt: 2, fontSize: { xs: "3rem", sm: "4rem" } }}
          >
            Your order is empty.
          </Typography>
          <Typography sx={{ mt: 2, color: "text.secondary", lineHeight: 1.75 }}>
            Add a few dumplings before heading to checkout.
          </Typography>
          <Button component={Link} to="/" variant="contained" sx={{ mt: 4 }}>
            Return to menu
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <main>
      <Box className="page-hero">
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ px: 0, mb: 3 }}
          >
            Back to menu
          </Button>
          <Typography className="eyebrow">Almost there</Typography>
          <Typography
            variant="h1"
            sx={{ mt: 2, maxWidth: 760, fontSize: { xs: "3.35rem", md: "5.7rem" } }}
          >
            Let’s get dinner to you.
          </Typography>
          <Typography
            sx={{ mt: 3, maxWidth: 620, color: "text.secondary", lineHeight: 1.8 }}
          >
            Choose pickup or delivery, confirm your details, and we’ll take
            care of the rest.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.35fr) minmax(320px, .65fr)" },
              gap: { xs: 4, md: 5 },
              alignItems: "start",
            }}
          >
            <Card component="section">
              <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", sm: "2.8rem" } }}>
                  Your details
                </Typography>
                <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
                  We’ll use these to confirm and coordinate your order.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                  <Typography fontWeight={800} sx={{ mb: 1.5 }}>
                    How would you like your order?
                  </Typography>
                  <ToggleButtonGroup
                    value={orderType}
                    exclusive
                    fullWidth
                    onChange={(_event, nextType) => {
                      if (nextType) setOrderType(nextType);
                    }}
                    aria-label="Order type"
                    sx={{
                      mb: 3,
                      "& .MuiToggleButton-root": {
                        gap: 1,
                        minHeight: 54,
                        borderColor: "divider",
                        textTransform: "none",
                        fontWeight: 800,
                      },
                    }}
                  >
                    <ToggleButton value="delivery" aria-label="Delivery">
                      <DeliveryDiningRoundedIcon /> Delivery
                    </ToggleButton>
                    <ToggleButton value="pickup" aria-label="Pickup">
                      <StorefrontOutlinedIcon /> Pickup
                    </ToggleButton>
                  </ToggleButtonGroup>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Full name"
                      name="name"
                      value={customer.name}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Email address"
                      name="email"
                      type="email"
                      value={customer.email}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Phone number"
                      name="phone"
                      type="tel"
                      value={customer.phone}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    {orderType === "delivery" && (
                      <TextField
                        label="Delivery address"
                        name="address"
                        value={customer.address}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    )}
                    <TextField
                      label="Order notes"
                      name="notes"
                      value={customer.notes}
                      onChange={handleChange}
                      multiline
                      minRows={4}
                      fullWidth
                      sx={{ gridColumn: "1 / -1" }}
                    />
                  </Box>

                  {message && (
                    <Alert severity="error" sx={{ mt: 2.5 }}>
                      {message}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : null
                    }
                  >
                    {isSubmitting ? "Submitting order…" : "Place order"}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card component="aside" className="order-card" sx={{ position: { md: "sticky" }, top: { md: 106 } }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography className="eyebrow">Order summary</Typography>
                <Typography variant="h3" sx={{ mt: 1, fontSize: "2rem" }}>
                  What you chose
                </Typography>

                <Stack spacing={2} divider={<Divider flexItem />} sx={{ mt: 3 }}>
                  {cartItems.map((item) => (
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
                  <Typography variant="h3" sx={{ fontSize: "1.85rem" }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </main>
  );
}
