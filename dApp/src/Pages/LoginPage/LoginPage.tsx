import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

const LoginPage: React.FC = () => {
  const [JMBG, setJMBG] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const data = {
    id: JMBG,
    password: password
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json()
        if (data.message === "ERROR") {
          console.error('ERROR: Wrong credentials!')
          alert("Wrong JMBG or password")
        } else {
          if(data.role === 1)
            navigate('/admin')
          else
            navigate('/voter')
        }
      }
    } catch (error) {
      console.error('There was an error:', error);
      alert("ERROR: This voter doesn't exist")
    }

    // console.log('JMBG: ', JMBG)
    // console.log('Password: ', password)
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'azure' }}>
        Decentralized Voting System
      </h1>
      <div className="container mt-5">
        <h1>Login</h1>
        <form id="loginForm">
          <div className="form-group">
            <label htmlFor="voter-id">
              <h3>JMBG</h3>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="JMBG"
              value={JMBG}
              onChange={(e) => setJMBG(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <h3>Password</h3>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="elem-padding">
            <button type="submit" className="btn btn-primary" onClick={handleLogin}>
                <b>Login</b>
            </button>
            <button type="submit" className="btn btn-primary" onClick={() => navigate('/register')}>
                <b>Register</b>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;