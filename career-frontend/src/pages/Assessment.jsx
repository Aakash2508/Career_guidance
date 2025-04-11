import React, { useEffect, useState } from "react";
import { Button, Spinner, Alert, Container, Card, Row, Col, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/hover.css";
import axios from "axios";
const PsychometricTest = () => {
  const [student, setStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formCompleted, setFormCompleted] = useState(false);
  const [error, setError] = useState("");
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [timer, setTimer] = useState(15);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [plainTextReport, setPlainTextReport] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const navigate = useNavigate();

  // Load student from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setStudent(userData);
    } else {
      console.error("User not found in localStorage");
    }
  }, []);

  // Fetch profile details
  useEffect(() => {
    const fetchStudentData = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return;

      try {
        const response = await fetch(`http://localhost:5000/api/user-details/${userData.id}`);
        const data = await response.json();

        if (
          data.details?.dob &&
          data.details.grade &&
          data.details.school_board &&
          data.details.school_name &&
          data.details.career_interest?.length &&
          data.details.subject_interest?.length
        ) {
          setStudentDetails(data.details);
          setFormCompleted(true);
          setAssessmentStarted(true); // Automatically start if ready
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (assessmentStarted && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && questions.length === 0) {
      generateQuestions();
    }
  }, [timer, assessmentStarted]);

  // Generate questions
  const generateQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/generate-psychometric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob: studentDetails.dob }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
      } else {
        setError(data.error || "Failed to generate questions.");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Something went wrong while generating questions.");
    }
  };

  // Answer handler
  const handleAnswer = (answer) => {
    const category = questions[currentCategoryIndex].category;
    const currentQ = questions[currentCategoryIndex].questions[currentQuestionIndex];

    setResponses((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), { question: currentQ.question, answer }],
    }));

    const totalQuestions = questions[currentCategoryIndex].questions.length;

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex + 1 < questions.length) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setAssessmentComplete(true);
    }
  };

  // Analyze responses
  useEffect(() => {
    const analyzeResponses = async () => {
      if (!assessmentComplete || !responses || !student) return;
  
      setAnalysisLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/analyze-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            responses,
            user_id: student.id,
            email: student.email,
          }),
        });
  
        const data = await res.json();
  
        if (data.report) {
          setAnalysis(data.report);
          setPlainTextReport(data.plainTextReport);
  
          // 💾 SAVE TO DATABASE
          await savePsychometricResults(student.id, data.report);
        } else {
          setAnalysisError("Analysis failed to load.");
        }
      } catch (err) {
        console.error("Error analyzing:", err);
        setAnalysisError("Something went wrong during analysis.");
      } finally {
        setAnalysisLoading(false);
      }
    };
  
    analyzeResponses();
  }, [assessmentComplete]);
  

  const savePsychometricResults = async (userId, analysisResults) => {
    try {
      const res = await axios.post("http://localhost:5000/api/save-psychometric-results", {
        user_id: userId,
        analysis: analysisResults
      });
  
      if (res.data.success) {
        console.log("Saved successfully:", res.data.user);
        // You could update frontend state or redirect the user here
      } else {
        console.error("Save failed:", res.data.error);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (loading) return <Spinner animation="border" />;
  return (
    <Container className="mt-5">
      {/* Always show student info */}
      <Card className="mb-4 p-3 shadow-sm">
        <Row>
          <Col md={4}><strong>Name:</strong></Col>
          <Col md={8}>{student?.fullName}</Col>
        </Row>
        <Row>
          <Col md={4}><strong>Email:</strong></Col>
          <Col md={8}>{student?.email}</Col>
        </Row>
        <Row>
          <Col md={4}><strong>Role:</strong></Col>
          <Col md={8}>{student?.role}</Col>
        </Row>
      </Card><br/><br/>

      {!formCompleted && (
        <Alert variant="warning">Please complete your profile to begin the assessment.</Alert>
      )}

{assessmentStarted && timer > 0 && (
  <Card className="text-center p-4 shadow">
    <h4>Assessment begins in...</h4>
    <h1 className="display-1 text-info">{timer}</h1>

    {loading && (
      <>
        <div className="mt-4" style={{marginTop:"60px"}}>
          <Spinner animation="border" variant="secondary" />
        </div>
        <p className="mt-2 text-muted">Generating your personalized questions...</p>
      </>
    )}
  </Card>
)}

{assessmentStarted && timer === 0 && !assessmentComplete && questions.length > 0 && (
        <Card className="p-4 shadow-lg">
          <h2 className="text-capitalize mb-3 text-info">Category: {questions[currentCategoryIndex].category}</h2><br/>
          <h3><strong>Q{currentQuestionIndex + 1}:</strong> {questions[currentCategoryIndex].questions[currentQuestionIndex].question}</h3><br/><br/>
          {questions[currentCategoryIndex].questions[currentQuestionIndex].options.map((option, idx) => (
              <Button
              key={idx}
              variant="outline-info"
              className="d-block mb-2 py-4 text-info option-button"
              style={{ fontSize: "24px", letterSpacing: "0.7px" }}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
          <ProgressBar variant="info"
            now={((currentQuestionIndex +1 ) / questions[currentCategoryIndex].questions.length) * 100}
            className="mt-3"
          />
        </Card>
      )}


      {assessmentComplete && (
        <Card className="p-4 shadow-lg">
          <h3 className="mb-4 text-success text-center">Assessment Complete!</h3>

          <h4 className="mb-3 text-info">🧠 Gen AI based Category-wise Analysis</h4>

          {analysisLoading ? (
            <Spinner animation="border" />
          ) : analysisError ? (
            <Alert variant="danger">{analysisError}</Alert>
          ) : (
            <>
              {analysis.map((item, idx) => (
                <Card key={idx} className="mb-3 p-3 border-info">
                  <h5 className="text-capitalize">{item.category}</h5>
                  {/* <p><strong>Score:</strong> {item.score}/100</p> */}
                  <p><strong>Insight:</strong> {item.description}</p>
                </Card>
              ))}
              <Button
                variant="outline-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(plainTextReport);
                  alert("Report copied to clipboard!");
                }}
              >
                Copy Full Report
              </Button>
            </>
          )}

          <div className="text-center mt-4">
            <Button variant="success" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default PsychometricTest;
