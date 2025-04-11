import React, { useState, useEffect, useRef } from "react";
import { Card, Nav,Modal, Form, ListGroup, InputGroup,Dropdown,Row,Col,Container, Button, Navbar, } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Map, Robot, BarChartSteps, HouseDoor, InfoCircle, StarFill, Envelope } from "react-bootstrap-icons";
import axios from "axios";
import { Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import icon from "./assets/question-icon.png";
import "./styles/layout.css"
import bot from "./assets/chat.png";

const Sidebar = ({ children }) => {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const toggleChat = () => setShow(!show);
  const [input, setInput] = useState("");
  const navItems = [
    { label: "Home", path: "/", icon: <HouseDoor size={22} /> },
    { label: "Roadmap", path: "/roadmap", icon: <Map size={22} /> },
    { label: "Dynamic Career Plan", path: "/dynamic-career-plan", icon: <BarChartSteps size={22} /> },
    { label: "Chatbot", path: "/bot", icon: <Robot size={22} /> }
  ];
  const messagesEndRef = useRef(null);
        const [messages, setMessages] = useState([
          { role: "bot", content: "👋 Hi there! I'm your Career Assistant." },
          { role: "bot", content: "💡 Ask me anything about career paths, subjects or mentorship!" },
          { role: "bot", content: "📘 Example: 'What careers are best if I like math?'" },
        ]);

        const sendMessage = async () => {
            if (!input.trim()) return;
        
            // Add the user message first
            const userMessage = { role: "user", content: input };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
        
            try {
                // Send request to backend
                const response = await axios.post("http://localhost:5000/api/ask", {
                    message: input,
                });
        
                // Add bot response after receiving API response
                const botMessage = {
                    role: "bot",
                    content: response.data.response,
                };
        
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error("Chatbot Error:", error);
        
                // Add error message if something goes wrong
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "bot", content: "Error: Could not get a response." },
                ]);
            }
        
            // Clear input after sending
            setInput("");
        };

return(
<div className="d-flex flex-column min-vh-100" style={{ width: "100vw", backgroundColor: "#EBF4F6" }}>
        {/* Header */}
        <Navbar
        fixed="top"
          expand="lg"
          style={{
            //background: "linear-gradient(90deg, #262262 0%, #1b75bc 80%)",
             background: "white",
             boxShadow:'20px 15px 5px ',
            height: "90px", // Increased height
            zIndex: 1050,
          }}
          variant="dark"
          className="shadow-sm"
        >
         <Container fluid>
      <Navbar.Brand as={Link} to="/" className="fw-bold fs-2 me-auto" style={{color:"#1f89a1"}}>
        Career Guidance Application
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {/* <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto gap-3 align-items-center">
          <Nav.Link as={Link} to="/login" className="fw-semibold fs-5" style={{color:"#1f89a1"}}>Login</Nav.Link>
          <Nav.Link as={Link} to="/register" className="fw-semibold fs-5" style={{color:"#1f89a1"}}>Register</Nav.Link>

          
          <div className="position-relative" ref={dropdownRef}>
            <Button
              style={{backgroundColor:"#1f89a1"}}
              // variant={"1f89a1"}
              className="fw-semibold fs-5"
              onClick={() => setShowFeatures(!showFeatures)}
            >
              Features
            </Button>

            {showFeatures && (
              <div className="dropdown-menu p-4 shadow-lg border-0 rounded-4 show" style={{
                display: "block",
                minWidth: "700px",
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 1000
              }}>
                <Row className="g-4">
                  <Col md={6}>
                    <Card as={Link} to="/features#student" className="text-decoration-none h-100 hover-shadow">
                      <Card.Body>
                        <Card.Title className="text-primary fs-5">🎓 Student Dashboard</Card.Title>
                        <Card.Text className="text-muted fs-6">
                          Personalized assessments, career suggestions, and mentorship tools crafted for school and college students.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card as={Link} to="/features#parent" className="text-decoration-none h-100 hover-shadow">
                      <Card.Body>
                        <Card.Title className="text-warning fs-5">👨‍👩‍👧‍👦 Parent Portal</Card.Title>
                        <Card.Text className="text-muted fs-6">
                          Monitor your child’s career journey, provide insights, and support their decision-making.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card as={Link} to="/features#teacher" className="text-decoration-none h-100 hover-shadow">
                      <Card.Body>
                        <Card.Title className="text-success fs-5">👩‍🏫 Teacher Panel</Card.Title>
                        <Card.Text className="text-muted fs-6">
                          Offer guidance, mentorship, and tools to help students grow academically and professionally.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card as={Link} to="http://localhost:5000/ask" className="text-decoration-none h-100 hover-shadow">
                      <Card.Body>
                        <Card.Title className="text-info fs-5">💬 AI Career Chatbot</Card.Title>
                        <Card.Text className="text-muted fs-6">
                          Get career advice and answers instantly from our intelligent assistant.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </div> 
        </Nav>
      </Navbar.Collapse> */}
    </Container>

        </Navbar>
    
        {/* Body */}
        <div className="d-flex flex-grow-1" style={{ minHeight: "calc(100vh - 80px - 70px)",marginTop:"30px" }}>
        <div className="d-flex" style={{ minHeight: "calc(100vh - 80px - 70px)", marginTop: "30px" }}>
  {/* Sidebar */}
  <div
      className="border-end"
      style={{
        width: "280px",
        height: "100vh",
        position: "fixed",
        marginTop:"80px",
        top: 0,
        left: 0,
        padding: "20px 15px",
        backgroundColor: "#EBF4F6",
        overflowY: "auto",
        zIndex: 1020
      }}
    >
      <Card
        className="shadow-sm"
        style={{ borderRadius: "16px", border: "none" }}
      >
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold">Quick Links</Card.Title>
          <Nav className="flex-column gap-3">
            {navItems.map((item, idx) => (
              <Nav.Link
                as={Link}
                key={idx}
                to={item.path}
                className={`d-flex align-items-center gap-2 fw-semibold ${
                  location.pathname === item.path ? "text-primary" : ""
                }`}
              >
                {item.icon} {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Card.Body>
      </Card>
    </div>

  {/* Main Content */}
  <div style={{ marginLeft: "280px", flex: 1 }}>

  </div>
</div>

    
          {/* Main Content */}
          <Container
            fluid
            className="p-5 d-flex flex-column justify-content-center align-items-center"
            style={{ flex: 1 }}
          >
            {children}
          </Container>
    
          {/* Chatbot Floating Icon */}
          <div
            className="position-fixed"
            onClick={toggleChat}
            style={{
              bottom: "20px",
              right: "20px",
              width: "60px",
              height: "60px",
              cursor: "pointer",
              borderRadius: "50%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              backgroundColor: "#007bff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <img src={icon} alt="Chat Icon" style={{ width: "35px", height: "35px" }} />
          </div>
    
          {/* Chat Modal */}
          <Modal show={show} onHide={toggleChat} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Career Guidance Chatbot</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3 bg-light" style={{ maxHeight: "500px", overflowY: "auto" }}>
              <ListGroup>
                {messages.map((msg, index) => (
                  <ListGroup.Item
                    key={index}
                    className="text-break mb-2 p-2"
                    style={{
                      backgroundColor: msg.role === "user" ? "#bff4ff" : "#a3d5ff",
                      textAlign: msg.role === "user" ? "right" : "left",
                      borderRadius: "12px",
                      marginBottom: "10px",
                      maxWidth: "75%",
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      wordWrap: "break-word",
                    }}
                  >
                    <div>{msg.content}</div>
                  </ListGroup.Item>
                ))}
                <div ref={messagesEndRef}></div>
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button variant="primary" onClick={sendMessage}>
                  <Send size={20} />
                </Button>
              </InputGroup>
            </Modal.Footer>
          </Modal>
    
          {/* Welcome Modal on Page Load */}
          {/* <Modal
  show={showWelcomeModal}
  onHide={() => setShowWelcomeModal(false)}
  centered
  size="lg"
  backdrop="static"
>
  <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>

  <Modal.Body className="p-0">
    <div
      style={{
        backgroundImage: `url(${bot})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "400px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          padding: "2rem",
          borderRadius: "12px",
          color: "white",
          textAlign: "center",
          maxWidth: "90%",
        }}
      >
        <h2 style={{ fontWeight: "bold", fontSize: "2rem" }}>👋 Welcome to Career Guidance App</h2>
        <p style={{ fontSize: "1.1rem" }}>
          Our AI-powered chatbot is here to guide you through career decisions.
        </p>
        <p>Ask questions, explore options, and receive expert advice — anytime!</p>
        <Button
          variant="light"
          size="lg"
          onClick={() => setShowWelcomeModal(false)}
          style={{
            marginTop: "1rem",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          Let’s Start
        </Button>
      </div>
    </div>
  </Modal.Body>
</Modal> */}

        </div>
    
        {/* Footer */}
        <footer
          className="text-white text-center py-4 shadow-sm"
          style={{ backgroundColor: "#1f89a1", height: "70px" }}
        >
          &copy; {new Date().getFullYear()} Career Guidance App. All Rights Reserved.
        </footer>
      </div>
    );
}
export default Sidebar;
