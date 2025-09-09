import React from "react";
import "./popup.css";

const Popup = () => {
  return (
    <div className="popup-container">
      <h2>AppliStash</h2>
      <form id="loginForm">
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
      <div id="result" className="result"></div>
    </div>
  );
};

export default Popup;
