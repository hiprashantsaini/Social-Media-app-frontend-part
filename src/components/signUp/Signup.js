import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import GoogleButton from 'react-google-button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import './signup.css';
const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [emailOtpRequest, setEmailOtpRequest] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [sendingStatusEmail, setSendingStatusEmail] = useState(false);
    const [verifyEmailStatus,setVerifyEmailStatus]=useState(0);// 0->nothing ,1->verifying ,2->Verification Done
    // const [emailOtpText,setEmailOtpText]=useState('Send email Otp');
    const [phoneOtpRequest, setPhoneOtpRequest] = useState(false);
    const [phoneOtp, setPhoneOtp] = useState('');
    const [sendingStatusPhone, setSendingStatusPhone] = useState(false);
    const [verifyPhoneStatus,setVerifyPhoneStatus]=useState(0);
    const [password, setPassword] = useState('');

    const {lang,setUserInfo,setIsAuthenticated,setPlanInfo}=useContext(AppContext);

    const navigate = useNavigate();
    const content=langContent[lang] || langContent['en'];
    // send email otp 
    const sendEmailOtp = async (e) => {
        e.preventDefault();
        setSendingStatusEmail(true);
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/send-emailotp', { email });
            if (res) {
                toast(`${content.sign_up.alerts.send_email}`);
                setSendingStatusEmail(false);
                setEmailOtpRequest(true);
            } else {
                toast.error(`${content.sign_up.alerts.alert_error}`)
                setSendingStatusEmail(false);
            }

        } catch (error) {
            setSendingStatusEmail(false);
            toast.error(`${error.message}`)
        }
    }

    // verify email otp
    const verifyEmailOtp=async(e)=>{
        e.preventDefault();
        setVerifyEmailStatus(1);
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/signup-verifyOtp', { email,emailOtp });
            if (res.data.verified) {
                setVerifyEmailStatus(2);
                toast(`${content.sign_up.alerts.done_verify}`);
            } else {
                toast.error(`${content.sign_up.alerts.alert_error}`)
                setVerifyEmailStatus(0);
            }

        } catch (error) {
            setVerifyEmailStatus(0);
            toast.error(`${error.message}`)
        }
    }

    // send Phone otp 
    const sendPhoneOtp = async (e) => {
        e.preventDefault();
     
        setSendingStatusPhone(true);
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/send-phoneotp', { phone });
          
            if (res) {
                toast(`${content.sign_up.alerts.send_phone}`);
                setSendingStatusPhone(false);
                setPhoneOtpRequest(true);
            } else {
                toast.error(`${content.sign_up.alerts.alert_error}`)
                setSendingStatusPhone(false);
            }

        } catch (error) {
            setSendingStatusPhone(false);
            toast.error(`${error.message}`)
        }
    }

      // verify phone otp
    const verifyPhoneOtp=async(e)=>{
        e.preventDefault();
        setVerifyPhoneStatus(1);
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/signup-verifyPhoneOtp', { phone,phoneOtp });
            if (res.data.verified) {
                setVerifyPhoneStatus(2);
             
                toast(`${content.sign_up.alerts.done_verify}`);
            } else {
                toast.error(`${content.sign_up.alerts.invalid_otp}..`)
                setVerifyPhoneStatus(0);
            }

        } catch (error) {
            setVerifyPhoneStatus(0);
            toast.error(`${error.message}`)
        }
    }


    //register OR signup user
    const signupUser=async(e)=>{
        e.preventDefault();
        try {
            if(verifyEmailStatus!==2){
                toast(`${content.sign_up.alerts.verify_email}`)
                return;
            }
            if(verifyPhoneStatus!==2){
                toast(`${content.sign_up.alerts.verify_phone}`)
                return;
            }

            const res=await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/signup',{name,email,phone,password});
            if(res){
                toast(`${content.sign_up.alerts.register_success}`);
                setVerifyEmailStatus(0)
                setVerifyPhoneStatus(0)
                setEmailOtpRequest(false)
                setPhoneOtpRequest(false)
                setName('');
                setEmail('')
                setPassword('')
                navigate('/login');
                return
            }
            setVerifyEmailStatus(0)
            setVerifyPhoneStatus(0)
            setEmailOtpRequest(false)
            setPhoneOtpRequest(false)
            setName('');
            setEmail('')
            setPassword('')
            toast.error(`${content.sign_up.alerts.tryagain}`);

        } catch (error) {
            toast.error(`${content.sign_up.alerts.alert_error}`);
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

    const sendButtonColor = {
        backgroundColor: "var(--plan2-head-background)"
    }

    const verifyButtonColor = {
        backgroundColor: "var(--verifyOtp-background)"
    }

    return (
        <div id='signup'>
            <ToastContainer/>
            <div className='signup-body'>
                <div className='signup-form'>
                    <form onSubmit={signupUser}>
                        <input type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type='submit' className='sendOtp-button' onClick={sendEmailOtp} style={emailOtpRequest ? sendButtonColor : {}}>{content.sign_up.send_email}</button>

                        {
                            sendingStatusEmail ? <p>{content.sign_up.sending} ...</p> : ''
                        }

                        {
                            emailOtpRequest ? <>
                                <input type='text' placeholder='Enter email OTP' value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} required />

                                {
                                    verifyEmailStatus===1?<p>{content.sign_up.verifying}...</p>:''
                                }
                                <button type='submit' className='verifyOtp-button' onClick={verifyEmailOtp} style={(verifyEmailStatus===2) ? verifyButtonColor : {}}>{content.sign_up.veriy_emailOtp}</button>
                            </> :
                                ''
                        }
                        <PhoneInput
                            country='in'
                            className="phone-button"
                            onChange={(value) => setPhone(value)}
                            required
                        />
                        <button type='submit' className='sendOtp-button' onClick={sendPhoneOtp} style={phoneOtpRequest ? sendButtonColor : {}}>{content.sign_up.send_phone}</button>

                        {
                            sendingStatusPhone?<p>{content.sign_up.sending} ...</p> : ''
                        }

                        {
                            phoneOtpRequest ? <>
                                <input type='text' placeholder='Enter phone OTP' value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} required />
                                <button type='submit' className='verifyOtp-button' onClick={verifyPhoneOtp} style={(verifyPhoneStatus===2) ? verifyButtonColor : {}}>{content.sign_up.verify_phone}</button>
                            </> :
                                ''
                        }
                        <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type='submit' className='submit-button'>{content.sign_up.signup}</button>
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
                    <p><Link to={'/login'}>{content.sign_up.have_account}?</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup;
