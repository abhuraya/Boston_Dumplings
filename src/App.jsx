import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          localStorage.removeItem("user");
          setUser(null);
          return;
        }

        const data = await response.json();

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

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
      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Sign out failed.");
        return;
      }

      localStorage.removeItem("user");
      setUser(null);
      navigate("/");

      alert(data.message);
    } catch (error) {
      console.error("Sign-out error:", error);
      alert("Could not connect to the server.");
    }
  }

  return (
    <div className="app-shell">
      <nav className="navbar navbar-dark bg-danger">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Boston Dumplings
          </Link>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-white">
                  Welcome, {user.name}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={signOut}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light" to="/signin">
                  Sign In
                </Link>

                <Link className="btn btn-light text-danger" to="/signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

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
    </div>
  );
}

export default App;