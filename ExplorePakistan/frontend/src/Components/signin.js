import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8080";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      console.log("Firebase Auth successful, fetching user data...");
      
      // Send token to your backend server
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed on server");
      }

      const userData = await response.json();
      console.log("Login successful:", userData);
      
      // Store user info in localStorage or sessionStorage if needed
      localStorage.setItem("user", JSON.stringify(userData.user));
      
      // Redirect based on email/role
      if (email.toLowerCase() === "admin@gmail.com") {
        console.log("Admin login successful, navigating to Admin Dashboard...");
        navigate("/adminDashBoard");
      } else {
        console.log("User login successful, navigating to User Dashboard...");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const style = {
    signIn: {
      backgroundImage: "url(background.jpg)",
      backgroundPosition: "center",
      backgroundSize: "cover",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      height: "100vh",
      width: "100%",
    },
    parent_div: {
      backgroundColor: "rgba(193, 193, 193, 0.5)",
      WebkitBackdropFilter: "blur(5px)",
      backdropFilter: "blur(5px)",
      marginRight: "250px",
      width: "400px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "1px 1px 2px rgba(255, 255, 255, 0.3) ,-1px -1px 2px rgba(255, 255, 255, 0.3)",
      color: "white",
      borderRadius: "20px",
    },
    title: {
      fontSize: "30px",
      color: "darkgreen",
    },
    form_div: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      color: "black",
    },
    input_area: {
      borderRadius: "10px",
      padding: "15px 10px",
      width: "67%",
      border: "none",
      backgroundColor: "rgb(226, 226, 226)",
    },
    button: {
      width: "69%",
      borderRadius: "10px",
      padding: "15px 0px",
      marginTop: "20px",
      border: "none",
      backgroundColor: "darkgreen",
      color: "white",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
    errorText: {
      color: "red",
      marginTop: "10px",
      textAlign: "center",
      maxWidth: "80%",
    }
  };

  return (
    <div style={style.signIn}>
      <div style={style.parent_div}>
        <h2 style={style.title}>EXPLORE PAKISTAN</h2>
        <form onSubmit={handleLogin} style={style.form_div}>
          <label style={{ width: "67%" }}>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={style.input_area}
            disabled={loading}
            required
          />
          <label style={{ width: "67%" }}>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={style.input_area}
            disabled={loading}
            required
          />
          <button type="submit" style={style.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p style={style.errorText}>{error}</p>}
        </form>
        <p style={{ marginBottom: "2rem", color: "black" }}>
          Don't have an account? <Link to={"/signUp"}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;