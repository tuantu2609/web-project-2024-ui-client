import React, { useState } from 'react';
import '../App.css';

const Log = () => {
    const [message, setMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý đăng nhập ở đây, ví dụ gửi request đến server
        // Nếu có lỗi, hãy gọi setMessage để hiển thị thông báo lỗi
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
                {/* <header>
                    <a href="/" className="logo">
                        <img src="logo.jpg" alt="web logo" style={{width : "40px", height :"40px" }} />
                    </a>
                </header> */}

                <div className="wrapper">
                    <div className="form-box login">
                        <h1>Log In</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="input-box">
                                <i className='bx bxs-user-circle'></i>
                                <input type="text" id="name" name="name" required />
                                <label>Username</label>
                            </div>

                            <div className="input-box">
                                <i className='bx bx-lock'></i>
                                <input type="password" id="password" name="password" required />
                                <label>Password</label>
                                {message && (
                                    <div className="error-message">
                                        <h5 className="alert alert-danger mt-2">{message}</h5>
                                    </div>
                                )}
                            </div>

                            <div className="remember-forgot">
                                <label><input type="checkbox" /> Remember me </label>
                                <a href="#">Forgot password?</a>
                            </div>

                            <button type="submit" className="btn">Login</button>

                            <div className="login-register">
                                <p>Don't have an account? <a href="/register" className="register-link">Sign Up</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Log;
