// import React, { useEffect, useState } from 'react';
// import {
//   Card,
//   Button,
//   Badge,
//   Row,
//   Col,
//   Container,
//   ListGroup,
//   Spinner,
//   OverlayTrigger,
//   Popover
// } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   InfoCircle,
//   Star,
//   Book,
//   Rocket
// } from 'react-bootstrap-icons';

// const SelfDiscoveryAssessment = () => {
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/details', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStudent(res.data);
//       } catch (error) {
//         console.error('Error fetching student details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudentDetails();
//   }, [token]);

//   const calculateAge = (dob) => {
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const handleStartAssessment = () => {
//     navigate('/self-discovery');
//   };

//   const handleViewResults = () => {
//     navigate('self-discovery');
//   };

//   const renderPopover = (title, content) => (
//     <Popover>
//       <Popover.Header as="h3">{title}</Popover.Header>
//       <Popover.Body>{content}</Popover.Body>
//     </Popover>
//   );

//   if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

//   return (
//     <Container className="py-4">
//       <Card className="shadow-lg p-4 mb-4 rounded-4 border-0">
//         <Card.Body>
//           <Card.Title className="mb-3 fs-3 text-primary">
//             Welcome to Your Self Discovery Journey 🚀
//           </Card.Title>
//           <Card.Text className="fs-5 text-muted">
//             This assessment is designed to help you uncover your strengths, interests, personality traits, and future goals.
//             It takes just 5-10 minutes and gives you personalized insights to guide your career and subject choices.
//           </Card.Text>

//           <Row className="mt-4">
//             <Col xs={12} md={6}>
//               <ListGroup variant="flush">
//                 <ListGroup.Item><strong>Name:</strong> {student.full_name}</ListGroup.Item>
//                 <ListGroup.Item><strong>Email:</strong> {student.email}</ListGroup.Item>
//                 <ListGroup.Item><strong>Role:</strong> <Badge bg="info">{student.role}</Badge></ListGroup.Item>
//                 <ListGroup.Item><strong>Age:</strong> {calculateAge(student.dob)} years</ListGroup.Item>
//                 <ListGroup.Item>
//                   <strong>Assessment Status:</strong>{' '}
//                   {student.assessment_completed ? (
//                     <span className="text-success">
//                       Completed ✅{' '}
//                       <Button variant="outline-primary" size="sm" onClick={handleViewResults}>
//                         View Results
//                       </Button>
//                     </span>
//                   ) : (
//                     <span className="text-danger">Not Completed ❌</span>
//                   )}
//                 </ListGroup.Item>
//               </ListGroup>
//             </Col>

//             <Col xs={12} md={6}>
//               <ListGroup variant="flush">
//                 <ListGroup.Item>
//                   <strong>Career Interests:</strong>
//                   <div className="mt-1">
//                     {student.career_interest?.length > 0 ? (
//                       student.career_interest.map((item, i) => (
//                         <Badge key={i} bg="success" className="me-1">{item}</Badge>
//                       ))
//                     ) : (
//                       <span className="text-muted">Not Provided</span>
//                     )}
//                   </div>
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <strong>Subject Interests:</strong>
//                   <div className="mt-1">
//                     {student.subject_interest?.length > 0 ? (
//                       student.subject_interest.map((item, i) => (
//                         <Badge key={i} bg="secondary" className="me-1">{item}</Badge>
//                       ))
//                     ) : (
//                       <span className="text-muted">Not Provided</span>
//                     )}
//                   </div>
//                 </ListGroup.Item>
//               </ListGroup>
//             </Col>
//           </Row>

//           <div className="text-center mt-5">
//             {!student.assessment_completed && (
//               <Button variant="primary" size="lg" className="rounded-pill px-4" onClick={handleStartAssessment}>
//                 🌟 Start Self Discovery Assessment
//               </Button>
//             )}
//           </div>
//         </Card.Body>
//       </Card>

//       <Row className="text-center mb-4">
//         <Col>
//           <OverlayTrigger
//             placement="top"
//             overlay={renderPopover('What is Self Discovery?', 'Self-discovery is the process of understanding your own personality, interests, values, and aspirations.')}
//           >
//             <div>
//               <Rocket size={48} className="text-primary" />
//               <p className="mt-2 fw-bold">Self Discovery</p>
//             </div>
//           </OverlayTrigger>
//         </Col>
//         <Col>
//           <OverlayTrigger
//             placement="top"
//             overlay={renderPopover('Personality Traits', 'Explore characteristics that describe your behavior, thinking, and emotions.')}
//           >
//             <div>
//               <Book size={48} className="text-success" />
//               <p className="mt-2 fw-bold">Personality</p>
//             </div>
//           </OverlayTrigger>
//         </Col>
//         <Col>
//           <OverlayTrigger
//             placement="top"
//             overlay={renderPopover('Strengths & Skills', 'Identify what you’re naturally good at, from leadership to creativity.')}
//           >
//             <div>
//               <Star size={48} className="text-warning" />
//               <p className="mt-2 fw-bold">Strengths</p>
//             </div>
//           </OverlayTrigger>
//         </Col>
//         <Col>
//           <OverlayTrigger
//             placement="top"
//             overlay={renderPopover('Learning Style', 'Understand whether you learn best through visuals, audio, reading, or hands-on experience.')}
//           >
//             <div>
//               <Book size={48} className="text-info" />
//               <p className="mt-2 fw-bold">Learning Style</p>
//             </div>
//           </OverlayTrigger>
//         </Col>
//         <Col>
//           <OverlayTrigger
//             placement="top"
//             overlay={renderPopover('Future Goals', 'Define your aspirations and what success looks like for you in the future.')}
//           >
//             <div>
//               <InfoCircle size={48} className="text-danger" />
//               <p className="mt-2 fw-bold">Future Goals</p>
//             </div>
//           </OverlayTrigger>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default SelfDiscoveryAssessment;

import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Badge,
  Row,
  Col,
  Container,
  ListGroup,
  Spinner,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  InfoCircle,
  Star,
  Book,
  Rocket
} from 'react-bootstrap-icons';
import { Brain } from 'lucide-react';


const SelfDiscoveryAssessment = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formCompleted, setFormCompleted] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [verifiedParent, setVerifiedParent] = useState(null);
  const [verifiedChild, setVerifiedChild] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudentData = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        console.error("User data not found in localStorage");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/api/user-details/${userData.id}`);
        const data = await response.json();
  
        if (response.ok && data.details) {
          setStudentDetails(data);
          setVerifiedParent(data.verifiedParent);
          setVerifiedChild(data.verifiedChild);
  
          // Update the full student object with assessment status
          const updatedStudent = {
            ...userData,
            assessment_completed: data.details.assessment_completed,
          };
          setStudent(updatedStudent);
          localStorage.setItem("user", JSON.stringify(updatedStudent));
  
          if (
            data.details.dob &&
            data.details.grade &&
            data.details.school_board &&
            data.details.school_name &&
            data.details.career_interest?.length > 0 &&
            data.details.subject_interest?.length > 0
          ) {
            setFormCompleted(true);
          } else {
            setFormCompleted(false);
          }
        } else {
          setFormCompleted(false);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setFormCompleted(false);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudentData();
  }, []);
  

  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  

  const handleStartAssessment = () => {
    navigate('/self-discovery-start');
  };
  const handleStartPsychometric = () => {
    navigate('/psychometric-test');
  };
  const handleViewResults = () => {
    navigate('/self-discovery-analysis');
  };

  const renderPopover = (title, content) => (
    <Popover>
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body>{content}</Popover.Body>
    </Popover>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <Container className="mt-5">
        <h4 className="text-danger text-center">Unable to load student information. Please try again.</h4>
      </Container>
    );
  };
  const handleGoBack = () => {
    navigate(-1); // Navigate back to previous page
  };

  return (
    <Container className="py-" style={{marginTop:"50px"}}>
      <Card className="shadow-lg p-4 mb-4 rounded-4 border-0">
        <Card.Body className='py-4'>
          <Card.Title className="mb-3 fs-3 text-primary">
            <Row>
            <Col>Welcome to Your Self Discovery Journey 🚀</Col>
            <Col style={{marginLeft:"20px"}}>
                    <Button variant="outline-info px-4 " onClick={handleGoBack}>
                    ← Back
                  </Button>
            </Col>
            </Row>
          </Card.Title>
          
          <Card className="fs-5 text-muted p-3">
  <h5 className="mb-3 text-dark">🧭 Self-Discovery Assessment: Rules & Importance</h5>
  <ol className="mb-3">
    <li>This assessment is designed to help you uncover your strengths, interests, personality traits, and future goals.</li>
    <li>It takes just 5–10 minutes and gives you personalized insights to guide your career and subject choices.</li>
    <li>Be honest in your responses to get the most accurate and helpful results.</li>
    <li>There are no right or wrong answers — it’s all about understanding yourself better.</li>
    <li>Your responses will remain private and are used only to support your personal development journey.</li>
  </ol>
  <div>
    <strong>Why it matters:</strong>
    <ul>
      <li>Helps you make informed decisions about your academic and career path.</li>
      <li>Reveals areas where you may excel and feel fulfilled.</li>
      <li>Encourages self-awareness, which is key to personal and professional growth.</li>
      <li>Can guide discussions with parents, mentors, and teachers about your aspirations.</li>
    </ul>
  </div>
</Card>
<br/><br/>
<Row className="text-center mb-4"><h2>What We’ve Discovered About Yourself</h2></Row>
          <Row className="text-center mb-4">
        <br/><br/>
        <Col>
          <OverlayTrigger
            placement="top"
            overlay={renderPopover('What is Self Discovery?', 'Self-discovery is the process of understanding your own personality, interests, values, and aspirations.')}
          >
            <div>
              <Rocket size={48} className="text-primary" />
              <p className="mt-2 fw-bold">Self Discovery</p>
            </div>
          </OverlayTrigger>
        </Col>
        <Col>
          <OverlayTrigger
            placement="top"
            overlay={renderPopover('Personality Traits', 'Explore characteristics that describe your behavior, thinking, and emotions.')}
          >
            <div>
              {/* <Book size={48} className="text-success" /> */}
              <Brain size={49} color="purple" />
              <p className="mt-2 fw-bold">Personality</p>
            </div>
          </OverlayTrigger>
        </Col>
        <Col>
          <OverlayTrigger
            placement="top"
            overlay={renderPopover('Strengths & Skills', 'Identify what you’re naturally good at, from leadership to creativity.')}
          >
            <div>
              <Star size={48} className="text-warning" />
              <p className="mt-2 fw-bold">Strengths</p>
            </div>
          </OverlayTrigger>
        </Col>
        <Col>
          <OverlayTrigger
            placement="top"
            overlay={renderPopover('Learning Style', 'Understand whether you learn best through visuals, audio, reading, or hands-on experience.')}
          >
            <div>
              <Book size={48} className="text-info" />
              <p className="mt-2 fw-bold">Learning Style</p>
            </div>
          </OverlayTrigger>
        </Col>
        <Col>
          <OverlayTrigger
            placement="top"
            overlay={renderPopover('Future Goals', 'Define your aspirations and what success looks like for you in the future.')}
          >
            <div>
              <InfoCircle size={48} className="text-danger" />
              <p className="mt-2 fw-bold">Future Goals</p>
            </div>
          </OverlayTrigger>
        </Col>
      </Row>
          <Row className="mt-4">
            <Col xs={12} md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Name:</strong> {student.fullName || student.username}</ListGroup.Item>
                <ListGroup.Item><strong>Email:</strong> {student.email}</ListGroup.Item>
                <ListGroup.Item><strong>Role:</strong> <Badge bg="info">{student.role}</Badge></ListGroup.Item>
                <ListGroup.Item>
  <strong>Age:</strong> {calculateAge(studentDetails?.details?.dob?.split("T")[0])} years
</ListGroup.Item>

                <ListGroup.Item>
                  <strong>Assessment Status:</strong>{' '}
                  {student.assessment_completed ? (
                    <span className="text-success">
                      Completed ✅{' '}
                      <Button variant="outline-primary" size="sm" className="ms-2" onClick={handleViewResults}>
                        View Results
                      </Button>
                    </span>
                  ) : (
                    <span className="text-danger">Not Completed ❌</span>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            {/* {formCompleted && studentDetails && (
              <Card className="shadow-sm p-4 rounded-4 border-0 bg-white mb-4 mt-3">
                <Card.Title className="mb-4 text-primary fs-4">Student Profile Summary</Card.Title>
                <Row className="g-3">
                  <Col md={6}>
                    <Card className="border-0 bg-primary-subtle p-3 rounded-3 shadow-sm">
                      <strong>Date of Birth</strong>
                      <div>{studentDetails.details.dob.split("T")[0]}</div>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-info-subtle p-3 rounded-3 shadow-sm">
                      <strong>Grade</strong>
                      <div>{studentDetails.details.grade}</div>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-info-subtle p-3 rounded-3 shadow-sm">
                      <strong>School Board</strong>
                      <div>{studentDetails.details.school_board}</div>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-primary-subtle p-3 rounded-3 shadow-sm">
                      <strong>School Name</strong>
                      <div>{studentDetails.details.school_name}</div>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-primary-subtle p-3 rounded-3 shadow-sm">
                      <strong>Career Interests</strong>
                      <ul className="mb-0 ps-3">
                        {studentDetails.details.career_interest.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-info-subtle p-3 rounded-3 shadow-sm">
                      <strong>Subject Interests</strong>
                      <ul className="mb-0 ps-3">
                        {studentDetails.details.subject_interest.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </Card>
                  </Col>
                </Row>
              </Card>
            )} */}
          </Row>

          {!student.assessment_completed ? (
  <div className="text-center mt-5">
    <Button variant="primary" size="lg" className="rounded-pill px-4" onClick={handleStartAssessment}>
      🌟 Start Self Discovery Assessment
    </Button>
  </div>
) : (
  <div className="text-center mt-5">
    <Button variant="secondary" size="lg" className="rounded-pill px-4" disabled>
      ✅ Assessment Completed
    </Button>
    <Button variant="secondary" size="lg" className="rounded-pill px-4" onClick={handleStartPsychometric}>
    🧠 Start Psychometric Test
    </Button>
  </div>
)}

        </Card.Body>
      </Card>
    </Container>
  );
};

export default SelfDiscoveryAssessment;
