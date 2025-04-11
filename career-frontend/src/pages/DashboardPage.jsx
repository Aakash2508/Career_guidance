// import React, { useEffect, useState } from "react";
// import { Container } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
// import { useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData) setUser(userData);
//   }, []);
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove token from local storage
//     navigate("/login"); // Redirect to login page
// };

//   return (
//     <Container className="mt-5">
//       <h2>Welcome, {user?.fullName}</h2>
//       <p>Email: {user?.email}</p>
//       <p>Role: {user?.role}</p>
//       <Button variant="danger" onClick={handleLogout}>Logout</Button>
//     </Container>
//   );
// };

// export default DashboardPage;






// import React, { useEffect, useState } from "react";
// import { Container, Form, Button, Alert } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const [user, setUser] = useState(null);
//   const [dob, setDob] = useState("");
//   const [careerInterests, setCareerInterests] = useState([]);
//   const [subjectInterests, setSubjectInterests] = useState([]);
//   const [selectedCareer, setSelectedCareer] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [childEmail, setChildEmail] = useState("");
//   const [emailSent, setEmailSent] = useState(false);
//   const [parentDetails, setParentDetails] = useState(null);
//   const navigate = useNavigate();
//   const [verifiedChild, setVerifiedChild] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData) {
//       setUser(userData);
//       fetchDropdownData();
//     }
//   }, []);


//   const fetchDropdownData = async () => {
//     try {
//       const careerRes = await fetch("http://localhost:5000/api/career_interests");
//       const subjectRes = await fetch("http://localhost:5000/api/subject_interests");
  
//       if (!careerRes.ok || !subjectRes.ok) {
//         throw new Error(`Error: ${careerRes.status} ${subjectRes.status}`);
//       }
  
//       const careerData = await careerRes.json();
//       const subjectData = await subjectRes.json();
  
//       console.log("Career Interests Fetched:", careerData);
//       console.log("Subject Interests Fetched:", subjectData);
  
//       if (!Array.isArray(careerData) || !Array.isArray(subjectData)) {
//         throw new Error("API response is not an array.");
//       }
  
//       setCareerInterests(careerData);
//       setSubjectInterests(subjectData);
//     } catch (error) {
//       console.error("Dropdown Fetch Error:", error);
//     }
//   };
  
//   const fetchVerifiedChild = async (parentId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/get-verified-child/${parentId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setVerifiedChild(data); // Set verified child's details
//       }
//     } catch (error) {
//       console.error("Error fetching verified child:", error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleParentVerification = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/verify-parent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ parentEmail: user.email, childEmail }),
//       });
  
//       const result = await response.json();
//       if (response.ok) {
//         setEmailSent(true);
//       } else {
//         alert(result.message);
//       }
//     } catch (error) {
//       console.error("Error verifying parent-child link:", error);
//     }
//   };
  
  

//   return (
//     <Container className="mt-5">
//       <h2>Welcome, {user?.fullName}</h2>
//       <p>Email: {user?.email}</p>
//       <p>Role: {user?.role}</p>

//       {user?.role === "student" && parentDetails && (
//   <div className="mt-4">
//     <h4>Linked Parent:</h4>
//     <p>Name: {parentDetails.full_name}</p>
//     <p>Email: {parentDetails.email}</p>
//   </div>
// )}


//       {/* Student Form */}
//       {user?.role === "student" && (
//         <Form className="mt-4">
//           <Form.Group controlId="dob">
//             <Form.Label>Date of Birth (Required)</Form.Label>
//             <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
//           </Form.Group>

//           <Form.Group controlId="careerInterest">
//   <Form.Label>Career Interests</Form.Label>
//   <Form.Select value={selectedCareer} onChange={(e) => setSelectedCareer(e.target.value)}>
//     <option value="">Select a Career Interest</option>
//     {careerInterests.map((career) => (
//       <option key={career.id} value={career.id}>{career.name}</option>
//     ))}
//   </Form.Select>
// </Form.Group>

// <Form.Group controlId="subjectInterest">
//   <Form.Label>Subject Interests</Form.Label>
//   <Form.Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
//     <option value="">Select a Subject Interest</option>
//     {subjectInterests.map((subject) => (
//       <option key={subject.id} value={subject.id}>{subject.name}</option>
//     ))}
//   </Form.Select>
// </Form.Group>

//         </Form>
//       )}

//       {/* Parent Form */}
//       {user?.role === "parent" && (
//         <>
//           {verifiedChild ? (
//             // Show verified child details
//             <Alert variant="success" className="mt-3">
//               <h5>Verified Child:</h5>
//               <p>Name: {verifiedChild.full_name}</p>
//               <p>Email: {verifiedChild.email}</p>
//             </Alert>
//           ) : (
//             // Show input field for verifying child's email
//             <Form className="mt-4">
//               <Form.Group controlId="childEmail">
//                 <Form.Label>Your Child's Email</Form.Label>
//                 <Form.Control type="email" value={childEmail} onChange={(e) => setChildEmail(e.target.value)} required />
//               </Form.Group>

//               <Button variant="primary" onClick={handleParentVerification} className="mt-3">
//                 Verify Child Email
//               </Button>

//               {emailSent && <Alert variant="success" className="mt-3">Verification email sent to child!</Alert>}
//             </Form>
//           )}
//         </>
//       )}

//       <Button variant="danger" onClick={handleLogout} className="mt-4">Logout</Button>
//     </Container>
//   );
// };

// export default DashboardPage;




// import React, { useEffect, useState } from "react";
// import { Container, Form, Button, Alert,Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const [user, setUser] = useState(null);
//   const [dob, setDob] = useState("");
//   const [details, setDetails] = useState({});
//   const [selectedCareer, setSelectedCareer] = useState([]);  // Initialize as an array
//   const [selectedSubject, setSelectedSubject] = useState([]); // Initialize as an array
//   const [careerInterests, setCareerInterests] = useState([]);
//   const [subjectInterests, setSubjectInterests] = useState([]);
//   const [childEmail, setChildEmail] = useState("");
//   const [emailSent, setEmailSent] = useState(false);
//   const [parentDetails, setParentDetails] = useState(null);
//   const [verifiedChild, setVerifiedChild] = useState(null);
//   const navigate = useNavigate();
//   const [grade, setGrade] = useState("");
//   const [schoolBoard, setSchoolBoard] = useState("");
//   const [schoolName, setSchoolName] = useState("");
  
//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData) {
//       setUser(userData);
//       fetchDropdownData();
//       fetchUserDetails(userData.id);
//       if (userData.role === "student") {
//         fetchParentDetails(userData.id);
//       } else if (userData.role === "parent") {
//         fetchVerifiedChild(userData.id);
//       }
//     }
//   }, []);
  

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData) {
//       setUser(userData);
//       fetchUserDetails(userData.id);
//       fetchDropdownData();
//     }
//   }, []);
  

//   const [userDetails, setUserDetails] = useState(null);
//   const [formCompleted, setFormCompleted] = useState(false);
  
//   // const fetchUserDetails = async (userId) => {
//   //   try {
//   //     const response = await fetch(`http://localhost:5000/api/user-details/${userId}`);
//   //     const data = await response.json();
//   //     if (response.ok) {
//   //       setUserDetails(data);
//   //       setDob(data.dob || "");
//   //       setGrade(data.grade || "");
//   //       setSchoolBoard(data.school_board || "");
//   //       setSchoolName(data.school_name || "");
//   //       setSelectedCareer(data.career_interest || []);
//   //       setSelectedSubject(data.subject_interest || []);
//   //       setFormCompleted(checkFormCompletion(data));
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching user details:", error);
//   //   }
//   // };
  

  
//   const checkFormCompletion = (data) => {
//     return (
//       data.dob &&
//       data.grade &&
//       data.school_board &&
//       data.school_name &&
//       data.career_interest?.length > 0 &&
//       data.subject_interest?.length > 0
//     );
//   };
  
//   const handleSaveDetails = async () => {
//     if (!dob || !grade || !schoolBoard || !schoolName || selectedCareer.length === 0 || selectedSubject.length === 0) {
//       alert("Please fill in all required fields.");
//       return;
//     }
  
//     const newDetails = {
//       userId: user?.id, // Ensure user ID is included
//       dob,
//       grade,
//       school_board: schoolBoard,
//       school_name: schoolName,
//       career_interest: selectedCareer,
//       subject_interest: selectedSubject,
//     };
  
//     try {
//       const response = await fetch("http://localhost:5000/api/save-user-details", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newDetails),
//       });
  
//       const result = await response.json();
      
//       if (response.ok) {
//         setUserDetails(result); // Ensure we store the updated details
//         setFormCompleted(true);
//         alert("Details saved successfully!");
//       } else {
//         alert(result.message || "Error saving details.");
//       }
//     } catch (error) {
//       console.error("Error saving details:", error);
//     }
//   };
  
  
//   const fetchDropdownData = async () => {
//     try {
//       const careerRes = await fetch("http://localhost:5000/api/career_interests");
//       const subjectRes = await fetch("http://localhost:5000/api/subject_interests");

//       if (!careerRes.ok || !subjectRes.ok) {
//         throw new Error(`Error: ${careerRes.status} ${subjectRes.status}`);
//       }

//       const careerData = await careerRes.json();
//       const subjectData = await subjectRes.json();

//       setCareerInterests(careerData);
//       setSubjectInterests(subjectData);
//     } catch (error) {
//       console.error("Dropdown Fetch Error:", error);
//     }
//   };

//   const fetchParentDetails = async (childId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/get-parent/${childId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setParentDetails(data);
//       }
//     } catch (error) {
//       console.error("Error fetching parent details:", error);
//     }
//   };

//   const fetchVerifiedChild = async (parentId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/get-verified-child/${parentId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setVerifiedChild(data);
//       }
//     } catch (error) {
//       console.error("Error fetching verified child:", error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const handleParentVerification = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/verify-parent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ parentEmail: user.email, childEmail }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setEmailSent(true);
//       } else {
//         alert(result.message);
//       }
//     } catch (error) {
//       console.error("Error verifying parent-child link:", error);
//     }
//   };

//   const fetchUserDetails = async (userId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/user-details/${userId}`);
//       const data = await response.json();
  
//       if (response.ok) {
//         setUserDetails(data);
//         setDob(data.dob || "");
//         setGrade(data.grade || "");
//         setSchoolBoard(data.school_board || "");
//         setSchoolName(data.school_name || "");
//         setSelectedCareer(data.career_interest || []);
//         setSelectedSubject(data.subject_interest || []);
  
//         // ✅ Check if all required fields are filled
//         setFormCompleted(checkFormCompletion(data));
//       } else {
//         setFormCompleted(false); // User needs to enter details
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <h2>Welcome, {user?.fullName}</h2>
//       <p>Email: {user?.email}</p>
//       <p>Role: {user?.role}</p>
  
//       {!formCompleted && user?.role === "student" && (
//       <Form className="mt-4">
//         <Form.Group controlId="dob">
//           <Form.Label>Date of Birth (Required)</Form.Label>
//           <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
//         </Form.Group>

//         <Form.Group controlId="grade">
//   <Form.Label>Grade</Form.Label>
//   <Form.Control type="text" value={grade} onChange={(e) => setGrade(e.target.value)} required />
// </Form.Group>

// <Form.Group controlId="schoolBoard">
//   <Form.Label>School Board</Form.Label>
//   <Form.Control type="text" value={schoolBoard} onChange={(e) => setSchoolBoard(e.target.value)} required />
// </Form.Group>

// <Form.Group controlId="schoolName">
//   <Form.Label>School Name</Form.Label>
//   <Form.Control type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required />
// </Form.Group>


//         {/* 🔹 Career Interests Multi-Select */}
//         <Form.Group controlId="careerInterest">
//           <Form.Label>Career Interests</Form.Label>
//           <Form.Select
//             multiple
//             onChange={(e) => {
//               const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
//               setSelectedCareer([...new Set([...selectedCareer, ...selectedOptions])]); // Avoid duplicates
//             }}
//           >
//             {careerInterests.map((career) => (
//               <option key={career.id} value={career.name}>{career.name}</option>
//             ))}
//           </Form.Select>
//         </Form.Group>

//         {/* 🔹 Display Selected Career Interests as Cards */}
//         {selectedCareer.length > 0 && (
//           <div className="mt-3 d-flex flex-wrap">
//             {selectedCareer.map((career, index) => (
//               <Card key={index} className="m-1 p-2 d-flex flex-row align-items-center">
//                 <span className="me-2">{career}</span>
//                 <Button variant="danger" size="sm" onClick={() => setSelectedCareer(selectedCareer.filter(c => c !== career))}>x</Button>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* 🔹 Subject Interests Multi-Select */}
//         <Form.Group controlId="subjectInterest" className="mt-3">
//           <Form.Label>Subject Interests</Form.Label>
//           <Form.Select
//             multiple
//             onChange={(e) => {
//               const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
//               setSelectedSubject([...new Set([...selectedSubject, ...selectedOptions])]); // Avoid duplicates
//             }}
//           >
//             {subjectInterests.map((subject) => (
//               <option key={subject.id} value={subject.name}>{subject.name}</option>
//             ))}
//           </Form.Select>
//         </Form.Group>

//         {/* 🔹 Display Selected Subject Interests as Cards */}
//         {selectedSubject.length > 0 && (
//           <div className="mt-3 d-flex flex-wrap">
//             {selectedSubject.map((subject, index) => (
//               <Card key={index} className="m-1 p-2 d-flex flex-row align-items-center">
//                 <span className="me-2">{subject}</span>
//                 <Button variant="danger" size="sm" onClick={() => setSelectedSubject(selectedSubject.filter(s => s !== subject))}>❌</Button>
//               </Card>
//             ))}
//           </div>
//         )}

//         <Button variant="primary" className="mt-3" onClick={handleSaveDetails}>Save Details</Button>
//       </Form>
//     )}

//     {/* ✅ Show Completed Student Details */}
//     {formCompleted && user?.role === "student" && (
//       <Alert variant="info" className="mt-3">
//         <h5>Your Profile</h5>
//         <p>Date of Birth: {userDetails?.dob}</p>
//         <p>Grade: {userDetails?.grade}</p>
//         <p>School Board: {userDetails?.school_board}</p>
//         <p>School Name: {userDetails?.school_name}</p>

//         <p>Career Interests:</p>
//         <div className="d-flex flex-wrap">
//           {Array.isArray(userDetails?.career_interest) ? (
//             userDetails.career_interest.map((career, index) => (
//               <Card key={index} className="m-1 p-2">{String(career)}</Card>
//             ))
//           ) : (
//             <p>No career interests selected</p>
//           )}
//         </div>

//         <p>Subject Interests:</p>
//         <div className="d-flex flex-wrap">
//           {Array.isArray(userDetails?.subject_interest) ? (
//             userDetails.subject_interest.map((subject, index) => (
//               <Card key={index} className="m-1 p-2">{String(subject)}</Card>
//             ))
//           ) : (
//             <p>No subject interests selected</p>
//           )}
//            </div>
//       </Alert>
//     )}


//     {/* ✅ Student Dashboard - Display Verified Parent */}
//     {user?.role === "student" && parentDetails && (
//       <Alert variant="info" className="mt-3">
//         <h5>Verified Parent:</h5>
//         <p>Name: {parentDetails.full_name}</p>
//         <p>Email: {parentDetails.email}</p>
//       </Alert>
//     )}
  
//       {/* ✅ Teacher Dashboard - Form Until Completed */}
//       {!formCompleted && user?.role === "teacher" && (
//         <Form className="mt-4">
//           <Form.Group controlId="dob">
//             <Form.Label>Date of Birth (Required)</Form.Label>
//             <Form.Control type="date" required />
//           </Form.Group>
  
//           <Form.Group controlId="subjectSpecialization">
//             <Form.Label>Subject Specialization</Form.Label>
//             <Form.Control type="text" required />
//           </Form.Group>
  
//           <Form.Group controlId="schoolName">
//             <Form.Label>School Name</Form.Label>
//             <Form.Control type="text" required />
//           </Form.Group>
  
//           <Form.Group controlId="yearsOfExperience">
//             <Form.Label>Years of Experience</Form.Label>
//             <Form.Control type="number" required />
//           </Form.Group>
  
//           <Button variant="primary" className="mt-3">Save Details</Button>
//         </Form>
//       )}
  
//       {/* ✅ Teacher Profile Details */}
//       {formCompleted && user?.role === "teacher" && (
//         <Alert variant="info" className="mt-3">
//           <h5>Your Profile</h5>
//           <p>Date of Birth: {userDetails?.dob}</p>
//           <p>Subject Specialization: {userDetails?.subject_specialization}</p>
//           <p>School Name: {userDetails?.school_name}</p>
//           <p>Years of Experience: {userDetails?.years_of_experience}</p>
//         </Alert>
//       )}
  
//       {/* ✅ Logout Button */}
//       <Button variant="danger" onClick={handleLogout} className="mt-4">Logout</Button>
//     </Container>
//   );
// }  
// export default DashboardPage;



import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert, Form, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/hover.css"


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [verifiedChild, setVerifiedChild] = useState(null);
  const [verifiedParent, setVerifiedParent] = useState(null);
  const [childEmail, setChildEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      if (userData.role === "student") {
        fetchVerifiedParent(userData.id);
      } else if (userData.role === "parent") {
        fetchVerifiedChild(userData.id);
      }
    }
  }, []);

  const fetchVerifiedParent = async (childId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-parent/${childId}`);
      setVerifiedParent(response.data);
    } catch (error) {
      console.error("Error fetching verified parent details:", error);
    }
  };

  const fetchVerifiedChild = async (parentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-verified-child/${parentId}`);
      setVerifiedChild(response.data);
    } catch (error) {
      console.error("Error fetching verified child details:", error);
    }
  };

  const handleRequestApproval = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/verify-parent", {
        parentEmail: user.email,
        childEmail,
      });
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending request");
      setMessage("");
    }
  };

    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };
  
    
  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold display-5">Welcome, {user?.fullName}</h2>
          <p className="fs-5 text-muted mb-1"><strong>Email:</strong> {user?.email}</p>
          <p className="fs-5 text-muted"><strong>Role:</strong> <span className="text-capitalize">{user?.role}</span></p>
        </Col>
      </Row>

      {/* Verified Parent Info for Students */}
      {user?.role === "student" && verifiedParent && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-info">
              <Card.Header className="bg-info text-white">
                👨‍👩‍👧 Verified Parent Details
              </Card.Header>
              <Card.Body>
                <p><strong>Name:</strong> {verifiedParent.full_name}</p>
                <p><strong>Email:</strong> {verifiedParent.email}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Verified Child Info for Parents */}
      {user?.role === "parent" && verifiedChild && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-success">
              <Card.Header className="bg-success text-white">
                👶 Verified Child Details
              </Card.Header>
              <Card.Body>
                <p><strong>Name:</strong> {verifiedChild.full_name}</p>
                <p><strong>Email:</strong> {verifiedChild.email}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Buttons for Role-based Dashboards */}
      <Row className="mb-4">
        <Col className="d-flex flex-wrap gap-3">
          {user?.role === "student" && (
            <Button variant="primary" onClick={() => navigate("/student-dashboard")}>
              🎓 Student Dashboard
            </Button>
          )}
          {user?.role === "parent" && (
            <>
              <Button variant="success" onClick={() => navigate("/parent-dashboard")}>
                👪 Parent Dashboard
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowOffcanvas(true)}>
                🔗 Link Your Child
              </Button>
            </>
          )}
          {user?.role === "teacher" && (
            <Button variant="warning" onClick={() => navigate("/teacher-dashboard")}>
              📚 Teacher Dashboard
            </Button>
          )}
          <Button variant="outline-danger" onClick={handleLogout}>
            🔒 Logout
          </Button>
        </Col>
      </Row>

      {/* Offcanvas for Parent-Child Linking */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Link Your Child</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p className="text-muted">Enter your child's email to send them a verification request.</p>
          <Form>
            <Form.Group controlId="childEmail">
              <Form.Label>Child's Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleRequestApproval}>
              Send Approval Request
            </Button>
          </Form>
          {message && <Alert variant="success" className="mt-3">{message}</Alert>}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default Dashboard;
