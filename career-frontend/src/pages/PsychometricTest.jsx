import React, { useEffect, useState } from "react";
import {
  Button,
  Spinner,
  Alert,
  Container,
  Card,
  Row,
  Col,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "rc-slider";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import "rc-slider/assets/index.css";
import "../styles/hover.css";

const modules = [
  "Personality",
  "Cognitive",
  "Interests",
  "Emotional Intelligence",
  "Problem Solving",
  "Decision Making",
  "Leadership",
  "Stress Management",
  "Risk Taking",
  "Adaptability",
  "Subject Interest 1",
  "Subject Interest 2",
  "Career Interest 1",
  "Career Interest 2",
  "Soft Skills",
];

const colorScale = [
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#e67e22",
  "#e74c3c",
  "#1abc9c",
];

const PsychometricTest = () => {
  const [student, setStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formCompleted, setFormCompleted] = useState(false);
  const [error, setError] = useState("");
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [timer, setTimer] = useState(60 * 60);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [moduleScores, setModuleScores] = useState([]);
  const [moduleAnalysis, setModuleAnalysis] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setStudent(userData);
    } else {
      console.error("User not found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/user-details/${userData.id}`
        );
        const data = await response.json();

        if (
          data.details?.dob &&
          data.details.grade &&
          data.details.school_board &&
          data.details.school_name &&
          data.details.career_interest?.length &&
          data.details.subject_interest?.length
        ) {
          setStudentDetails(data); // Save full response
          setFormCompleted(true);
          setAssessmentStarted(true);
          generateQuestions(modules[currentModuleIndex], data); // Pass full `data`
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

  useEffect(() => {
    if (assessmentStarted && timer > 0 && !assessmentComplete) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, assessmentStarted]);

  const generateQuestions = async (module, studentDetails) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/generate-psychometric-new",
        {
          module,
          userId: studentDetails?.details?.user_id,
        }
      );
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error("Error fetching questions:", err.response?.data || err.message);
      setError("Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  // const handleAnswer = async (answer) => {
  //   const currentQ = questions[currentQuestionIndex];
  //   const module = modules[currentModuleIndex];
  //   const updated = {
  //     ...responses,
  //     [module]: [
  //       ...(responses[module] || []),
  //       { question: currentQ.question, answer },
  //     ],
  //   };
  //   setResponses(updated);

  //   if (currentQuestionIndex + 1 < questions.length) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //   } else {
  //     await axios.post("http://localhost:5000/api/save-module", {
  //       module,
  //       responses: updated[module],
  //     });

  //     if (currentModuleIndex + 1 < modules.length) {
  //       const nextIndex = currentModuleIndex + 1;
  //       setCurrentModuleIndex(nextIndex);
  //       setCurrentQuestionIndex(0);
  //       generateQuestions(modules[nextIndex], studentDetails);
  //     } else {
  //       try {
  //         const { data } = await axios.post(
  //           "http://localhost:5000/api/analyze-psychometric-results",
  //           {
  //             studentName: studentDetails?.user?.full_name,
  //             moduleScores: responses,
  //           }
  //         );

  //         const scores = data.analysis.map((item, idx) => ({
  //           module: item.module,
  //           score: item.score,
  //           color: colorScale[idx % colorScale.length],
  //           analysis: item.analysis,
  //         }));

  //         setModuleScores(scores);
  //         setModuleAnalysis(scores);
  //         setAssessmentComplete(true);
  //       } catch (err) {
  //         console.error("Error fetching psychometric analysis:", err);
  //       }
  //     }
  //   }
  // };


// 🔍 Analyze Psychometric Results
const analyzeResults = async (studentName, userId, moduleScores) => {
  if (!studentName || !userId || !Array.isArray(moduleScores) || moduleScores.length === 0) {
    console.error("Missing or invalid data for analysis", { studentName, userId, moduleScores });
    throw new Error("Invalid input for analysis");
  }

  try {
    const res = await axios.post("http://localhost:5000/api/analyze-psychometric-results", {
      studentName,
      userId,
      moduleScores
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching psychometric analysis:", err.response?.data || err.message);
    throw new Error("Failed to generate psychometric report");
  }
};

// ✅ Handle Answers and Transition
const handleAnswer = async (answer) => {
  const currentQ = questions[currentQuestionIndex];
  const module = modules[currentModuleIndex];
  const updated = {
    ...responses,
    [module]: [
      ...(responses[module] || []),
      { question: currentQ.question, answer },
    ],
  };
  setResponses(updated);

  if (currentQuestionIndex + 1 < questions.length) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  } else {
    await axios.post("http://localhost:5000/api/save-module", {
      module,
      responses: updated[module],
    });

    if (currentModuleIndex + 1 < modules.length) {
      const nextIndex = currentModuleIndex + 1;
      setCurrentModuleIndex(nextIndex);
      setCurrentQuestionIndex(0);
      generateQuestions(modules[nextIndex], studentDetails);
    } else {
      try {
        const moduleScoresArray = Object.entries(updated).map(([mod, res]) => ({
          module: mod,
          score: Math.floor((res.length / 10) * 100), // adjust scoring logic if needed
        }));

        const data = await analyzeResults(
          studentDetails?.user?.full_name,
          studentDetails?.details?.user_id,
          moduleScoresArray
        );

        const scores = data.categories.map((item, idx) => ({
          module: item.module,
          score: item.score,
          color: colorScale[idx % colorScale.length],
          analysis: item.analysis,
        }));

        setModuleScores(scores);
        setModuleAnalysis(scores);
        setAssessmentComplete(true);
      } catch (err) {
        console.error("Error fetching psychometric analysis:", err);
      }
    }
  }
};

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100
  );

  if (loading) return <Spinner animation="border" />;

  return (
    <Container fluid className="mt-4">
       <Card className="mt-3 shadow-sm">
  <Card.Body>
    <h6>User Details:</h6>
    <div className="row">
      <div className="col-md-6">
        <p><strong>Name:</strong> {studentDetails?.user?.full_name}</p>
        <p><strong>Email:</strong> {studentDetails?.user?.email}</p>
        <p><strong>Role:</strong> {studentDetails?.user?.role}</p>
        <p><strong>Grade:</strong> {studentDetails?.details?.grade}</p>
      </div>
      <div className="col-md-6">
        <p><strong>School:</strong> {studentDetails?.details?.school_name}</p>
        <p><strong>Career Interests:</strong> {studentDetails?.details?.career_interest?.join(", ")}</p>
        <p><strong>Subject Interests:</strong> {studentDetails?.details?.subject_interest?.join(", ")}</p>
      </div>
    </div>
  </Card.Body>
</Card>

      <Row>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              Module Progress
            </Card.Header>
            <ListGroup variant="flush">
              {modules.map((mod, idx) => (
                <ListGroup.Item
                  key={mod}
                  className={idx === currentModuleIndex ? "fw-bold text-info" : ""}
                >
                  {mod}{" "}
                  {idx < currentModuleIndex
                    ? "✅"
                    : idx === currentModuleIndex
                    ? "🟢"
                    : "🔒"}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={9}>
          {!formCompleted && (
            <Alert variant="warning">
              Please complete your profile to begin the assessment.
            </Alert>
          )}

          {assessmentStarted &&
            !assessmentComplete &&
            questions.length > 0 && (
              <Card className="p-4 shadow-lg">
                <h5 className="text-muted text-end">
                  Time Left: {formatTime(timer)}
                </h5>
                <h4 className="mb-3 text-info">
                  Module: {modules[currentModuleIndex]}
                </h4>
                <h5>
                  <strong>Q{currentQuestionIndex + 1}:</strong>{" "}
                  {questions[currentQuestionIndex]?.question}
                </h5>
                <div className="mt-4">
                  {questions[currentQuestionIndex]?.options.map((option, i) => (
                    <Button
                      key={i}
                      variant="outline-info"
                      className="mb-3 d-block w-100"
                      onClick={() => handleAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <ProgressBar now={progressPercent} className="mt-3" />
              </Card>
            )}

          {assessmentComplete && (
            <Card className="p-4 shadow-lg">
              <h3 className="mb-4 text-success text-center">
                Assessment Complete!
              </h3>
              <h5 className="text-info text-center">
                AI-Based Psychometric Summary
              </h5>

              {moduleAnalysis.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <h6 className="mb-2">{item.module}</h6>
                  <Slider
                    value={item.score}
                    disabled
                    trackStyle={{ backgroundColor: item.color, height: 10 }}
                    handleStyle={{
                      borderColor: item.color,
                      height: 24,
                      width: 24,
                    }}
                    railStyle={{ height: 10 }}
                  />
                  <p className="text-muted mt-1">
                    <strong>Score:</strong> {item.score}%
                  </p>
                  <p className="text-secondary">
                    <strong>Analysis:</strong> {item.analysis}
                  </p>
                </div>
              ))}

              <h5 className="text-center mt-4 mb-3">
                Overall Personality Profile
              </h5>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={moduleScores}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="module" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Student"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>

              <div className="text-center mt-4">
                <Button variant="success" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PsychometricTest;
