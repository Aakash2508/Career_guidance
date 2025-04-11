import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function StudentForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    educationLevel: "",
    schoolName: "",
    careerInterest: "",
    subjectInterest: "",
    skills: "",
    extracurricular: "",
    previousAssessment: "No",
    parentContact: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/student-details", {
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
      <h2>Student Details</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="fullName" onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" onChange={handleChange}>
                <option>Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Education Level</Form.Label>
              <Form.Control type="text" name="educationLevel" onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>School Name</Form.Label>
              <Form.Control type="text" name="schoolName" onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Career Interest</Form.Label>
              <Form.Control type="text" name="careerInterest" onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Subject Interest</Form.Label>
              <Form.Control type="text" name="subjectInterest" onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Skills & Hobbies</Form.Label>
              <Form.Control type="text" name="skills" onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Button className="mt-4" type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default StudentForm;
