import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { API_BASE_URL } from "../config/api";

function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Sign in failed.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (requestError) {
      console.error("Sign-in error:", requestError);
      setError("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="main" className="soft-grid auth-wrap">
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: { xs: 3.5, sm: 6 } }}>
            <Box
              sx={{
                width: 54,
                height: 54,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "#efe1d8",
                color: "primary.dark",
              }}
            >
              <LockOutlinedIcon />
            </Box>
            <Typography
              variant="h1"
              sx={{ mt: 3, fontSize: { xs: "3rem", sm: "3.9rem" } }}
            >
              Welcome back.
            </Typography>
            <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.7 }}>
              Sign in to make your next Boston Dumplings order a little easier.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <Stack spacing={2}>
                <TextField
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2.5 }}
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </Box>

            <Typography sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
              Don’t have an account?{" "}
              <Box component={Link} to="/signup" sx={{ color: "primary.dark", fontWeight: 800 }}>
                Create one
              </Box>
            </Typography>
            <Typography sx={{ mt: 1.5, textAlign: "center" }}>
              <Box component={Link} to="/" sx={{ color: "primary.dark", fontWeight: 800 }}>
                Continue as a guest
              </Box>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default SignIn;
