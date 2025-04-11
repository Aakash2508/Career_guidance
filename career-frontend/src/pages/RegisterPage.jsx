import React, { useState } from "react";
import { Container, Form, Button, Alert,Row,Col,Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash, ArrowLeft } from "react-bootstrap-icons";
const RegisterPage = () => {
  const [user, setUser] = useState({ fullName: "", email: "", role: "student", otp: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const requestOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/request-otp", { email: user.email });
      setOtpSent(true);
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Error sending OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { email: user.email, otp: user.otp });
      if (res.data.success) {
        setVerified(true);
        setMessage(res.data.message);
      }
    } catch (error) {
      setMessage("OTP Verification failed.");
    }
  };

  const registerUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/register", user);
      setRegistered(true);
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage("Registration failed.");
    }
  };


  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4"  style={{
    background: "linear-gradient(135deg, #088395, #37B7C3)",
    color: "#ffffff", // Ensure text is readable
    borderRadius: "16px"
  }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Register</h2>
                <Button variant="outline-light" style={{borderColor:"White"}} size="sm" onClick={() => navigate("/")}>
                  ← Back
                </Button>
              </div>

              {message && <Alert variant="info">{message}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    onChange={handleChange}
                    required
                    disabled={otpSent}
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                    disabled={otpSent}
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" onChange={handleChange} disabled={otpSent}>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                  </Form.Select>
                </Form.Group>

                {!otpSent ? (
                  <Button
                    variant="outline-light text-dark"
                    className="w-100 fw-semibold text-light"
                    onClick={requestOtp}
                  >
                    Request OTP
                  </Button>
                ) : (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label>Enter OTP</Form.Label>
                      <Form.Control
                        type="text"
                        name="otp"
                        onChange={handleChange}
                        required
                        disabled={verified}
                        placeholder="Enter the OTP sent to your email"
                      />
                    </Form.Group>

                    {!verified ? (
                      <Button variant="warning" className="w-100 mt-3 fw-semibold" onClick={verifyOtp}>
                        Verify OTP
                      </Button>
                    ) : (
                      <>
                        <Form.Group className="mt-3">
                          <Form.Label>Set Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            onChange={handleChange}
                            required
                            disabled={registered}
                            placeholder="Create your password"
                          />
                        </Form.Group>
                        <Button
                          variant="success"
                          className="w-100 mt-3 fw-semibold"
                          onClick={registerUser}
                          disabled={registered}
                        >
                          Register
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
