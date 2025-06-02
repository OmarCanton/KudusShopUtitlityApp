import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import '../ResetPassword/ResetPassword.css'

export default function ResetPassword() {
    const [newPassword, setPassword] = useState('')
    const [confNewPassword, setConfPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfPassword, setShowConfPassword] = useState(false) 
    const { token } = useParams()
    const navigate = useNavigate()


    const resetPassword = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reset-password/${token}`, { newPassword, confNewPassword })
            toast.success(response.data.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }, 
                duration: 5000
            })
            navigate('/auth/signin')
        } catch(err) {
            console.log(err)
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        }
    }
    const showPasswordFunc = () => {
        setShowPassword((showPassword) => !showPassword)
    }

    const showConfPasswordFunc = () => {
        setShowConfPassword((showConfPassword) => !showConfPassword)
    }

    return (
        <div className="resetWrapper">
            <form 
                style={{boxShadow: '0 5px 10px -3px black'}}
                onSubmit={resetPassword}
            >
                <h2>Reset Password</h2>
                <div className='pass'>
                    <input autoFocus type={ showPassword ? 'text' : 'password' } name="password" id="password" placeholder='Enter new Password' onChange={(e) => setPassword(e.target.value) } />
                    <span className='child2' onClick={showPasswordFunc}>
                        { showPassword ? 
                            <FaRegEye htmlColor='grey' style={{cursor: 'pointer'}} /> 
                            : 
                            <FaRegEyeSlash htmlColor='#1D2671' style={{cursor: 'pointer'}}  /> 
                        }
                    </span>
                </div>
                <div className='pass2'>
                    <input type={ showConfPassword ? 'text' : 'password' } name="confPassword" id="confPassword" placeholder='Confirm Password' onChange={(e) => setConfPassword(e.target.value) } />
                    <span className='child2' onClick={showConfPasswordFunc}>
                        { showConfPassword ? 
                            <FaRegEye htmlColor='grey' style={{cursor: 'pointer'}} /> 
                            : 
                            <FaRegEyeSlash htmlColor='#1D2671' style={{cursor: 'pointer'}} />
                        }
                    </span>
                </div>
                <button onClick={resetPassword}>Reset</button>
            </form>
        </div>
    )
}