import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import  { toast } from 'react-hot-toast'
import { motion }  from 'framer-motion'
import '../VerifyOTP/VerifyOTP.css'
import { CircularProgress } from '@mui/material'

export default function VerifyOTP() {
    const [otpCode, setOTPCode] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [sendingOTP, setSendingOTP] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const initialTime = 300
    const [timeLeft, setTimeLeft] = useState(initialTime)
    const [isVerifyButtonEnabled, setIsButtonAEnabled] = useState(true)
    const [isResendButtonEnabled, setIsButtonBEnabled] = useState(false)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    
    const verifyOTPCode = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register-verify-code/${id}`, { otpCode })
            toast.success(response?.data?.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
            // localStorage.removeItem('utility_user_id')
            navigate('/')
        } catch(err) {
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        } finally {
            setSubmitting(false)
        }
    }

    const resendOTP = async () => {
        setSendingOTP(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/resend-code/${id}`)
            toast.success(response?.data?.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
            setTimeLeft(initialTime)
            setIsButtonAEnabled(true)
            setIsButtonBEnabled(false)
        } catch (err) {
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        } finally {
            setSendingOTP(false)
        }
    }

  
    const min = Math.floor(timeLeft / 60).toString().padStart(2, 0)
    const minRem = Math.floor(timeLeft % 60)
    const secs = minRem.toString().padStart(2, 0)

    useEffect(() => {
        let intervalId
        if (isTimerRunning && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000);
        }
        setIsTimerRunning(true);
        if(timeLeft <= 0) {
            setIsButtonAEnabled(false)
            setIsButtonBEnabled(true)
            setIsTimerRunning(false)
        } else {
            setIsButtonAEnabled(true)
        }
    
        return () => clearInterval(intervalId)
    }, [isTimerRunning, timeLeft])


    return (
        <div className="verify-wrapper">
            <motion.div 
                className="main"
                initial={{y: '10%', opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: '10%', opacity: 0}}
                transition={{duration: 0.15}}
            >
                <div className="header-verify">Verify Code</div>
                <div className="form-verify">
                    <form onSubmit={verifyOTPCode}>
                        <label htmlFor="OTP">Enter the code sent to your Email</label>
                        <input 
                            type="text" 
                            value={otpCode} 
                            name="code" 
                            id="OTP"
                            disabled={!isVerifyButtonEnabled}
                            max={6}
                            onChange={(e) => setOTPCode(e.target.value)}
                        />
                        <button disabled={!isVerifyButtonEnabled}>
                            {submitting ? 
                                <CircularProgress style={{width: 25, height: 25, color: 'rgb(7, 141, 252)'}} />
                                :
                                <p>Verify</p>
                            }
                        </button>
                    </form>
                    <div className="timer">
                        <p>Code expires in: </p>
                        <span>{min}:{secs}</span>
                        <button 
                            disabled={!isResendButtonEnabled}
                            onClick={resendOTP}
                        >
                            {sendingOTP ? 
                                <CircularProgress className="spinner" style={{width: 25, height: 25, color: 'rgb(7, 141, 252)'}} />
                                : 
                                <pre>Resend</pre>
                            }
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}