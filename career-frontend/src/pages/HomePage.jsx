import { Container, Row, Col, Button, Card ,Carousel,Badge,Accordion,Tabs,Tab} from "react-bootstrap";
import { LightningCharge, GraphUpArrow, PeopleFill, CheckCircle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import '../styles/homepage.css';
import assest from "../assets/Psychometric-Tests.png";
import game from "../assets/brain-games.png";
import image from "../assets/proff.svg";
import personalizedRecommendations from "../assets/personalized.jpg";
import psychometric from "../assets/psycho.jpg";
import selfDiscovery from "../assets/sda.jpg";
import guidancePlatform from "../assets/platform.jpg";
import careerExplorer from "../assets/career tool.jpg";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomePage() {return (
  <div className="homepage" style={{backgroundSize:"cover",marginTop:"13px"}}>
    {/* Hero Section */}
    <section className="hero-section d-flex align-items-center text-white text-center bg-primary py-4">
  <Container><br/><br/><br/><br/><br/><br/>
    {/* SVG Image */}

    {/* Text Content */}
    <h1 className="display-3 fw-bold">Empower Your Career Journey</h1>
    <p className="lead mt-3 mb-4 fw-bold fs-3">
      India’s most trusted platform for students, parents, and educators.
    </p>

    {/* Buttons */}
    <div className="d-flex justify-content-center gap-3 flex-wrap">
      <Button as={Link} to="/login" variant="light" className="fw-semibold px-4">
        Login
      </Button>
      <Button as={Link} to="/register" variant="outline-light" className="fw-semibold px-4">
        Register
      </Button>
    </div><br/>
    <img
      src={image} // <-- Adjust the path to your actual .svg location
      alt="Career Professionals Illustration"
      className="mb--2"
      style={{ width: '80vw', height: 'auto',marginTop:"90px",marginLeft:"-9vw" }}
    />
  </Container>
</section>

<section className="role-based-guidance py-5 bg-light">
  <Container>
    <h2 className="text-center text-primary mb-4">Role-Based Career Guidance</h2>
    <p className="text-center mb-5 fs-5">
      Our platform tailors support and resources based on your role to help you navigate the career journey more effectively.
    </p>

    <Row className="g-4">
      {/* School Students */}
      <Col md={6} lg={3}>
        <Card className="h-100 shadow border-0 rounded-4">
          <Card.Body>
            <Card.Title className="text-primary fs-4">For School Students</Card.Title>
            <Card.Text className="fs-6">
              - Discover your strengths through assessments.<br />
              - Explore career options early on.<br />
              - Build clarity before choosing streams.<br />
              - Get mentorship from teachers and professionals.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* College Students */}
      <Col md={6} lg={3}>
        <Card className="h-100 shadow border-0 rounded-4">
          <Card.Body>
            <Card.Title className="text-success fs-4">For College Students</Card.Title>
            <Card.Text className="fs-6">
              - Identify ideal career paths.<br />
              - Get personalized job role suggestions.<br />
              - Bridge skill gaps with learning paths.<br />
              - Connect with industry mentors.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Parents */}
      <Col md={6} lg={3}>
        <Card className="h-100 shadow border-0 rounded-4">
          <Card.Body>
            <Card.Title className="text-warning fs-4">For Parents</Card.Title>
            <Card.Text className="fs-6">
              - Understand your child’s aptitude and interests.<br />
              - Get expert insights to guide them.<br />
              - Track their development journey.<br />
              - Access workshops & parental tools.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Counselors & Teachers */}
      <Col md={6} lg={3}>
        <Card className="h-100 shadow border-0 rounded-4">
          <Card.Body>
            <Card.Title className="text-danger fs-4">For Counselors & Teachers</Card.Title>
            <Card.Text className="fs-6">
              - Access student reports & data.<br />
              - Provide customized guidance.<br />
              - Engage in career mentorship.<br />
              - Collaborate with parents & experts.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
</section>


    {/* Carousel Section */}
  
<section className="carousel-section py-5 bg-light">
  <Container>
    <Slider
      dots={true}
      infinite={true}
      speed={1000}
      slidesToShow={3}
      slidesToScroll={1}
      autoplay={true}
      autoplaySpeed={2500}
      centerMode={true}
      centerPadding="0px"
      responsive={[
        {
          breakpoint: 992,
          settings: { slidesToShow: 2 },
        },
        {
          breakpoint: 576,
          settings: { slidesToShow: 1 },
        },
      ]}
    >
      {/* Slide 1: Self Discovery Assessments */}
      <div className="text-center px-3">
        <img
          src={selfDiscovery}
          alt="Self Discovery"
          style={{ height: "350px", borderRadius: "20px", margin: "auto" }}
          className="w-100 d-block mb-3"
        />
        <h5 className="fw-bold">Self Discovery Assessments</h5>
        <p className="text-muted">Gain clarity on your values, interests, and personality traits.</p>
      </div>

      {/* Slide 2: Career Explorer Tool */}
      <div className="text-center px-3">
        <img
          src={careerExplorer}
          alt="Career Explorer"
          style={{ height: "350px", borderRadius: "20px", margin: "auto" }}
          className="w-100 d-block mb-3"
        />
        <h5 className="fw-bold">Career Explorer Tool</h5>
        <p className="text-muted">Navigate a world of career paths based on your strengths and passions.</p>
      </div>

      {/* Slide 3: Personalized Recommendations */}
      <div className="text-center px-3">
        <img
          src={personalizedRecommendations}
          alt="Personalized Recommendations"
          style={{ height: "350px", borderRadius: "20px", margin: "auto" }}
          className="w-100 d-block mb-3"
        />
        <h5 className="fw-bold">Personalized Recommendations</h5>
        <p className="text-muted">Receive tailored career suggestions that match your unique profile.</p>
      </div>

      {/* Slide 4: Career Guidance Platform */}
      <div className="text-center px-3">
        <img
          src={guidancePlatform}
          alt="Career Guidance Platform"
          style={{ height: "350px", borderRadius: "20px", margin: "auto" }}
          className="w-100 d-block mb-3"
        />
        <h5 className="fw-bold">Personalized Career Guidance Platform</h5>
        <p className="text-muted">Empowering students, parents, and educators with data-driven insights.</p>
      </div>

      {/* Slide 5: Psychometric Assessments */}
      <div className="text-center px-3">
        <img
          src={psychometric}
          alt="Psychometric Assessments"
          style={{ height: "350px", borderRadius: "20px", margin: "auto" }}
          className="w-100 d-block mb-3"
        />
        <h5 className="fw-bold">Psychometric Assessments</h5>
        <p className="text-muted">Uncover your personality, strengths, and ideal career paths.</p>
      </div>
    </Slider>
  </Container>
</section>



    {/* What We Offer */}
    <section className="features-section py-5">
      <Container>
        <h2 className="text-center mb-4 text-primary">What We Offer</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="feature-card text-center">
              <Card.Body>
                <LightningCharge size={40} className="text-info mb-3" />
                <Card.Title>Personalized Guidance</Card.Title>
                <Card.Text>
                  Tailored advice based on interests, strengths, and aspirations.
                </Card.Text>
                <Badge bg="info">AI Powered</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card text-center">
              <Card.Body>
                <GraphUpArrow size={40} className="text-success mb-3" />
                <Card.Title>Career Mapping</Card.Title>
                <Card.Text>
                  Discover suitable paths, future opportunities & industries.
                </Card.Text>
                <Badge bg="success">Verified Insights</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card text-center">
              <Card.Body>
                <PeopleFill size={40} className="text-warning mb-3" />
                <Card.Title>Mentor Connect</Card.Title>
                <Card.Text>
                  Get access to experienced mentors from diverse domains.
                </Card.Text>
                <Badge bg="warning">Live Sessions</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>

    {/* How It Works with Accordion */}
    <section className="how-it-works py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5 text-dark">How It Works</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>1. Register Your Role</Accordion.Header>
            <Accordion.Body>
              Choose whether you're a student, parent, or teacher and sign up for free.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>2. Complete Smart Profile</Accordion.Header>
            <Accordion.Body>
              Fill in a quick but insightful form for tailored recommendations.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>3. Get Expert Matches</Accordion.Header>
            <Accordion.Body>
              Receive customized pathways, connect with mentors, and explore industries.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </section>

    {/* Psychometric Tests & Assessments */}
    <section className="assessment-section py-5">
  <Container>
    <h2 className="text-center text-primary mb-4">Explore Yourself</h2>

    <Tabs defaultActiveKey="tests" id="explore-tabs" className="mb-4 justify-content-center">
      {/* Psychometric Tests Tab */}
      <Tab eventKey="tests" title="Psychometric Tests" className="fs-2">
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-lg p-4 border-0 rounded-4">
              <Card.Body>
                <Card.Title className="fs-3 text-primary">Psychometric Assessments</Card.Title>
                <Card.Text className="fs-5">
                  Dive deep into your personality, interests, aptitude, and emotional intelligence with
                  scientifically validated psychometric tests. These assessments help you understand your:
                </Card.Text>
                <ul className="fs-5">
                  <li><strong>Personality Type:</strong> Discover traits and behavior patterns that shape how you make decisions.</li>
                  <li><strong>Aptitude:</strong> Assess your natural skills in logic, language, spatial reasoning, and more.</li>
                  <li><strong>Interest Areas:</strong> Find fields and activities that resonate with your passions.</li>
                  <li><strong>Emotional Quotient (EQ):</strong> Understand how you handle relationships and stress.</li>
                </ul>
                <p className="fs-5">Use these insights to guide your academic choices and long-term career goals.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab>

      {/* Activity-Based Assessments Tab */}
      <Tab eventKey="activities" title="Activity-Based Assessments">
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-lg p-4 border-0 rounded-4">
              <Card.Body>
                <Card.Title className="fs-3 text-primary">Activity-Based Self Discovery</Card.Title>
                <Card.Text className="fs-5">
                  Learn about yourself through fun, engaging activities designed to test and reveal your natural behavior patterns.
                </Card.Text>
                <ul className="fs-5">
                  <li><strong>Decision-Making Games:</strong> See how you approach problems under pressure.</li>
                  <li><strong>Role-Based Tasks:</strong> Identify leadership, communication, and collaboration skills.</li>
                  <li><strong>Reflection Exercises:</strong> Analyze how you react in various scenarios.</li>
                </ul>
                <p className="fs-5">These activities are curated by career coaches to mirror real-life challenges and opportunities.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab>

      {/* Guidance Tools Tab */}
      <Tab eventKey="guidance" title="Guidance Tools">
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-lg p-4 border-0 rounded-4">
              <Card.Body>
                <Card.Title className="fs-3 text-primary">Smart Guidance Tools</Card.Title>
                <Card.Text className="fs-5">
                  Access intelligent tools to support your academic and career planning.
                </Card.Text>
                <ul className="fs-5">
                  <li><strong>Career Explorer:</strong> Discover job roles aligned with your strengths and preferences.</li>
                  <li><strong>Report Generator:</strong> Download personalized reports with recommendations.</li>
                  <li><strong>Mentor Match:</strong> Connect with professionals and educators for mentorship.</li>
                </ul>
                <p className="fs-5">Our tools are designed to be actionable and tailored for students, parents, and teachers.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab>
    </Tabs>
  </Container>
</section>


    {/* Testimonials */}
    <section className="testimonials-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5 text-primary">Success Stories</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow testimonial-card">
              <Card.Body>
                <Card.Text>“The platform helped me discover a career I hadn’t even considered. It changed everything.”</Card.Text>
                <Card.Subtitle className="text-muted mt-3">– Ananya, Class 10 Student</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow testimonial-card">
              <Card.Body>
                <Card.Text>“I finally feel confident guiding my child through their future. Thank you!”</Card.Text>
                <Card.Subtitle className="text-muted mt-3">– Mr. Sharma, Parent</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow testimonial-card">
              <Card.Body>
                <Card.Text>“This app is a game-changer for educators looking to support their students.”</Card.Text>
                <Card.Subtitle className="text-muted mt-3">– Ms. Roy, Teacher</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>

    {/* CTA Section */}
    <section className="cta-strip text-white text-center py-5 bg-primary">
      <Container>
        <h3 className="fw-bold">Ready to Start Your Journey?</h3>
        <p className="mb-4">Join thousands already building brighter futures.</p>
        <Button as={Link} to="/register" variant="light" size="lg" className="fw-semibold">
          Sign Up Now
        </Button>
      </Container>
    </section>
  </div>
);
}

export default HomePage;
