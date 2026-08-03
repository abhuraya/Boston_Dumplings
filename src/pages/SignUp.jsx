import { useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    console.log("Registration form:", formData);
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card border-0 shadow p-4">
            <h1 className="text-center mb-2">Create an Account</h1>

            <p className="text-center text-muted mb-4">
              Save your information and make ordering easier.
            </p>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <div className="mb-3">
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
                  minLength="8"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="form-label"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="8"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
              >
                Create Account
              </button>
            </form>

            <p className="text-center mt-4 mb-0">
              Already have an account?{" "}
              <Link to="/signin">Sign in</Link>
            </p>

            <p className="text-center mt-2 mb-0">
              <Link to="/">Return to the menu</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUp;