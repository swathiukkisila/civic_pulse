import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Welcome to Civic Pulse</h1>
      <p className="mb-5">Report and track your civic issues easily.</p>
      <div>
        <Link to="/login" className="btn btn-primary mr-3">Login</Link>
        <Link to="/signup" className="btn btn-outline-primary">Sign Up</Link>
      </div>
    </div>
  );
};

export default LandingPage;
