import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { AppContext } from "../context/AppContext";
import { langContent } from '../languagesText';
import langs from "../utils/languages";

const Header=()=>{
  const [showMenuIcon,setShowMenuIcon]=useState(true);
  const [otp, setOtp] = useState('');
  const [otpStatus,setOtpStatus]=useState(false);
  const [newLang,setNewLang]=useState('');
  const {lang,setLang,userInfo,userInfoFlag,setUserInfoFlag}=useContext(AppContext);
  const content=langContent[lang] || langContent['en']; 
  const handleLanguageChange=async(e)=>{
    e.preventDefault();
    try {

      if(otp=== ''){
        toast(`${content.createPost.sending_otp}`)
        const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/send-emailotp', { email: userInfo.data?.user?.email });
        if (res) {
          setOtpStatus(true);
          toast(`${content.createPost.sent_otp}`)
          return;
        }
        setOtpStatus(false);
        setOtp('');
        setNewLang('');
        toast.error(`${content.createPost.alerts.otp_problem}`)
        return;
      }

      const res2 = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/signup-verifyOtp', { email: userInfo.data.user.email, emailOtp: otp });
      if (!res2) {
        toast.error(`${content.createPost.alerts.otp_invalid}`);
        setNewLang('');
        setOtp('');
        return;
      }
       await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/changelanguage',{userId:userInfo.data.user?._id, language:newLang});
       setLang(newLang);
       setUserInfoFlag(!userInfoFlag);
       // Remove all previous attributes
       const bodyAttributes=document.body.attributes;
      
       for( let i=0; i<bodyAttributes.length ; i++){
         document.body.removeAttribute(bodyAttributes[i].name)
       }
       const body2Attributes=document.body.attributes;
       
       let selectedLang=newLang;
       let attribute=langs[0][selectedLang];
      
       document.body.setAttribute(attribute.themeKey,attribute.themeValue);
       setOtpStatus(false);
       setOtp('');
       setNewLang('');
    } catch (error) {
       toast.error(`${content.sign_up.alerts.tryagain}`)
       setOtp('')
       setOtpStatus(false);
       setNewLang('');
      

    }
    
  }

    return(
        <div className="header">
          <MenuIcon className={showMenuIcon ? "menu-icon active-menu-icon" : "menu-icon" } onClick={()=>setShowMenuIcon(false)} />
          <div className={showMenuIcon ? "navbar" : "navbar activeNav"}>
              <ul>
                <CloseIcon className='closeMenu-icon' onClick={()=>setShowMenuIcon(true)} style={{left:'10px'}}/>
                <li className="active"><Link to={"/home"}>{content.navbar.home}</Link></li>
                {/* <li><Link to={"/signup"}>Signup</Link></li> */}
                {/* <li><Link to={"/login"}>Login</Link></li> */}
                <li><Link to={"/subscription"}>{content.navbar.premium}</Link></li>
                <li><Link to={"/profile"}>{content.navbar.profile}</Link></li>
              </ul>
          </div>
            <select className="select-langs"  value={lang} onChange={(e)=>{
              setNewLang(e.target.value);
              handleLanguageChange(e);
            }}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="pt">Portuguese</option>
                    <option value="ta">Tamil</option>
                    <option value="bn">Bengali</option>
                    <option value="fr">French</option>
            </select>
            <div className={!otpStatus?'otp-verification':'otp-verification active-otp'}>
              <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder='Enter OTP'/><br/>
              <button onClick={handleLanguageChange}>Verify</button>
            </div>
        </div>
    )
}

export default Header;