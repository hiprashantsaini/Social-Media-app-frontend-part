import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import GoogleButton from 'react-google-button';
import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import './login.css';
const Login = () => {

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [verifiedCapcha,setVerifiedCaptcha]=useState(false);
    const [captchaError, setCaptchaError] = useState(false);
    const [sendingStatusEmail, setSendingStatusEmail] = useState(false);

    // useContext hook 
    const {userInfo,setUserInfo,isAuthenticated,setIsAuthenticated,setPlanInfo,lang}=useContext(AppContext);

   const content=langContent[lang] || langContent['en'];

    const navigate = useNavigate();

    const onChange = (value) => {
        if (value) {
            setVerifiedCaptcha(true);
            setCaptchaError(false);
        }
    };

    const handleRecaptchaError = () => {
        setVerifiedCaptcha(false);
        setCaptchaError(true);
        toast.error('Captcha error');
    };

    // Login user With login form
    const loginUser = async (e) => {
        e.preventDefault();
        try {
            if(!verifiedCapcha){
                toast.error(`${content.login.alerts.recapcha}`)
                return;
            }
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/login', { email, phone, password });
            if (!res.data.status && !res.data.deviceOtp) {
                toast.error(`${res.data.message}`)
                return;
            }
            if (!res.data.status && res.data.deviceOtp) {
                setSendingStatusEmail(true);
                toast(`${res.data.message}`)
                return;
            }
            document.cookie =`token=${res.data?.token}`;
            // sessionStorage.setItem('token',res.data?.token);
            setUserInfo(res);
            setIsAuthenticated(true);
            alert(`${content.login.alerts.login_success}`)
            setEmail('')
            setPhone('')
            setPassword('')
            setVerifiedCaptcha(false);
            const plans = res.data.user?.subscription.filter((item) => item.isActive === true);
            setPlanInfo(plans);
            localStorage.setItem('token',res.data?.token);
            navigate('/home');
        } catch (error) {
            if(error.response.status === 403){
                toast.error(`${content.login.alerts.mobile_access_time}`)
            }else{
                toast.error(`${content.login.alerts.login_error}`);
            }
        }
    }

    // Login user With login form and device verification
    const againLoginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/verify-otp', { otp, email, phone, password });

            setSendingStatusEmail(false);
            if (!res.data.status && !res.data.deviceOtp) {
             toast.error(`${res.data.message}`)
                return;
            }
            if (!res.data.status && res.data.deviceOtp) {
                toast.error(`${res.data.message}`);
                return;
            }
            document.cookie=`email:${res.data?.token}`
            // sessionStorage.setItem('token',res.data?.token);

            const plans=res.data.user?.subscription.filter((item)=> item.isActive=== true);
            setPlanInfo(plans);
            
            setUserInfo(res);
            setIsAuthenticated(true);

            alert(`${content.login.alerts.login_success}`)
            setEmail('')
            setPhone('')
            setPassword('')
            setVerifiedCaptcha(false);
            localStorage.setItem('token',res.data?.token);
            navigate('/home');
        } catch (error) {
            setSendingStatusEmail(false);
            
            toast.error(`${content.login.alerts.login_error}`);
        }
    }



    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                const { code } = codeResponse;
                if (code) {
                    const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/google', { code })
                    setUserInfo(res);
                    setIsAuthenticated(true);
    
                    const plans = res.data.user?.subscription.filter((item) => item.isActive === true);
                    setPlanInfo(plans);
                    document.cookie=`email:${res.data?.token}`
                    // sessionStorage.setItem('token',res.data?.token);
                    localStorage.setItem('token',res.data?.token);

                    alert(`${content.login.alerts.login_success}`)
                    return navigate('/home');
                } else {
                    console.log('No authorization code received.');
                }
            } catch (error) {
                toast.error(`${content.login.alerts.login_error}`);
            }

        },
        onError: (error) => console.log('Login Failed:', error),
        flow: 'auth-code', // Specify the authorization code flow
    });


    return (
        <div id='login'>
            <ToastContainer/>
            <div className='login-body'>
                <div className='login-form'>
                    <form onSubmit={loginUser}>
                        <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <h3>OR</h3>
                        <p> {content.login.phone_placeholder}</p>
                        <PhoneInput
                            country='in'
                            className="phone-button"
                            onChange={(value) => setPhone(value)}
                        />
                        <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={onChange}
                            onErrored={handleRecaptchaError}
                            onExpired={handleRecaptchaError}
                        />

                        {
                            sendingStatusEmail ? <>
                                <input type='text' placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)} required />

                                <button className='submit-button' onClick={againLoginUser}>Login</button>
                            </> :
                                <button type='submit' className='submit-button'>{content.login.login}</button>
                        }
                    </form>
                    <h2>OR</h2>
                    <GoogleButton
                        style={{
                            width: "94%",
                            margin: "10px 0px",
                            borderRadius: "5px"
                        }}
                        onClick={login}
                    />
                    <p><Link to={'/signup'}>{content.login.donthave}</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;



