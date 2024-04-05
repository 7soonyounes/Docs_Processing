import React, { useState } from 'react';
import bpgris from '../assets/bpgris.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
      <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <img src={bpgris} alt="Logo" style={{ maxWidth: '70%', height: 'auto' }} />
        </div>
        <div>
          <h2 style={{ textAlign: 'center' }}></h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontSize: '1em', fontWeight: 'bold', color :'#51514f' }}>Username</label>
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
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontSize: '1em', fontWeight: 'bold', color :'#51514f' }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#51514f', fontSize: '1em', fontWeight: 'bold', color :'#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Login</button>
            {/* <a href="/images"style={{ width: '100%', padding: '10px', backgroundColor: '#51514f', fontSize: '1em', fontWeight: 'bold', color :'#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} >Login</a> */}
          </form>
        </div>
      </div>
  );
}

export default Login;
