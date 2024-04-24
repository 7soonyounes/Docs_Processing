import React, { useState } from 'react';
import axios from 'axios';
import bpgris from '../assets/bcplogo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: isHovered ? '#f26413' : '#51514f',
    fontSize: '1em',
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username: username,
        password: password
      });
      if (response.status === 200) {
        window.location.href = "/Accueil";
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ background: '#fff', maxWidth: '300px', margin: 'auto',marginLeft: '450px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <img src={bpgris} alt="Logo" style={{ maxWidth: '45%', height: 'auto' }} />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontSize: '1em', color :'#51514f' }}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontSize: '1em', color :'#51514f' }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <button
  type="submit"
  style={buttonStyle}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  Login
</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
