import React from "react";
import { FaUserPlus } from "react-icons/fa";

const Signup = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div
          className="card-header text-white"
          style={{ backgroundColor: "#fd7e14" }}
        >
          <h3><FaUserPlus className="me-2" /> Sign Up</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required />
            </div>
            <button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: "#fd7e14" }}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
