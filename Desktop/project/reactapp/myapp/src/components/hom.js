import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("username") !== null;

    // If the user is not logged in, navigate to the login page
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [history]);

  const handleLogout = () => {
    // Clear the registration data from localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    // Navigate to the login page
    history.push("/login");
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Welcome to the home page!</h2>
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '10px',
          marginTop: '20px',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;