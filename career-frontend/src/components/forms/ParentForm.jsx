import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

function ParentForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    relation: "",
    occupation: "",
    education: "",
    careerExpectations: "",
    concerns: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/parent-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Details submitted successfully!");
    } else {
      alert("Error submitting details.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Parent Details</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" name="fullName" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" name="phone" onChange={handleChange} required />
        </Form.Group>

        <Button className="mt-4" type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default ParentForm;
