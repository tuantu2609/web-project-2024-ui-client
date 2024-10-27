import React, { useState } from 'react';
import '../App.css';

const Registration = () => {
    const [message, setMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here, such as sending data to the server
        // If there's an error, call setMessage to display the error message
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: "url('background.jpg') no-repeat center center/cover",
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                

                <div className="regis-wrapper">
                    <div className="form-box register">
                        <h1>Sign Up</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="input-box">
                                <i className='bx bxs-user-circle'></i>
                                <input type="text" id="name" name="name" required />
                                <label htmlFor="name">Username</label>
                            </div>

                            <div className="input-box">
                                <i className='bx bxs-envelope'></i>
                                <input type="email" id="email" name="email" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-box">
                                <i className='bx bx-lock'></i>
                                <input type="password" id="password" name="password" required />
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="input-box">
                                <i className='bx bx-lock'></i>
                                <input type="password" id="passwordConfirm" name="passwordConfirm" required />
                                <label htmlFor="passwordConfirm">Confirm Password</label>
                                {message && (
                                    <div className="error-message">
                                        <h5 className="alert alert-danger mt-2">{message}</h5>
                                    </div>
                                )}
                            </div>

                            <div className="remember-forgot">
                                <label>
                                    <input type="checkbox" required /> I agree to the terms & conditions
                                </label>
                            </div>

                            <button type="submit" className="btn">Sign Up</button>

                            <div className="login-register">
                                <p>
                                    Already have an account? <a href="/login" className="login-link">Log In</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
