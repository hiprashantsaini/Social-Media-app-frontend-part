// import imgBlog from '../../images/client 5.jpg';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import Share from '../share/Share';
import './blog.css';
const Blog = (props) => {
    const [postAuthorId,setPostAuthorId]=useState('');
    const [like,setLike]=useState(false);
    const { userInfo,userInfoFlag,setUserInfoFlag,postIdFromSearchUrl,setPostIdFromSearchUrl,lang} = useContext(AppContext);

    const { post, expandBlogId, setExpandBlogId, userId } = props;
    const content=langContent[lang] || langContent['en'];
    const location=useLocation();
    const handleLike = async () => {
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/likepost', { userId, postId: post._id });
            toast(`${content.postcard.alerts.like_success}`);
            setUserInfoFlag(!userInfoFlag);

        } catch (error) {
            // alert('Something wrong');
            toast.error(`${content.postcard.alerts.post_error}`);

        }
    }

    const handleDisLike = async () => {
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/dislikepost', { userId, postId: post._id });
            toast(`${content.postcard.alerts.dislike_success}`);
            setUserInfoFlag(!userInfoFlag);

        } catch (error) {
            // alert('Something wrong');
            toast.error(`${content.postcard.alerts.post_error}`);
        }
    }
    //see like status at each render
    useEffect(()=>{
        const checkLike=post.likes?.find((like)=>userInfo.data?.user._id === like._id);
        if(checkLike){
            setLike(true);
        }else{
            setLike(false);
        }
    })

    useEffect(()=>{
        if(postIdFromSearchUrl){
            setExpandBlogId(postIdFromSearchUrl);
            setPostIdFromSearchUrl('');
        }
    },[])
    return (
        <div className='tweet'>
            {/* <img alt="" src={imgBlog} /> */}
            <div className="tweet-header">
                <span className="username">{post?.author?.name}</span>
                <span className="timestamp">{post.createdAt}</span>
            </div>
            <div className='tweet-body'>

                {/* if text post then show text in p tag, if video/image then show in p tag. Manage state  */}
                {
                    post?.media?.type === 'text' ?
                        <>
                           <a href='#top-section' style={{textDecoration:'none'}}> <p className='tweet-title' onClick={() => setExpandBlogId(post._id)}>{post.title}</p></a>
                           <a href='#top-section' style={{textDecoration:'none', color:'black'}}><p className='tweet-text'>{post.description}</p></a>
                        </>
                        :
                        post?.media?.type === 'image' ?
                            <>
                                <img src={`${post.media.url}`} className='tweet-img' />
                                {/* <img src={`${post.media.url}`} className='tweet-img' /> */}
                                <a href="#top-section" style={{ textDecoration: 'none' }}><p className='tweet-title' onClick={() => setExpandBlogId(post._id)}>{post.title}</p> </a>
                            </>
                            :
                            post?.media?.type === 'video' ?
                                <>
                                    <video controls className='tweet-video'>
                                        {/* <source src={`https://social-media-app-6lpf.onrender.com/uploads/${post.media.url}`} /> */}
                                        <source src={`${post.media.url}`} />
                                    </video>
                                    <a href="#top-section" style={{ textDecoration: 'none' }}><p className='tweet-title' onClick={() => setExpandBlogId(post._id)}>{post.title}</p> </a>
                                </>
                                : ''

                }
            </div>
            <div className='tweet-engagement tweet-engagementUnexpand'>
               { !like?
                <div className='tweet-icon-container'><ThumbUpIcon className='tweet-icons' onClick={handleLike}/><span>{post?.likes?.length}</span></div>
                :
                <div className='tweet-icon-container'><ThumbUpIcon className='tweet-icons' onClick={handleDisLike} style={{color:"blue"}}/><span>{post?.likes?.length}</span></div>    
               }
                <button onClick={() => setExpandBlogId(post._id)}><a href='#top-section' style={{ textDecoration: 'none' }}>{content.postcard.comment}</a></button>
                <button className='share-button'><ShareIcon/><Share url={`${window.location.origin}${location.pathname}?postId=${post._id}`}/></button>
                {
                    expandBlogId === post._id ? <p>{content.postcard.watching}</p> : ''
                }
            </div>

            <div className='tweet-comment-section'>
                <textarea className='tweet-textarea' placeholder='Write a comment...'></textarea>
                <button>{content.postcard.add_comment}</button>
            </div>
        </div>
    )
}

export default Blog;
