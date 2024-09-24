import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import Share from '../share/Share';
import './blog.css';

function TopExpandedBlog(props) {
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [comment, setComment] = useState('');
    const [showDiscription,setShowDiscription]=useState(false);
    const [showTransferModal,setShowTransferModal]=useState(false);
    const [transferPoints,setTransferPoints]=useState(5);
    const [like,setLike]=useState(false);
    const [follow,setFollow]=useState(false);
    const location = useLocation();
    const { userInfo,userInfoFlag,setUserInfoFlag,lang} = useContext(AppContext);
    const userId = userInfo.data?.user?._id;
    const { posts, expandBlogId, setExpandBlogId, setAddedComment } = props;
 

    let post = posts.filter((item) => expandBlogId === item._id);
    const content=langContent[lang] || langContent['en'];

    const handleComment = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/addcomment', { userId, postId: post[0]._id, comment });
            if (res) {
                setAddedComment(post[0]._id);
                setComment('');
                toast(`${content.postcard.alerts.comment_success}`);
                setUserInfoFlag(!userInfoFlag);
            }
        } catch (error) {
            setComment('');
            toast(`${content.postcard.alerts.comment_error}`);
        }
    }

    useEffect(() => {
        setShowCommentSection(false);
        // To set the comment status false as the new blog expanded otherwise previous blog comment status does not change 
    }, [expandBlogId]);

    const handleShare = () => {
        const postUrl = `${window.location.origin}${location.pathname}?postId=${post[0]._id}`;
        navigator.clipboard.writeText(postUrl);
        alert('Post URL copied to clipboard');
    };

    //Follow and unfollow the user
    const handleFollow = async () => {
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/follow', { userId:userId, postId: post[0]._id,followedId:post[0].author._id });//userId it is follower. I have to add this in the connection of followedId.
            toast(`${content.postcard.alerts.follow_success}  ${post[0].author.name}`);
            setUserInfoFlag(!userInfoFlag);
        } catch (error) {
            toast.error(`${content.postcard.alerts.post_error}`);
        }
    }
   
    const handleUnFollow = async () => {
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/unfollow', { userId:userId, postId: post[0]._id,followedId:post[0].author._id });//userId it is follower. I have to add this in the connection of followedId.
            toast(`${content.postcard.alerts.unfollow_success}  ${post[0].author.name}`);
            setUserInfoFlag(!userInfoFlag);
        } catch (error) {
            toast.error(`${content.postcard.alerts.post_error}`);

        }
    }
    
    //see follow status at each render
    useEffect(()=>{
        const checkFollow=userInfo.data.user?.followed?.indexOf(post[0]?.author?._id);
        if(checkFollow!== -1){
            setFollow(true);
            // setFollow(false)
        }else{
            setFollow(false);
            // setFollow(true)
        }
    })

    const handleLike = async () => {
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/likepost', { userId, postId: post[0]._id });
            toast(`${content.postcard.alerts.like_success}`);
            setUserInfoFlag(!userInfoFlag);

        } catch (error) {
            toast.error(`${content.postcard.alerts.post_error}`);
        }
    }

    const handleDisLike = async () => {
        try {
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/dislikepost', { userId, postId: post[0]._id });
            toast(`${content.postcard.alerts.dislike_success}`);
            setUserInfoFlag(!userInfoFlag);

        } catch (error) {
            toast.error(`${content.postcard.alerts.post_error}`);
        }
    }

       //see like status at each render
       useEffect(()=>{
        const checkLike=post[0].likes?.find((like)=>userInfo.data?.user._id === like._id);
        if(checkLike){
            setLike(true);
        }else{
            setLike(false);
        }
    })

    //Handle  transfer points
    const handleTransferPoints = async () => {
        try {
            if(transferPoints > userInfo.data.user.points){
              return toast("You have not sufficient points");
            }
            const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/transferpoints', {userId:userId, fromUserId: userId, toUserId: post[0].author._id, points: transferPoints });
            if (res) {
                toast(`Transferred ${transferPoints} points to ${post[0].author.name}`);
                setUserInfoFlag(!userInfoFlag);
                setTransferPoints(5);
                setShowTransferModal(false);
            }
        } catch (error) {
            toast.error(`${content.postcard.alerts.post_error}`);
        }
    };

    // handle delete comment 
    const handleDeleteComment=async(commentId)=>{
        try {
            await axios.post('https://social-media-app-6lpf.onrender.com/api/post/deletecomment',{postId:post[0]._id,commentId:commentId,userId:userId});
            setUserInfoFlag(!userInfoFlag);
            toast(`${content.profile.alerts.comment_delete}`);
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);
        }
    }


    return (
        <div className='tweet expand' id="top-section">
            <div className="tweet-header">
                {/* <div className="username">{post[0].author.name}<EmojiEventsOutlinedIcon className='trophy-icon'/><p className='user-points'>{userInfo.data.user.points}</p><p>Followers: {userInfo.data.user.followers.length }</p></div> */}
                <div className="username">{post[0]?.author?.name}
                    <div className="username-dropdown">
                      <span>{content.postcard.points}:</span><EmojiEventsOutlinedIcon className='trophy-icon'/><p className='user-points'>{post[0]?.author?.points}</p><p>{content.postcard.followers}: {post[0]?.author?.followers.length }</p></div>
                    </div>
                <div className="timestamp">{post[0].createdAt}</div>
            </div>
            {
                post[0]?.media?.type === 'image' ?
                    <div className='expanded-media-container'>
                        <img alt="" src={`${post[0].media.url}`} className='expanded-media' />
                    </div> :
                    post[0]?.media?.type === 'video' ?
                        <div className='expanded-media-container'>
                            <video controls className='expanded-media'>
                                <source src={`${post[0].media.url}`} />
                            </video>
                        </div> :
                        ''
            }

            {/* <div className='tweet-body'> */}
            <div className='expanded-tweet-body'>
                <h6 className='tweet-title'>{post[0].title}</h6>
                <div className='expanded-description'><h2 className='empty-h2'></h2><button className='descrip-button' onClick={()=>setShowDiscription(!showDiscription)}>{content.postcard.description}</button><h2 className='empty-h2'></h2></div>
                {
                  showDiscription? <p className='tweet-content show'>{post[0].description}</p>:''
                } 
            </div>

            <div className='tweet-engagement'>
                {/* <button onClick={handleLike}>Like {post[0]?.likes?.length}</button> */}
                { !like?
                <div className='tweet-icon-container'><ThumbUpIcon className='tweet-icons' onClick={handleLike}/><span>{post[0]?.likes?.length}</span></div>
                :
                <div className='tweet-icon-container'><ThumbUpIcon className='tweet-icons' onClick={handleDisLike} style={{color:"blue"}}/><span>{post[0]?.likes?.length}</span></div>    
               }
                <button onClick={() => setShowCommentSection(!showCommentSection)}>{content.postcard.comment}</button>
                <button onClick={handleShare}>Share</button>
                <button className='share-button'><ShareIcon/><Share url={`${window.location.origin}${location.pathname}?postId=${post[0]._id}`}/></button>
                {
                  !follow? <button onClick={handleFollow} style={{color:"blue"}}>{content.postcard.follow}</button>
                  :
                 <button onClick={handleUnFollow}>{content.postcard.unfollow}</button>
                }
                <button onClick={()=>setShowTransferModal(!showTransferModal)}>{content.postcard.transfer_points}</button>
            </div>

            <div className='tweet-comment-section' style={showCommentSection ? { display: 'block' } : {}}>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className='tweet-textarea' placeholder={`${content.postcard.comment_placeholder} ...`}></textarea>
                <button onClick={handleComment}>{content.postcard.add_comment}</button>
                <div className='tweet-comment-list'>
                    {
                        post[0].comments.map((item) => <p key={item._id}>✔️{item.content}{(userId === item?.user?._id)?<DeleteIcon  className='comment-DeleteIcon' onClick={()=>handleDeleteComment(item._id)}/>:''}</p>)
                    }
                </div>
            </div>

          {
            showTransferModal?
            <div className='transfer-model'>
                <div className='transfer-model-content'>
                    <span className='transfer-model-close'  onClick={()=>setShowTransferModal(!showTransferModal)}>&times;</span>
                    <h2>{content.postcard.transfer_points}</h2>
                    <div className='transfer-point-form'>
                       <label htmlFor='transfer-points'>{content.postcard.points_label}:</label>
                        <input id='transfer-points' type='number' value={transferPoints} onChange={(e)=>setTransferPoints(e.target.value)}/>
                    </div>
                    <button onClick={handleTransferPoints}>{content.postcard.point_transfer}</button>
                </div>
            </div>:''
          }

        </div>
    )
}

export default TopExpandedBlog;

