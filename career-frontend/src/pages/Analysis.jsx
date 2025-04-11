import React, { useEffect, useState } from "react";
import { Card, Spinner, Container, Row, Col } from "react-bootstrap";

const SelfDiscoveryAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentAnalysis = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        console.error("User data not found in localStorage");
        setLoading(false);
        return;
      }

      setUser(userData);

      try {
        const response = await fetch(`http://localhost:5000/api/self-discovery/${userData.id}`);
        const result = await response.json();

        if (response.ok) {
          setAnalysis(result.data);
        } else {
          console.error("Failed to fetch analysis");
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAnalysis();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  if (!analysis) {
    return <p className="text-danger mt-4 text-center">No analysis found for this user.</p>;
  }

  return (
    <Container className="mt-4">
      {/* Student Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>👤 Student Information</Card.Title>
          <p><strong>Name:</strong> {user?.fullName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </Card.Body>
      </Card>

      {/* Analysis Cards in 2x2 Grid */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header>🧠 Self-Awareness</Card.Header>
            <Card.Body>
              {/* <p><strong>Score:</strong> {analysis.self_awareness_score}</p> */}
              <p>{analysis.self_awareness_insight}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header>📘 Learning Style</Card.Header>
            <Card.Body>
              {/* <p><strong>Score:</strong> {analysis.learning_style_score}</p> */}
              <p>{analysis.learning_style_insight}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header>🎯 Career Interest</Card.Header>
            <Card.Body>
              {/* <p><strong>Score:</strong> {analysis.career_interest_score}</p> */}
              <p>{analysis.career_interest_insight}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header>📚 Subject Preference</Card.Header>
            <Card.Body>
              {/* <p><strong>Score:</strong> {analysis.subject_preference_score}</p> */}
              <p>{analysis.subject_preference_insight}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <div className="text-muted text-end mt-2">
        Last updated: {new Date(analysis.created_at).toLocaleString()}
      </div>
    </Container>
  );
};

export default SelfDiscoveryAnalysis;
