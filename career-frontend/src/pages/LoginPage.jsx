import React, { useState } from "react";
import { Container, Form, Button, Alert,Card,Row,Col, } from "react-bootstrap";
import axios from "axios";
//import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { EnvelopeFill, LockFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const loginUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage("Login failed.");
    }
  };

  return (
    <Container className="py-5">
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <Card className="shadow-lg border-0">
          <Card.Body
            className="p-4"
            style={{
              background: "linear-gradient(135deg, #088395, #37B7C3)",
              color: "#ffffff",
              borderRadius: "16px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Login</h2>
              <Button
                variant="outline-light"
                style={{ borderColor: "White" }}
                size="sm"
                onClick={() => navigate("/")}
              >
                ← Back
              </Button>
            </div>
  
            {message && <Alert variant="light">{message}</Alert>}
  
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
  
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Remember Me" />
                <a href="#" className="text-white small text-decoration-underline">
                  Forgot Password?
                </a>
              </div>
  
              <Button
                variant="light"
                className="w-100 fw-semibold text-dark"
                onClick={loginUser}
              >
                Login
              </Button>
            </Form>
  
            <div className="text-center mt-4">
              <small className="text-white">
                Don’t have an account?{" "}
                <a href="/register" className="text-decoration-underline text-light">
                  Register here
                </a>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
    );
};

export default LoginPage;
