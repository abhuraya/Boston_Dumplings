import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import "./App.css";
import { API_BASE_URL } from "./config/api";

function Wordmark() {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box className="dumpling-mark" aria-hidden="true" />
      <Box>
        <Typography className="wordmark-title">
          BOSTON DUMPLINGS
        </Typography>
        <Typography className="wordmark-subtitle">
          HANDMADE · PICKUP · DELIVERY
        </Typography>
      </Box>
    </Stack>
  );
}

function App() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const cartQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          localStorage.removeItem("user");
          setUser(null);
          return;
        }

        const data = await response.json();

        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } catch (error) {
        console.error("Session check error:", error);
      }
    }

    checkSession();
  }, []);

  function addToCart(product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function increaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  async function signOut() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setNotice(data.message || "Sign out failed.");
        return;
      }

      localStorage.removeItem("user");
      setUser(null);
      setMobileMenuOpen(false);
      navigate("/");
      setNotice(data.message);
    } catch (error) {
      console.error("Sign-out error:", error);
      setNotice("Could not connect to the server.");
    }
  }

  return (
    <Box className="app-shell">
      <AppBar position="sticky" elevation={0} className="site-header">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 74, md: 82 } }}>
            <Box
              component={Link}
              to="/"
              aria-label="Boston Dumplings home"
              className="brand-link"
            >
              <Wordmark />
            </Box>

            <Stack
              component="nav"
              direction="row"
              spacing={0.5}
              sx={{ ml: "auto", display: { xs: "none", md: "flex" } }}
            >
              <Button component={Link} to="/" color="inherit">
                Menu
              </Button>
              <Button
                component={Link}
                to="/#order"
                color="inherit"
                startIcon={
                  <Badge badgeContent={cartQuantity} color="primary">
                    <ShoppingBagOutlinedIcon fontSize="small" />
                  </Badge>
                }
              >
                Your order
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ ml: 2, display: { xs: "none", sm: "flex" } }}
            >
              {user ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Hi, {user.name?.split(" ")[0] || "there"}
                  </Typography>
                  <Button
                    onClick={signOut}
                    startIcon={<LogoutRoundedIcon />}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/signin">
                    Sign in
                  </Button>
                  <Button component={Link} to="/signup" variant="contained">
                    Create account
                  </Button>
                </>
              )}
            </Stack>

            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: "auto", display: { sm: "none" } }}
            >
              <Badge badgeContent={cartQuantity} color="primary">
                <MenuRoundedIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: "min(88vw, 360px)",
            bgcolor: "background.default",
          },
        }}
      >
        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Wordmark />
            <IconButton
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Divider />
          <Button
            component={Link}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            sx={{ justifyContent: "flex-start", color: "text.primary" }}
          >
            Menu
          </Button>
          <Button
            component={Link}
            to="/#order"
            onClick={() => setMobileMenuOpen(false)}
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{ justifyContent: "flex-start", color: "text.primary" }}
          >
            Your order ({cartQuantity})
          </Button>
          {user ? (
            <Button
              onClick={signOut}
              variant="outlined"
              startIcon={<LogoutRoundedIcon />}
            >
              Sign out
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                variant="outlined"
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                variant="contained"
              >
                Create account
              </Button>
            </>
          )}
        </Stack>
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <Outlet
          context={{
            cartItems,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            removeItem,
            clearCart,
            user,
            setUser,
          }}
        />
      </Box>

      <Box component="footer" className="site-footer">
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "flex-end" }}
          >
            <Box>
              <Typography sx={{ fontFamily: "Georgia, serif", fontSize: "1.55rem" }}>
                Boston Dumplings
              </Typography>
              <Typography className="footer-muted">
                Handmade dumplings, prepared for pickup or delivery.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button component={Link} to="/" className="footer-link">
                Menu
              </Button>
              <Button component={Link} to="/signin" className="footer-link">
                Sign in
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,.14)" }} />
          <Typography variant="body2" className="footer-muted">
            © {new Date().getFullYear()} Boston Dumplings.
          </Typography>
        </Container>
      </Box>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4500}
        onClose={() => setNotice("")}
        message={notice}
      />
    </Box>
  );
}

export default App;
