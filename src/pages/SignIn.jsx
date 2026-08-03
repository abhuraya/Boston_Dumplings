import { useState } from "react";
import { Link } from "react-router-dom";

function SignIn() {
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

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Sign-in form:", formData);
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