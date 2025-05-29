    import axios from 'axios';
    import React, { useState } from 'react';
    import { Link, useNavigate } from "react-router-dom";
    import { API_BASE_URL } from '../data/data';

    const Login = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();
    
        const handleLogin = async (e) => {
            e.preventDefault();
    
            // Validate email and password
            if (!email) {
                setError('Please enter a valid email');
                return;
            }
            if (!password) {
                setError('Please enter the password');
                return;
            }
    
            setError("");
            setLoading(true);
    
            try {
                const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
                if (response.data) {
                    navigate("/");
                   
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } finally {
                setLoading(false); // Set loading to false after the login process is complete
            }
        };
    return (
        <div>
        <div className='w-full flex items-center justify-center p-10'>
        <div className='w-full max-w-md border rounded bg-white px-7 py-10 shadow-md'>
            <form onSubmit={handleLogin}>
                <div className='w-54 h-24 flex items-center justify-center mx-auto mb-6'>
                    <h3>Welcome to
                    </h3>
                </div>
          
            <input
                type="text"
                placeholder='Email'
                className='input-box w-full mb-4 p-3 border rounded'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type='password'
                value={password}
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                className='w-full mb-4 p-3 border rounded'
            />
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type="submit" className='btn-primary w-full p-3 bg-backgroundButton text-white rounded mt-4'>
                Login
            </button>
            <p className='text-sm text-center mt-4'>
                Not registered yet?{" "}
                <Link to="/createnew" className="font-medium text-primary underline">Create an Account</Link>
            </p>
            </form>
        </div>
        </div>
        </div>
    )
    }

    export default Login
