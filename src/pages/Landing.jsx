import { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import ProductCard from "../components/ProductCard.jsx";
import Cart from "../components/Cart.jsx";
import products from "../data/products.js";

const orderSteps = [
  ["01", "Choose your favorites", "Build an order from our small, focused menu."],
  ["02", "We fold them fresh", "Your dumplings are prepared with care in small batches."],
  ["03", "Pickup or delivery", "Choose the option that fits your day at checkout."],
];

export default function Landing() {
  const location = useLocation();
  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useOutletContext();

  useEffect(() => {
    if (!location.hash) return;

    const target = document.querySelector(location.hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <main>
      <Box component="section" className="hero-banner">
        <Container maxWidth="xl" sx={{ width: "100%", py: { xs: 7, md: 10 } }}>
          <Box sx={{ maxWidth: 650 }}>
            <Chip
              icon={<LocalDiningOutlinedIcon />}
              label="Handmade in Boston"
              sx={{
                bgcolor: "rgba(255,255,255,.68)",
                border: "1px solid rgba(96,53,38,.14)",
                color: "primary.dark",
              }}
            />
            <Typography
              variant="h1"
              sx={{
                mt: 3,
                maxWidth: 620,
                fontSize: { xs: "3.55rem", sm: "4.7rem", md: "6rem" },
              }}
            >
              Made slowly.
              <br />
              Shared warmly.
            </Typography>
            <Typography
              sx={{
                mt: 3,
                maxWidth: 530,
                color: "text.secondary",
                fontSize: { xs: "1.04rem", md: "1.18rem" },
                lineHeight: 1.75,
              }}
            >
              Fresh, handmade dumplings with thoughtful fillings—ready
              for a quiet night in, a table full of friends, or anything
              between.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 4, alignItems: { xs: "stretch", sm: "center" } }}
            >
              <Button
                component="a"
                href="#menu"
                variant="contained"
                size="large"
              >
                Order dumplings
              </Button>
              <Button
                component="a"
                href="#how-it-works"
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                How it works
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="section" className="soft-grid" sx={{ py: { xs: 9, md: 13 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.45fr .55fr" },
              gap: { xs: 6, md: 10 },
              alignItems: "center",
            }}
          >
            <Box sx={{ maxWidth: 680 }}>
              <Typography className="eyebrow">Our kitchen</Typography>
              <Typography
                variant="h2"
                sx={{ mt: 1.5, fontSize: { xs: "2.5rem", md: "3.7rem" } }}
              >
                A small menu, made with care.
              </Typography>
              <Typography
                sx={{ mt: 2, color: "text.secondary", lineHeight: 1.8 }}
              >
                We keep things simple: well-seasoned fillings, delicate
                wrappers, and the kind of food that feels generous without
                trying too hard.
              </Typography>
            </Box>

            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              justifyContent="space-around"
            >
              <Box>
                <Typography variant="h3" sx={{ color: "primary.dark", fontSize: "2.4rem" }}>
                  3
                </Typography>
                <Typography color="text.secondary">Signature fillings</Typography>
              </Box>
              <Box>
                <Typography variant="h3" sx={{ color: "secondary.dark", fontSize: "2.4rem" }}>
                  2
                </Typography>
                <Typography color="text.secondary">Ways to receive</Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="section" id="menu" sx={{ py: { xs: 9, md: 13 } }}>
        <Container maxWidth="xl">
          <Box sx={{ maxWidth: 660, mx: "auto", textAlign: "center" }}>
            <Typography className="eyebrow">The menu</Typography>
            <Typography
              variant="h2"
              sx={{ mt: 1.5, fontSize: { xs: "2.55rem", md: "3.8rem" } }}
            >
              Choose what sounds good.
            </Typography>
            <Typography sx={{ mt: 2, color: "text.secondary", lineHeight: 1.8 }}>
              Pork, chicken, or vegetable—each one folded by hand and made
              for sharing.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: { xs: 5, md: 7 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 2fr) minmax(320px, .82fr)" },
              gap: { xs: 4, lg: 5 },
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 3,
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </Box>

            <Box id="order" sx={{ position: { lg: "sticky" }, top: { lg: 106 } }}>
              <Cart
                items={cartItems}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeItem}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        id="how-it-works"
        className="section-tint"
        sx={{ py: { xs: 9, md: 12 } }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 620 }}>
            <Typography className="eyebrow">From our kitchen to you</Typography>
            <Typography
              variant="h2"
              sx={{ mt: 1.5, fontSize: { xs: "2.45rem", md: "3.55rem" } }}
            >
              Dinner, kept simple.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 6,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 4, md: 0 },
            }}
          >
            {orderSteps.map(([number, title, body], index) => (
              <Box
                key={number}
                sx={{
                  px: { md: 4 },
                  pl: { md: index === 0 ? 0 : 4 },
                  borderLeft: { md: index === 0 ? 0 : "1px solid" },
                  borderColor: "divider",
                }}
              >
                <Typography className="eyebrow">{number}</Typography>
                <Typography variant="h3" sx={{ mt: 2, fontSize: "1.8rem" }}>
                  {title}
                </Typography>
                <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.7 }}>
                  {body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </main>
  );
}
