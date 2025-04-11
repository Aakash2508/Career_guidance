import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Button } from "react-bootstrap";

function UserInfoHeader() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:5000/user", { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          navigate("/"); // Redirect if not authenticated
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
    navigate("/");
  };

  return (
    <Navbar bg="light" className="mb-3">
      <Container>
        {user && (
          <span>
            Welcome, <strong>{user.full_name}</strong> ({user.role}) - {user.email}
          </span>
        )}
        <Button variant="danger" onClick={handleLogout} className="ms-auto">
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default UserInfoHeader;
