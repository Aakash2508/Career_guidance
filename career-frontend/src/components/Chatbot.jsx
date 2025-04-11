import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, Button, Form, ListGroup, InputGroup } from "react-bootstrap";
import { Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import icon from "../assets/question-icon.png";
import "../styles/layout.css"
const Chatbot = () => {
    const [show, setShow] = useState(false);
    const messagesEndRef = useRef(null);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
      { role: "bot", content: "👋 Hi there! I'm your Career Assistant." },
      { role: "bot", content: "💡 Ask me anything about career paths, subjects or mentorship!" },
      { role: "bot", content: "📘 Example: 'What careers are best if I like math?'" },
    ]);
    const toggleChat = () => setShow(!show);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
    
        // Add the user message first
        const userMessage = { role: "user", content: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
    
        try {
            // Send request to backend
            const response = await axios.post("http://localhost:5007/ask", {
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
    

    return (
        <>
            {/* Floating Chat Icon */}
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

            {/* Chat Window */}
            <Modal
    show={show}
    onHide={toggleChat}
    centered
    size="lg"
    dialogClassName="custom-modal" // Added custom class here
>

            
                <Modal.Header closeButton>
                    <Modal.Title>Career Guidance Chatbot</Modal.Title>
                </Modal.Header>

                {/* Chat Body */}
                <Modal.Body
                    className="p-3 bg-light"
                    style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                    }}
                >
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
                                display: "inline-block", // Dynamic width
                                maxWidth: "75%", // Restrict to 75% of modal width
                                alignSelf: msg.role === "user" ? "flex-end" : "flex-start", // Proper alignment
                                wordWrap: "break-word",
                            }}
                        >
                            <div>{msg.content}</div>
                        </ListGroup.Item>
                        
                    
                        ))}
                        <div ref={messagesEndRef}></div>
                    </ListGroup>
                </Modal.Body>

                {/* Input Section */}
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
        </>
    );
};

export default Chatbot;
