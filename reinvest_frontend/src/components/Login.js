import React, { useState,useEffect} from 'react';
import './Signup.css';
import {Nav,Navbar} from 'react-bootstrap'
import {Container, Row, Col, FormControl, Form, FormGroup, Button} from 'react-bootstrap'
import {Route,Link,BrowserRouter as Router} from "react-router-dom";
import Navb from '../components/Navbar.js';
// JS
// const input = document.getElementById('myText');
// const inputValue = input.value
// React
// value, onChange

const ControlledInputslogin = () => {
  const [person, setPerson] = useState({ email: '', password: ''});
   
//   const handleFirstNameChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setPerson({...person, firstName: value });
//   };

//   const handleLastNameChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setPerson({...person, lastName: value });
//   };

  const handleEmailChange = (e) => {
    const name = e.target.value;
    const value = e.target.value;
    setPerson({...person, email: value });
  };

  const handlePasswordChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPerson({...person, password: value });
  };

  const handleSubmit = (e) => {
      
      console.log(person);
      e.preventDefault();
  }

  return (
    <>
        <Navb/>

        <Container fluid style={{marginTop:"10%"}} >
            <div className='center'>
                <Form class="centeredform" >
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" class="text_field" type="email" placeholder="Enter your email" value={person.email} 
                        onChange={handleEmailChange}
                        required />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" class="text_field" type="password" placeholder="Enter your password" value={person.password}
                        onChange={handlePasswordChange}
                        required/>
                    </Form.Group>
                    <button class="register" variant="primary" type="submit" onClick={handleSubmit}> Submit </button>
                </Form>
            </div>
            <div className='signuptext'>
              <Form.Label>Not a Member?</Form.Label> <Link to="/signup">Sign Up Here</Link>
            </div>
        </Container>
    </>
  );
};

export default ControlledInputslogin;