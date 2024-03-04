import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const RegistrationForm = () => {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const register = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return false;
    }

    // Store the registration data in local storage
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert('Registration successful! Now go to the login page.');

    // Navigate to the home page
    history.push('/home');

    return true;
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>
      <form id="registerform" onSubmit={register}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '10px',
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;