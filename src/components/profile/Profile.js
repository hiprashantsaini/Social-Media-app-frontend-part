import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import langs from '../../utils/languages';
import './profile.css';
import ProfilePost from './ProfilePost';
const Profile = () => {
    const [postFlag, setPostFlag] = useState(false);
    const [userFlag, setUserFlag] = useState(false);
    const [newLang, setNewLang] = useState('');
    const [otpStatus, setOtpStatus] = useState(false);
    const [otp, setOtp] = useState('');

    const { setPlanInfo, token, lang, setLang, userInfo, planInfo, setUserInfo, posts, setPosts } = useContext(AppContext);
    const content = langContent[lang] || langContent['en'];

    const userPosts = posts.filter((post) => post?.author?._id === userInfo.data?.user?._id)



    const findUserInfo = async () => {
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/verifyToken', { token: token })
            if (res) {
                setUserInfo(res);
                // set plan detail.
                const plans = res.data.user?.subscription.filter((item) => item.isActive === true);
                setPlanInfo(plans);
                return;
            }
        } catch (error) {
            console.log("Token is expired or not present");
        }
    }

    const getAllPosts = async () => {
        try {
            const allPosts = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/getposts', { userId: userInfo.data?.user?._id });
            
            setPosts(allPosts.data.posts)
        } catch (error) {
            toast.error(`${content.profile.not_found}`);
        }
    }
    useEffect(() => {
        getAllPosts();
    }, [postFlag])

    useEffect(() => {
        findUserInfo();
    }, [userFlag])

    ////Handle language change.

    const handleLanguageChange = async (e) => {
        e.preventDefault();
        try {

            if (otp === '') {
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
            await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/changelanguage', { userId: userInfo.data.user?._id, language: newLang });
            setLang(newLang);
            setUserFlag(!userFlag);
            // Remove all previous attributes
            const bodyAttributes = document.body.attributes;
            for (let i = 0; i < bodyAttributes.length; i++) {
                document.body.removeAttribute(bodyAttributes[i].name)
            }
            const body2Attributes = document.body.attributes;
            
            let selectedLang = newLang;
            let attribute = langs[0][selectedLang];

            document.body.setAttribute(attribute.themeKey, attribute.themeValue);
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


    return (
        <div className="profile-container">
            <header className="profile-header">
                <ToastContainer />
                <h1>{content.profile.your_profile}</h1>
                <nav className='profile-nav'>
                    <li><Link to="/home">{content.profile.nav.home}</Link></li>
                    <li><a href='#details'>{content.profile.nav.details}</a></li>
                    <li><a href='#rewards'>{content.profile.nav.rewards}</a></li>
                    <li><a href='#subscription'>{content.profile.nav.subs}</a></li>
                    <li><a href='#language'>{content.profile.nav.langs}</a></li>
                    <li><a href='#posts'>{content.profile.nav.posts}</a></li>

                </nav>
            </header>
            <div className="profile-body">
                <div className='section' id="details">
                    <h2>{content.profile.heading2}</h2>
                    <p><strong>{content.profile.name}:</strong> {userInfo?.data?.user?.name}</p>
                    <p><strong>{content.profile.email}:</strong> {userInfo?.data?.user?.email}</p>
                    <p><strong>{content.profile.phone}:</strong> +{userInfo?.data?.user?.phone}</p>
                </div>

                <div className='section' id='rewards'>
                    <h2>{content.profile.heading3}</h2>
                    <p><strong>{content.profile.points}:</strong> {userInfo.data.user.points}</p>
                    <p><strong>{content.profile.followers}:</strong> {userInfo.data.user.followers.length}</p>
                    <p><strong>{content.profile.followed}:</strong> {userInfo.data.user.followed.length}</p>
                </div>
                <div className='section' id='subscription'>
                    <h2>{content.profile.subs_plan}</h2>
                    <p><strong>{content.profile.free_plan}:</strong>{content.profile.always_active}</p>
                    {
                        planInfo.map((plan) => <p key={plan._id}><strong>{plan.planId.name}:</strong> {plan.planId.postLimit} posts/day. End Date {plan.endDate}</p>)
                    }
                    <p><Link to={"/subscription"}>{content.profile.other_plan}</Link></p>
                </div>
                <div className='section' id='language'>
                    <h2>{content.profile.heading4}</h2>
                    <select value={lang} onChange={(e) => {
                        setNewLang(e.target.value);
                        handleLanguageChange(e);
                    }} id='language-select'>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                        <option value="pt">Portuguese</option>
                        <option value="ta">Tamil</option>
                        <option value="bn">Bengali</option>
                        <option value="fr">French</option>
                    </select>
                    <div className={!otpStatus ? 'profile-otpVerify' : 'profile-otpVerify active-otp'}>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='Enter OTP' /><br />
                        <button onClick={handleLanguageChange}>Verify</button>
                    </div>
                </div>
                <div className='section' id='posts'>
                    <h2>{content.profile.nav.posts}</h2>
                    <div className='post-container'>
                        {
                            userPosts.map((post) => <ProfilePost post={post} key={post._id} postFlag={postFlag} setPostFlag={setPostFlag} userFlag={userFlag} setUserFlag={setUserFlag} />)
                        }

                    </div>
                </div>

            </div>
        </div>
    )
}




export default Profile;