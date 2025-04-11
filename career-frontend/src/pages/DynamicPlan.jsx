import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Form,
  Card,
  Row,
  Col,
  Badge,
  InputGroup
} from "react-bootstrap";

const SUBJECTS = [
  "Math", "Physics", "Chemistry", "Biology", "Computer Science", "Economics",
  "Commerce", "Accounts", "History", "Geography", "Political Science", "English"
];

function DynamicPlan() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [careerPlans, setCareerPlans] = useState([]);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSubject = inputValue.trim();
      if (
        newSubject &&
        !selectedSubjects.includes(newSubject) &&
        SUBJECTS.includes(newSubject)
      ) {
        setSelectedSubjects([...selectedSubjects, newSubject]);
        setInputValue("");
      }
    }
  };

  const removeSubject = (subject) => {
    setSelectedSubjects(selectedSubjects.filter((subj) => subj !== subject));
  };

  const generatePlan = async () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:5000/api/generate-dynamic-career-plan", {
        subjects: selectedSubjects,
      });
  
      const careers = res.data.careers || res.data;
      setCareerPlans(Array.isArray(careers) ? careers : []);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert("Something went wrong while generating your plan.");
    }
  };
  

  return (
    <Container className="mt-5">
      <h2 className="mb-3 text-center text-primary">🎯 AI-Based Career Plan Generator</h2>
      <p className="text-muted text-center mb-4">
  Select or enter your core subjects. Based on your input, our AI will suggest career paths, salary insights, required exams, top employers, and more.
</p>

      <Form>
      <Form.Group>
  <Form.Label><strong>Enter Your Core Subjects (press Enter after each):</strong></Form.Label>
  <Form.Control
    type="text"
    placeholder="Start typing subjects..."
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = e.target.value.trim();
        if (value && !selectedSubjects.includes(value)) {
          setSelectedSubjects([...selectedSubjects, value]);
        }
        e.target.value = "";
      }
    }}
  />
  <div className="mt-2">
    {selectedSubjects.map((subject, index) => (
      <Button
        key={index}
        variant="outline-primary"
        className="me-2 mb-2"
        onClick={() =>
          setSelectedSubjects(selectedSubjects.filter((_, i) => i !== index))
        }
      >
        {subject} &times;
      </Button>
    ))}
  </div>
</Form.Group>

<div className="d-flex justify-content-center">
  <Button className="mt-3 mb-4 px-4 py-2" onClick={generatePlan}>
    🎓 Generate Career Plan
  </Button>
</div>

      </Form>

      <Row className="mt-5">
        {Array.isArray(careerPlans) &&
          careerPlans.map((career, index) => (
            <Col md={12} lg={6} key={index} className="mb-4">
              <Card className="shadow-sm rounded p-4 border-0" style={{ minHeight: "400px" }}>
                <Card.Body>
                  <Card.Title className="text-primary fs-4 mb-3">{career.career}</Card.Title>

                  <Card.Text><strong>Why:</strong> {career.reason}</Card.Text>
                  <Card.Text><strong>Average Salary:</strong> {career.salary}</Card.Text>
                  <Card.Text><strong>Course Eligibility:</strong> {career.exam_eligibility}</Card.Text>

                  <div>
  <strong>Entrance Exams:</strong>
  <ul>
    {career.entrance_exams?.map((exam, i) => (
      <li key={i}>{exam}</li>
    ))}
  </ul>
</div>


                  <Card.Text>
                    <strong>Top Companies:</strong>
                    <ul>{career.companies?.map((company, i) => <li key={i}>{company}</li>)}</ul>
                  </Card.Text>

                  <Card.Text>
                    <strong>Job Roles:</strong>
                    <ul>{career.roles?.map((role, i) => <li key={i}>{role}</li>)}</ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default DynamicPlan;
