import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')


  const [forgotPassMode, setForgotPassMode] = useState(false);
  const [otpStage, setOtpStage] = useState(false); // whether OTP was sent
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!otpStage) {
      try {
        const { data } = await axios.post(backendUrl + '/api/user/send-otp', { email });
        if (data.success) {
          toast.success("OTP sent to email");
          setOtpStage(true);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    } else {
      // Verify OTP & Reset Password
      try {
        const { data } = await axios.post(backendUrl + '/api/user/reset-password', {
          email,
          otp,
          newPassword
        });
        if (data.success) {
          toast.success("Password updated. Please login.");
          setForgotPassMode(false);
          setOtpStage(false);
          setOtp('');
          setNewPassword('');
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };



  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === 'Sign Up') {

        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }

  }, [token])


  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>

        {forgotPassMode ? (
          <>
            <p className='text-2xl font-semibold'>Forgot Password</p>
            <p>We'll send you an OTP to reset your password</p>

            <div className='w-full'>
              <p>Email</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            {otpStage && (
              <>
                <div className='w-full'>
                  <p>OTP</p>
                  <input
                    className='border border-zinc-300 rounded w-full p-2 mt-1'
                    type="text"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    required
                  />
                </div>

                <div className='w-full'>
                  <p>New Password</p>
                  <input
                    className='border border-zinc-300 rounded w-full p-2 mt-1'
                    type="password"
                    placeholder="Enter new password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    required
                  />
                </div>
              </>
            )}

            <button
              type='button'
              onClick={handleForgotPassword}
              className='bg-primary text-white w-full py-2 rounded-md text-base'
            >
              {otpStage ? "Reset Password" : "Send OTP"}
            </button>

            <p className="mt-2">
              Back to login?{" "}
              <span
                onClick={() => {
                  setForgotPassMode(false);
                  setOtpStage(false);
                  setOtp('');
                  setNewPassword('');
                }}
                className='text-primary cursor-pointer'
              >
                Click here
              </span>
            </p>
          </>
        ) : (
          <>
            <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
            <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>

            {state === 'Sign Up' && (
              <div className='w-full'>
                <p>Full Name</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
            )}

            <div className='w-full'>
              <p>Email</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className='w-full'>
              <p>Password</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>
              {state === 'Sign Up' ? "Sign Up" : "Log In"}
            </button>

            {state === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span onClick={() => setState('Login')} className='text-primary cursor-pointer'>Login here</span>
              </p>
            ) : (
              <>
                <p>
                  Don't have an account?{" "}
                  <span onClick={() => setState('Sign Up')} className='text-primary cursor-pointer'>Click here</span>
                </p>
                <p className="text-sm text-blue-500 cursor-pointer mt-2" onClick={() => setForgotPassMode(true)}>Forgot Password?</p>
              </>
            )}
          </>
        )}
      </div>
    </form>

  )
}

export default Login