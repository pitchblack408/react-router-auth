import React, {useRef} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const Register = () => {
  const registerForm = useRef(null)
  const {registerUser} = useAuth()

  const handleSubmit = (e: any) => {
      e.preventDefault()
      if (!registerForm.current) {
          // Handle the case where registerForm.current is null or undefined
          return;
      }
      const { name, email, password1, password2 } = registerForm.current;

      // Ensure that all properties exist before accessing their values
      if (!name || !email || !password1 || !password2) {
          // Handle the case where any property is null or undefined
          return;
      }
      if(password1 !== password2){
        alert('Passwords did not match!')
        return 
      }
      const userInfo = {name, email, password1, password2}
      registerUser(userInfo)
}

  return (
    <div className="container">
      <div className="login-register-container">
        <form ref={registerForm} onSubmit={handleSubmit}>

        <div className="form-field-wrapper">
              <label>Name:</label>
              <input 
                required
                type="text" 
                name="name"
                placeholder="Enter name..."
                />
          </div>

          <div className="form-field-wrapper">
              <label>Email:</label>
              <input 
                required
                type="email" 
                name="email"
                placeholder="Enter email..."
                />
          </div>

          <div className="form-field-wrapper">
              <label>Password:</label>
              <input 
                type="password"
                name="password1" 
                placeholder="Enter password..."
                autoComplete="password1"
                />
          </div>

          <div className="form-field-wrapper">
              <label>Confirm Password:</label>
              <input 
                type="password"
                name="password2" 
                placeholder="Confirm password..."
                autoComplete="password2"
                />
          </div>


          <div className="form-field-wrapper">

              <input 
                type="submit" 
                value="Register"
                className="btn"
                />

          </div>

        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>

      </div>
  </div>
  )
}

export default Register
