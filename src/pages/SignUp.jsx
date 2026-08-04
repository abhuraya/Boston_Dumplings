import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { API_BASE_URL } from "../config/api";

function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Account creation failed.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (requestError) {
      console.error("Registration error:", requestError);
      setError("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="main" className="soft-grid auth-wrap">
      <Container maxWidth="md">
        <Card>
          <CardContent sx={{ p: { xs: 3.5, sm: 6 } }}>
            <Box
              sx={{
                width: 54,
                height: 54,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "#e5e9df",
                color: "secondary.dark",
              }}
            >
              <PersonAddAltOutlinedIcon />
            </Box>
            <Typography
              variant="h1"
              sx={{ mt: 3, fontSize: { xs: "3rem", sm: "3.9rem" } }}
            >
              Make ordering easier.
            </Typography>
            <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.7 }}>
              Create an account to save your contact and delivery information.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
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
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
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
                  label="Phone number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Delivery address"
                  name="address"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  inputProps={{ minLength: 8 }}
                  helperText="Use at least 8 characters"
                  required
                  fullWidth
                />
                <TextField
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  inputProps={{ minLength: 8 }}
                  required
                  fullWidth
                />
              </Box>

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
                sx={{ mt: 3 }}
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </Box>

            <Typography sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
              Already have an account?{" "}
              <Box component={Link} to="/signin" sx={{ color: "primary.dark", fontWeight: 800 }}>
                Sign in
              </Box>
            </Typography>
            <Typography sx={{ mt: 1.5, textAlign: "center" }}>
              <Box component={Link} to="/" sx={{ color: "primary.dark", fontWeight: 800 }}>
                Return to the menu
              </Box>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default SignUp;
