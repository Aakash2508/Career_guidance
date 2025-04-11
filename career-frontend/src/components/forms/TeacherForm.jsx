import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

function TeacherForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subjectsTaught: "",
    schoolName: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/teacher-details", {
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
      <h2>Teacher Details</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" name="fullName" onChange={handleChange} required />
        </Form.Group>

        <Button className="mt-4" type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default TeacherForm;
