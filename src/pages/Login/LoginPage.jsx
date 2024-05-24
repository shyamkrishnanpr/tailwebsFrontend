import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectError,
  selectToken,
} from "../../redux/features/authSlice";

import { useNavigate } from "react-router-dom";

import "./Login.css";

const LoginPage = () => {
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      dispatch(login({ username, password }))
        .then((responce) => {
          if (responce?.payload?.data?.success) {
            navigate("/home");
          } else {
            setLoginError(responce?.payload);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!username) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <div className="login-container">
      <h1 style={{ color: "red" }}>Tailwebs</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="forgot-password">
          <a href="#forgot-password">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        {loginError && <div className="login-error">{loginError}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
