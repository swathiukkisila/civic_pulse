import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  const featuresRef = useRef(null);
  const carouselRef = useRef(null);
  const statsRef = useRef(null);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top" style={{ backgroundColor: "#fff0f3" }}>
        <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
        <img 
          src="/logo.jpeg" 
          alt="Civic Pulse Logo" 
          style={{ 
            height: "40px", 
            width: "40px", 
            borderRadius: "50%", 
            objectFit: "cover" 
          }} 
        />

          <span className="fw-bold" style={{ color: "#6a0572" }}>Civic Pulse</span>
        </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav gap-2">
              <li className="nav-item">
                <a className="nav-link" href="#features" style={{ color: "#6a0572" }}>Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#carousel" style={{ color: "#6a0572" }}>Gallery</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#stats" style={{ color: "#6a0572" }}>Stats</a>
              </li>
              <li className="nav-item">
                <Link className="btn btn-sm px-3" to="/report" style={{
                  backgroundColor: "#f77f00",
                  color: "#fff",
                  borderRadius: "50px"
                }}>
                  Report
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-sm px-3" to="/dashboard" style={{
                  backgroundColor: "#6a0572",
                  color: "#fff",
                  borderRadius: "50px"
                }}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-sm px-3" to="/signup" style={{
                  backgroundColor: "#00b4d8",
                  color: "#fff",
                  borderRadius: "50px"
                }}>
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 text-center" style={{ backgroundColor:"primary" }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3" style={{ color: "#345d7e" }}>
            Empowering Citizens to Improve Our City
          </h1>
          <p className="lead" style={{ color: "#555", maxWidth: "700px", margin: "0 auto" }}>
            Report civic issues with ease, track their resolution, and collaborate with your community to build a cleaner, safer, and smarter city.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="container py-5" id="features">
        <h2 className="text-center mb-5" style={{ color: "#4a4e69" }}>How It Works</h2>
        <div className="row text-center">
          {/* Feature Cards */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm" style={{ borderColor: "#ffb5a7", backgroundColor: "#fff0f3" }}>
              <div className="card-body">
                <div className="fs-1 mb-3" style={{ color: "#f77f00" }}>📝</div>
                <h5 style={{ color: "#6a0572" }}>Report Issue</h5>
                <p style={{ color: "#333" }}>Submit detailed reports about civic problems in your neighborhood.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm" style={{ borderColor: "#9bf6ff", backgroundColor: "#e0f7fa" }}>
              <div className="card-body">
                <div className="fs-1 mb-3" style={{ color: "#00b4d8" }}>🔍</div>
                <h5 style={{ color: "#0077b6" }}>Track Progress</h5>
                <p style={{ color: "#333" }}>Monitor the status of reported issues in real time.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm" style={{ borderColor: "#caf0f8", backgroundColor: "#e8f6f8" }}>
              <div className="card-body">
                <div className="fs-1 mb-3" style={{ color: "#007f5f" }}>🤝</div>
                <h5 style={{ color: "#2d6a4f" }}>Community Help</h5>
                <p style={{ color: "#333" }}>Join hands with fellow citizens to make your city better.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section ref={carouselRef} className="py-5" style={{ backgroundColor: "#f9f7f7" }} id="carousel">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#4a4e69" }}>Community in Action</h2>
          <div id="civicCarousel" className="carousel slide shadow rounded" data-bs-ride="carousel">
            <div className="carousel-inner rounded">
              <div className="carousel-item active">
                <img src="/login.png" className="d-block w-100" alt="City streets"
                  style={{ height: "400px", objectFit: "cover", borderRadius: '8px' }} />
                <div className="carousel-caption d-none d-md-block text-dark bg-white bg-opacity-75 rounded p-3 shadow">
                  <h5>City Streets</h5>
                  <p>Clean and safe neighborhoods start with you.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1529257414771-1960ee52dfec?auto=format&fit=crop&w=800&q=80"
                  className="d-block w-100" alt="Community volunteering"
                  style={{ height: "400px", objectFit: "cover", borderRadius: '8px' }} />
                <div className="carousel-caption d-none d-md-block text-dark bg-white bg-opacity-75 rounded p-3 shadow">
                  <h5>Community Volunteering</h5>
                  <p>Together we can make a difference.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
                  className="d-block w-100" alt="City park cleanup"
                  style={{ height: "400px", objectFit: "cover", borderRadius: '8px' }} />
                <div className="carousel-caption d-none d-md-block text-dark bg-white bg-opacity-75 rounded p-3 shadow">
                  <h5>Park Cleanup</h5>
                  <p>Helping green spaces thrive.</p>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#civicCarousel" data-bs-slide="prev" style={{ filter: "invert(40%)" }}>
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#civicCarousel" data-bs-slide="next" style={{ filter: "invert(40%)" }}>
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-5" style={{ backgroundColor: "#e7f6f2" }} id="stats">
        <div className="container text-center">
          <h2 className="mb-4" style={{ color: "#345d7e" }}>Community Impact</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="p-4 rounded shadow" style={{ backgroundColor: "#ffc9de", color: "#6a0572" }}>
                <h3 className="display-4">120</h3>
                <p className="lead">Issues Reported</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="p-4 rounded shadow" style={{ backgroundColor: "#90e0ef", color: "#0077b6" }}>
                <h3 className="display-4">85</h3>
                <p className="lead">Issues Resolved</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="p-4 rounded shadow" style={{ backgroundColor: "#b7e4c7", color: "#2d6a4f" }}>
                <h3 className="display-4">45</h3>
                <p className="lead">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white pt-5 pb-4" style={{ backgroundColor: "#345d7e" }}>
        <div className="container text-md-left">
          <div className="row text-md-left">
            <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Civic Pulse</h5>
              <p>
                Civic Pulse is a citizen engagement platform that empowers you to report civic issues, monitor their resolution, and be part of a transparent governance ecosystem.
              </p>
            </div>
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Quick Links</h5>
              <p><Link to="/" className="text-white text-decoration-none">Home</Link></p>
              <p><Link to="/report" className="text-white text-decoration-none">Report Issue</Link></p>
              <p><Link to="/dashboard" className="text-white text-decoration-none">Dashboard</Link></p>
              <p><Link to="/signup" className="text-white text-decoration-none">Sign Up</Link></p>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Contact</h5>
              <p><i className="bi bi-house-fill me-2"></i> 123 Civic Lane, Hyderabad, India</p>
              <p><i className="bi bi-envelope-fill me-2"></i> contact@civicpulse.com</p>
              <p><i className="bi bi-phone-fill me-2"></i> +91 9876543210</p>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Follow Us</h5>
              <a href="#" className="text-white me-3 fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
          <hr className="my-3" />
          <div className="row d-flex justify-content-center">
            <div className="col-md-7 col-lg-8">
              <p className="text-center">
                © 2025 <strong>Civic Pulse</strong>. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
