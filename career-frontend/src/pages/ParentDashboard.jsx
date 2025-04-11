import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Accordion,
  Form,
  Button,
  Alert,
  Row,
  Col,
  FloatingLabel,
  Stack,Tabs,Tab,InputGroup
} from "react-bootstrap";
import { XCircle } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";

const ParentDashboard = () => {
  const [user, setUser] = useState(null);
  
const [certInput, setCertInput] = useState('');
  const [parentDetails, setParentDetails] = useState(null);
  const [formCompleted, setFormCompleted] = useState(false);
  const [verifiedChild, setVerifiedChild] = useState(null);
  const navigate = useNavigate();

  // Input States
  const [dob, setDob] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [highestEducation, setHighestEducation] = useState("");
  const [industryExperience, setIndustryExperience] = useState("");
  const [careerConcerns, setCareerConcerns] = useState("");
  const [mentorshipInterest, setMentorshipInterest] = useState(false);
  const [connectWithParents, setConnectWithParents] = useState(false);
  const [careerPathInput, setCareerPathInput] = useState('');
  
  const [specialCertifications, setSpecialCertifications] = useState([]);
  const [preferredCareerPaths, setPreferredCareerPaths] = useState([]);

  // Fetch user data and child details
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      checkDetailsFilled(userData.id);
      fetchVerifiedChild(userData.id);
    }
  }, []);






  const handleAddCertification = () => {
    if (certInput.trim() !== '' && !specialCertifications.includes(certInput.trim())) {
      setSpecialCertifications([...specialCertifications, certInput.trim()]);
      setCertInput('');
    }
  };
  
  const handleAddCareerPath = () => {
    if (careerPathInput.trim() !== '' && !preferredCareerPaths.includes(careerPathInput.trim())) {
      setPreferredCareerPaths([...preferredCareerPaths, careerPathInput.trim()]);
      setCareerPathInput('');
    }
  };
  
  const removeCert = (index) => {
    const updated = [...specialCertifications];
    updated.splice(index, 1);
    setSpecialCertifications(updated);
  };
  
  const removeCareerPath = (index) => {
    const updated = [...preferredCareerPaths];
    updated.splice(index, 1);
    setPreferredCareerPaths(updated);
  };
  

  const checkDetailsFilled = async (user_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user-details/${user_id}`);
      const data = await response.json();
  
      console.log("Fetched Parent Details:", data); // 👈 Add this to debug
  
      if (response.ok && data.details) {
        setParentDetails(data.details); // 👈 Fix here: access .details
        setFormCompleted(true);
      } else {
        setFormCompleted(false);
      }
    } catch (error) {
      console.error("Error fetching parent details:", error);
      setFormCompleted(false);
    }
  };
  

  const fetchVerifiedChild = async (parentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-verified-child/${parentId}`);
      const data = await response.json();
      if (response.ok) {
        setVerifiedChild(data);
      }
    } catch (error) {
      console.error("Error fetching verified child details:", error);
    }
  };

  const handleSaveDetails = async () => {
    if (!dob || !occupation || !phoneNumber || !highestEducation) {
      alert("Please fill in all required fields.");
      return;
    }

    const newDetails = {
      userId: user?.id,
      dob,
      occupation,
      phone_number: phoneNumber,
      highest_education: highestEducation,
      industry_experience: industryExperience,
      career_concerns: careerConcerns,
      mentorship_interest: mentorshipInterest,
      connect_with_parents: connectWithParents,
    };

    try {
      const response = await fetch("http://localhost:5000/api/save-parent-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDetails),
      });

      if (response.ok) {
        alert("Details saved successfully!");
        checkDetailsFilled(user?.id);
      } else {
        alert("Error saving details.");
      }
    } catch (error) {
      console.error("Error saving details:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  //  // Icon for tag removal

return (
  <Container className="py-4">
    {/* 🔙 Back Button */}
    <Row className="mb-3">
      <Col>
        <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </Col>
    </Row>

    <Row className="align-items-center mb-4">
      <Col md={8}>
        <h2 className="fw-bold">Welcome, {user?.fullName}</h2>
        <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </Col>
      <Col md={4} className="text-md-end text-start mt-3 mt-md-0">
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </Col>
    </Row>

    {verifiedChild && (
      <Alert variant="info" className="rounded-3 shadow-sm">
        <h5 className="fw-semibold">Verified Child</h5>
        <p className="mb-1"><strong>Name:</strong> {verifiedChild.full_name}</p>
        <p><strong>Email:</strong> {verifiedChild.email}</p>
      </Alert>
    )}

    {/* Tabs: View / Edit Profile */}
    <Tabs defaultActiveKey="view" className="mb-4" fill>
      <Tab eventKey="view" title="View Profile">
        <Card className="p-4 shadow-sm border-0">
          <Card.Title className="mb-3 fs-4 fw-semibold">Profile Details</Card.Title>
          {formCompleted ? (
            <Stack gap={3}>
              <Row>
                <Col md={6}><strong>Date of Birth:</strong> {parentDetails?.dob}</Col>
                <Col md={6}><strong>Occupation:</strong> {parentDetails?.occupation}</Col>
              </Row>
              <Row>
                <Col md={6}><strong>Phone Number:</strong> {parentDetails?.phone_number}</Col>
                <Col md={6}><strong>Highest Education:</strong> {parentDetails?.highest_education}</Col>
              </Row>
              <Row>
                <Col md={6}><strong>Industry Experience:</strong> {parentDetails?.industry_experience}</Col>
              </Row>
              <Row>
                <Col><strong>Career Concerns:</strong> {parentDetails?.career_concerns}</Col>
              </Row>
              <Row>
                <Col><strong>Special Certifications:</strong>
                  <div className="d-flex flex-wrap mt-1">
                    {specialCertifications.map((cert, idx) => (
                      <span key={idx} className="badge bg-primary me-2 mb-2">
                        {cert}
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col><strong>Preferred Career Paths:</strong>
                  <div className="d-flex flex-wrap mt-1">
                    {preferredCareerPaths.map((path, idx) => (
                      <span key={idx} className="badge bg-success me-2 mb-2">
                        {path}
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <strong>Mentorship Interest:</strong> {parentDetails?.mentorship_interest ? "Yes" : "No"}
                </Col>
                <Col md={6}>
                  <strong>Connect with Other Parents:</strong> {parentDetails?.connect_with_parents ? "Yes" : "No"}
                </Col>
              </Row>
            </Stack>
          ) : (
            <p className="text-muted">Please fill out your profile in the "Edit Profile" tab.</p>
          )}
        </Card>
      </Tab>

      {/* ✅ Edit Profile Tab: Always Available */}
      <Tab eventKey="edit" title="Edit Profile">
        <Card className="p-4 shadow-sm border-0 mt-3">
          <Card.Title className="mb-4 fs-4 fw-semibold">
            {formCompleted ? "Edit Your Profile" : "Complete Your Profile"}
          </Card.Title>

          <Accordion defaultActiveKey="0" flush>
            {/* Personal Info */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>Personal Info</Accordion.Header>
              <Accordion.Body>
                <FloatingLabel label="Date of Birth" className="mb-3">
                  <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </FloatingLabel>

                <FloatingLabel label="Occupation" className="mb-3">
                  <Form.Control type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                </FloatingLabel>

                <FloatingLabel label="Phone Number">
                  <Form.Control type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </FloatingLabel>
              </Accordion.Body>
            </Accordion.Item>

            {/* Education */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Education & Experience</Accordion.Header>
              <Accordion.Body>
                <FloatingLabel label="Highest Education" className="mb-3">
                  <Form.Select value={highestEducation} onChange={(e) => setHighestEducation(e.target.value)}>
                    <option value="">Select</option>
                    <option>High School</option>
                    <option>Bachelor's</option>
                    <option>Master's</option>
                    <option>PhD</option>
                  </Form.Select>
                </FloatingLabel>

                <FloatingLabel label="Industry Experience">
                  <Form.Control type="text" value={industryExperience} onChange={(e) => setIndustryExperience(e.target.value)} />
                </FloatingLabel>
              </Accordion.Body>
            </Accordion.Item>

            {/* Career Guidance */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Career Guidance & Preferences</Accordion.Header>
              <Accordion.Body>
                <FloatingLabel label="Career Concerns" className="mb-3">
                  <Form.Control as="textarea" rows={3} value={careerConcerns} onChange={(e) => setCareerConcerns(e.target.value)} />
                </FloatingLabel>

                {/* Special Certifications (Tag UI) */}
                <Form.Label>Special Certifications</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Add certification..."
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCertification()}
                  />
                  <Button onClick={handleAddCertification}>Add</Button>
                </InputGroup>
                <div className="d-flex flex-wrap mb-3">
                  {specialCertifications.map((item, idx) => (
                    <span key={idx} className="badge bg-info me-2 mb-2">
                      {item} <XCircle className="ms-1 cursor-pointer" onClick={() => removeCert(idx)} />
                    </span>
                  ))}
                </div>

                {/* Preferred Career Paths (Tag UI) */}
                <Form.Label>Preferred Career Paths</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Add preferred path..."
                    value={careerPathInput}
                    onChange={(e) => setCareerPathInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCareerPath()}
                  />
                  <Button onClick={handleAddCareerPath}>Add</Button>
                </InputGroup>
                <div className="d-flex flex-wrap mb-3">
                  {preferredCareerPaths.map((item, idx) => (
                    <span key={idx} className="badge bg-warning text-dark me-2 mb-2">
                      {item} <XCircle className="ms-1 cursor-pointer" onClick={() => removeCareerPath(idx)} />
                    </span>
                  ))}
                </div>

                {/* Toggles */}
                <Form.Check
                  type="switch"
                  label="Interested in Mentorship?"
                  checked={mentorshipInterest}
                  onChange={() => setMentorshipInterest(!mentorshipInterest)}
                  className="mb-2"
                />
                <Form.Check
                  type="switch"
                  label="Connect with Other Parents?"
                  checked={connectWithParents}
                  onChange={() => setConnectWithParents(!connectWithParents)}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="d-grid mt-4">
            <Button variant="success" size="lg" onClick={handleSaveDetails}>
              Save Changes
            </Button>
          </div>
        </Card>
      </Tab>
    </Tabs>
  </Container>
);

  
};

export default ParentDashboard;
