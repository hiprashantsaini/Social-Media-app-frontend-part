import axios from "axios";
import { useContext, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import langs from "../utils/languages";

const ProtectedRoute = () => {
    const { userInfo, lang, setLang, setToken, setUserInfo, userInfoFlag, isAuthenticated, setIsAuthenticated, setPostIdFromSearchUrl, setPlanInfo } = useContext(AppContext);
    // Get the current URL
    const navigate = useNavigate();
    const currentUrl = window.location.href;
   
    // Extract query parameters
    const url = new URL(currentUrl); // It create url object
    const params = new URLSearchParams(url.search);//It extracts seach parameters
    const postId = params.get('postId')
    if (postId) {
        setPostIdFromSearchUrl(postId);
    }

    const checkToken = async () => {
        try {
            function getCookie(name) {
                return 'cookie:', document?.cookie?.split(';')?.find(row => row.includes('token='))?.split('=')[1]

            }
            const cookietoken = getCookie('token');
            const localtoken = localStorage.getItem('token')

            const token = localtoken || cookietoken;
            if (token) {
                const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/verifyToken', { token: token })

                if (res) {
                    setIsAuthenticated(true);
                    setUserInfo(res);
                    setToken(token);
                    setLang(res.data?.user?.language);

                     ////Change theme according to language
                    // Remove all previous attributes
                    const bodyAttributes = document.body.attributes;
                    for (let i = 0; i < bodyAttributes.length; i++) {
                        document.body.removeAttribute(bodyAttributes[i].name)
                    }
                    const body2Attributes = document.body.attributes;
                    let selectedLang = res.data?.user?.language;
                    let attribute = langs[0][selectedLang];
                    document.body.setAttribute(attribute.themeKey, attribute.themeValue)
                    /////


                    // set plan detail.
                    const plans = res.data.user?.subscription.filter((item) => item.isActive === true);
                    setPlanInfo(plans);

                    return navigate('/home');
                }
            }

        }
        catch (error) {
            console.log("Token is expired or not present");
        }
    }


    useEffect(() => {
        checkToken()
    }, [userInfoFlag])


    return (
        <>
            {
                isAuthenticated ? <Outlet /> : <Navigate to='/login' />

            }
        </>
    )
}

export default ProtectedRoute;
