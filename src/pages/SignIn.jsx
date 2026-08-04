import { useState } from "react";
import { Link, 
        useNavigate,
      useOutletContext, 
    } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

async function handleSubmit(event) {
  event.preventDefault();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Sign in failed.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    alert(data.message);
    navigate("/");
    console.log("Signed-in user:", data.user);
  } catch (error) {
    console.error("Sign-in error:", error);
    alert("Could not connect to the server.");
  }
}

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card border-0 shadow p-4">
            <h1 className="text-center mb-2">Welcome Back</h1>

            <p className="text-center text-muted mb-4">
              Sign in to your Boston Dumplings account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
              >
                Sign In
              </button>
            </form>

            <p className="text-center mt-4 mb-0">
              Don’t have an account?{" "}
              <Link to="/signup">Create one</Link>
            </p>

            <p className="text-center mt-2 mb-0">
              <Link to="/">Continue as a guest</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
