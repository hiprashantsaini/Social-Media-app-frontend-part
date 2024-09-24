import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from "../context/AppContext";
import { langContent } from "../languagesText";
import Blog from "./blog/Blog";
import TopExpandedBlog from "./blog/TopExpandedBlog";
const Body = () => {
    const [expandBlogId, setExpandBlogId] = useState('');
    const { userInfo,posts,setPosts,flag,lang} = useContext(AppContext);
    // const [posts, setPosts] = useState([]);
    const [addedComment,setAddedComment]=useState('');
    const content=langContent[lang] || langContent['en'];


    const getAllPosts = async () => {
        try {
            const allPosts = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/getposts', { userId: userInfo.data?.user?._id });
            setPosts(allPosts.data.posts)
        } catch (error) {
            toast.error(`${content.postcard.alerts.error_post}`);
        }
    }
    useEffect(() => {
        getAllPosts();
    }, [userInfo,addedComment])

    return (
        <div className="body">
            <div className="blogContainer">
                <ToastContainer/>
                <div className="feed" id="feed">
                    {
                        expandBlogId ? <TopExpandedBlog posts={posts} expandBlogId={expandBlogId} setExpandBlogId={setExpandBlogId} setAddedComment={setAddedComment} /> : ''
                    }
                    {
                        posts.map((post) =>
                            <Blog
                                post={post}
                                expandBlogId={expandBlogId}
                                setExpandBlogId={setExpandBlogId}
                                key={post._id}
                                userId={userInfo.data?.user?._id} />
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Body;