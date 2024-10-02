import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {}

const RegisterPage = (props: Props) => {
  const [JMBG, setJMBG] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');

  const navigate =  useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      id: JMBG,
      name: name,
      lastname: lastname,
      email: email,
      password: password,
      role: 0
    };

    try {
      // Send POST request to FastAPI
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Handle response
      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        if (data.message === "ERROR")
          console.error('ERROR: You are already registered to vote!');
        else
          navigate('/');
      }
    } catch (error) {
      console.error('There was an error:', error);
    }

    // console.log('JMBG: ', JMBG);
    // console.log('Password: ', password);
    // console.log('name: ', name);
    // console.log('lastname: ', password);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'azure' }}>
        Decentralized Voting System
      </h1>
      <div className="container mt-5">
        <h1>Register</h1>
        <form id="loginForm" onSubmit={handleRegister}>
          <div className="form-group">
            <label>
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
            <label>
              <h3>Name</h3>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              <h3>Lastame</h3>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              <h3>Email</h3>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
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
            <button type="submit" className="btn btn-primary" onClick={handleRegister}>
                <b>Register</b>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage