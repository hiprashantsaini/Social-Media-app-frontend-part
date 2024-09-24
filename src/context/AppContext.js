import { createContext, useState } from "react";

export const AppContext=createContext();

const ContextProvider=(props)=>{
    const [userInfo,setUserInfo]=useState(null);
    const [isAuthenticated,setIsAuthenticated]=useState(false);
    const [lang,setLang]=useState('en');
    const [planInfo,setPlanInfo]=useState([]);
    const [posts, setPosts] = useState([]);
    const [token,setToken]=useState('');

    //postId of the post Url that was shared.
    const [postIdFromSearchUrl,setPostIdFromSearchUrl]=useState('');
    //when like,follow then refetch the userInfo. As you like/follow just change it. true-false-true-false in protectedRoute.js
    const [userInfoFlag,setUserInfoFlag]=useState(true);
    return(
        <AppContext.Provider value={{token,setToken,userInfo,posts,setPosts,setUserInfo,isAuthenticated,setIsAuthenticated,lang,setLang,postIdFromSearchUrl,setPostIdFromSearchUrl,userInfoFlag,setUserInfoFlag,planInfo,setPlanInfo}}>
            {props.children}
        </AppContext.Provider>
    )
}

export default ContextProvider;