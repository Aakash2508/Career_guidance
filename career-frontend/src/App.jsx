import React from "react";
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ApproveParent from "./ApproveParent";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./Layout";
import Chatbot from "./components/Chatbot";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import SelfDiscoveryAssessment from "./pages/SelfDiscoveryAssessments";
import AssessmentPage from "./pages/Assessment";
import RoadmapGenerator from "./pages/Roadmap";
import Analysis from "./pages/Analysis";
import DynamicPlan from "./pages/DynamicPlan";
import StudentLayout from "./StudentLayout";
import PsychometricTest from "./pages/PsychometricTest";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Homepage/></Layout>} />
        <Route path="/bot" element={<Chatbot/>}/>
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage/></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/approve-parent" element={<Layout><ApproveParent /></Layout> }/>
        <Route path="/student-dashboard" element={<StudentLayout><StudentDashboard /></StudentLayout> }/>
        <Route path="/parent-dashboard" element={<Layout><ParentDashboard /></Layout> }/>
        <Route path="/teacher-dashboard" element={<Layout><TeacherDashboard /></Layout> }/>
        <Route path="/self-discovery" element={<StudentLayout><SelfDiscoveryAssessment/></StudentLayout>}/>
        <Route path="/self-discovery-start" element={<StudentLayout><AssessmentPage/></StudentLayout>}/>
        <Route path="/roadmap" element={<StudentLayout><RoadmapGenerator/></StudentLayout>}/>
        <Route path="/self-discovery-analysis" element={<Layout><Analysis/></Layout>}/>
        <Route path="/dynamic-career-plan" element={<StudentLayout><DynamicPlan/></StudentLayout>} />
        <Route path="/psychometric-test" element={<StudentLayout><PsychometricTest/></StudentLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
