import React from "react";
import "./Navbar.css";

import { logout } from "../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";

import { selectToken } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">Tailwebs</div>
      <div className="navbar-user">
        <span className="navbar-username">{token?.data?.username}</span>
        <button className="navbar-logout" onClick={handleLogout}>
          {token ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
