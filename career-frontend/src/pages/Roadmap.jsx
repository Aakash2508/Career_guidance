import React, { useState } from 'react';
import {
  Container,
  Button,
  Modal,
  Form,
  OverlayTrigger,
  Popover,
  Tooltip,
} from 'react-bootstrap';
import road from "../assets/ROAD.png";
import pin from "../assets/pin.png";

const Roadmap = () => {
  const [current, setCurrent] = useState('');
  const [desired, setDesired] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [activePin, setActivePin] = useState(null);

  const handleGenerate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, desired }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setRoadmap(data.roadmap || []);
      setShowModal(false);
    } catch (err) {
      console.error('Error generating roadmap:', err.message);
      alert('Error: ' + err.message);
    }
  };

  const pinCoordinates = [
    { x: 355, y: 670 },
    { x: 35, y: 455 },
    { x: 400, y: 265 },
    { x: 240, y: 160 },
    { x: 140, y: 105 },
    { x: 290, y: 75 },
    { x: 249, y: 15 },
  ];

  return (
    <>
      {/* Header */}
      <div className="header text-white text-center py-3 mb-4" style={{ backgroundColor: '#007bff' }}>
        <h2 className="m-0">🛣 Career Roadmap Generator</h2>
      </div>

      <Container className="py-3">
        {/* Modal Input */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Your Career Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Current Status</Form.Label>
                <Form.Control
                  placeholder="e.g., High School Student"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Desired Role or Goal</Form.Label>
                <Form.Control
                  placeholder="e.g., Data Scientist"
                  value={desired}
                  onChange={(e) => setDesired(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleGenerate}>Generate Roadmap</Button>
          </Modal.Footer>
        </Modal>

        {/* Roadmap */}
        {roadmap.length > 0 && (
          <div className="roadmap-wrapper mt-4 d-flex justify-content-center">
            <div
              style={{
                position: 'relative',
                width: '500px',
                height: '700px',
                backgroundImage: `url(${road})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginTop:"30px"
              }}
            >
              {roadmap.map((item, index) => {
                const coord = pinCoordinates[index] || { x: 750, y: 200 };
                const isActive = activePin === index;

                // Customize specific pins
                let pinStyle = {
                  position: 'absolute',
                  top: coord.y,
                  left: coord.x,
                  width: 70,
                  height: 70,
                  cursor: 'pointer',
                  transform: 'translate(-50%, -100%)',
                  zIndex: 1,
                };

                if (index === 0) {
                  pinStyle.width = 190;
                  pinStyle.height = 190;
                  pinStyle.filter = 'drop-shadow(0 0 8px #007bff)';
                } else if (index === 1) {
                  pinStyle.width = 150;
                  pinStyle.height = 150;
                  pinStyle.filter = 'drop-shadow(0 0 8px #007bff)';
                } else if (index === 2) {
                  pinStyle.width = 130;
                  pinStyle.height = 130;
                  pinStyle.filter = 'drop-shadow(0 0 8px #007bff)';
                }else if (index === 3) {
                  pinStyle.width = 90;
                  pinStyle.height =90;
                  pinStyle.filter = 'drop-shadow(0 0 8px #007bff)';
                }else if (index === 4) {
                  pinStyle.width = 70;
                  pinStyle.height = 70;
                  pinStyle.filter = 'drop-shadow(0 0 8px #007bff)';
                }else if (index === 5) {
                  pinStyle.width = 60;
                  pinStyle.height = 60;
                  pinStyle.filter = 'drop-shadow(0 0 8px #007bff)';
                }else if (index === 6) {
                  pinStyle.width = 50;
                  pinStyle.height = 50;
                  pinStyle.filter = 'drop-shadow(0 0 8px #007bff)';
                }

                return (
                  <OverlayTrigger
                    key={index}
                    placement="top"
                    overlay={<Tooltip>{item.description}</Tooltip>}
                  >
                    <OverlayTrigger
                      trigger="click"
                      rootClose
                      show={isActive}
                      placement="top"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">{item.step}</Popover.Header>
                          <Popover.Body>{item.description}</Popover.Body>
                        </Popover>
                      }
                    >
                      <img
                        src={pin}
                        alt={`Step ${index + 1}`}
                        onClick={() => setActivePin(index === activePin ? null : index)}
                        style={pinStyle}
                      />
                    </OverlayTrigger>
                  </OverlayTrigger>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default Roadmap;
