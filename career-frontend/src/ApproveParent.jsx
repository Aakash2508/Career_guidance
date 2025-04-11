import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Alert, Button } from "react-bootstrap";

const ApproveParent = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const approveParent = async () => {
      const parentId = searchParams.get("parentId");
      const childId = searchParams.get("childId");

      if (!parentId || !childId) {
        setStatus("Invalid request parameters.");
        return;
      }

      try {
        // Send request to backend API to approve
        const response = await fetch(
          `http://localhost:5000/api/approve-parent?parentId=${parentId}&childId=${childId}`
        );

        if (response.ok) {
          setStatus("Parent successfully linked!");
        } else {
          setStatus("Failed to approve parent-child link.");
        }
      } catch (error) {
        setStatus("Error approving link.");
      }
    };

    approveParent();
  }, [searchParams]);

  return (
    <Container className="mt-5">
      <h2>Parent-Child Link Approval</h2>
      {status ? (
        <Alert variant={status.includes("successfully") ? "success" : "danger"}>
          {status}
        </Alert>
      ) : (
        <p>Processing...</p>
      )}
      <Button variant="primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
    </Container>
  );
};

export default ApproveParent;
