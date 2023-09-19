import React, { useState } from "react";

const RegistrationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // - Add your registration logic here
    // - Typically, you'd send a request to your backend
    // for user registration
    // - Once registration is successful, you can close
    // the form using onClose()
    // console.log("Form data submitted:", formData);
  };

  return (
    <div className="registration-form">
      {/* Add your form elements here */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className="form-button">
            Register
          </button>
          <button onClick={onClose} className="form-button">
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
