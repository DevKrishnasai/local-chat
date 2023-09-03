import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="intro">
        <h2>Local Chat</h2>
        <p>--- Made with love ---</p>
      </div>
      <div className="formWrapper">
        <div className="center">
          <span className="logo">Login</span>

          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email*" />
            <input type="password" placeholder="password*" />
            <button>Sign in</button>
          </form>
          <h3>{err && <span>Login email or password not correct</span>}</h3>
          <p>
            You don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
