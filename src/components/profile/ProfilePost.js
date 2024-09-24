import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';


function ProfilePost({post,postFlag,setPostFlag,userFlag, setUserFlag}) {
    const [showDiscription,setShowDiscription]=useState(false);
    const [showComments,setShowComments]=useState(false);
    const [titleStatus,setTitleStatus]=useState(false);
    const [title,setTitle]=useState(post.title);
    const [descriptiónStatus,setDescriptionStatus]=useState(false);
    const [descriptión,setDescriptión]=useState(post.description);

    const {userInfo,lang}=useContext(AppContext);
    const content=langContent[lang] || langContent['en']; 


    const handleDeleteComment=async(commentId)=>{
        try {
            const res=await axios.post('https://social-media-app-6lpf.onrender.com/api/post/deletecomment',{postId:post._id,commentId:commentId,userId:userInfo.data?.user?._id});
            setPostFlag(!postFlag);
            setUserFlag(!userFlag);
            toast(`${content.profile.alerts.comment_delete}`);
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);
        }
    }

    //Handle delete post
    const handleDeletePost=async()=>{
        try {
            const res=await axios.post('https://social-media-app-6lpf.onrender.com/api/post/deletepost',{userId:userInfo.data?.user?._id,postId:post._id});
            toast(`${content.profile.alerts.post_delete}`);
            setPostFlag(!postFlag);
            setUserFlag(!userFlag);
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);

        }
    }

    //Handle update title
    const handleUpdateTitle=async(e)=>{
        e.preventDefault();
        try {
            const res=await axios.post('https://social-media-app-6lpf.onrender.com/api/post/updatetitle',{userId:userInfo.data?.user?._id,postId:post._id,title:title});
            toast(`${content.profile.alerts.update_title}`);
            setTitleStatus(false);
            setPostFlag(!postFlag);
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);
        }
    }

        //Handle update description
        const handleUpdateDescription=async(e)=>{
            e.preventDefault();
            try {
                const res=await axios.post('https://social-media-app-6lpf.onrender.com/api/post/updatedescription',{userId:userInfo.data?.user?._id,postId:post._id,description:descriptión});
                toast(`${content.profile.alerts.update_description}`);
                setDescriptionStatus(false);
                setPostFlag(!postFlag);
            } catch (error) {
                toast.error(`${content.profile.alerts.delete_error}`);
            }
        }
  return (
    <div className='post-content'>
        <p style={{borderBottom:"1px solid gray"}}>{content.profile.createdAt} &ensp;<span className="timestamp">{post.createdAt}</span>&ensp;&ensp;<span>{content.profile.likes}: {post?.likes?.length}</span> <DeleteIcon className='comment-delete-icon' onClick={handleDeletePost}/> </p>
       <div className='post-media'>
       {
                    post?.media?.type === 'text' ?
                        <>
                       <p className='tweet-text'>{post.description.substr(0,250)+'...'}</p>
                        </>
                        :
                        post?.media?.type === 'image' ?
                            <>
                                <img src={`${post.media.url}`} className='post-img' />
                            </>
                            :
                            post?.media?.type === 'video' ?
                                <>
                                    <video controls className='post-video'>
                                        <source src={`${post.media.url}`} />
                                    </video>
                                </>
                                : ''

                }
       </div>
       {
        !titleStatus ? <a href="#top-section" style={{ textDecoration: 'none' }}><p className='tweet-title' style={{borderBottom:"1px solid gray"}}>{post.title} <EditIcon className='edit-icon' onClick={()=>setTitleStatus(true)}/></p> </a>
       :
       <form className='update-title-form'>
        <input type='text' value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <br/>
        <button onClick={()=>{
            setTitleStatus(false);
            setTitle(post.title);
        }}>Cancel</button>
        <button onClick={handleUpdateTitle}>Done</button>
       </form>
      }
       <h4 onClick={()=>setShowDiscription(!showDiscription)} style={{borderBottom:"1px solid black",cursor:"pointer"}}>{content.profile.description}</h4>
       {
        showDiscription?
        <>
        {
          !descriptiónStatus ? <p>{post.description} <EditIcon className='edit-icon' onClick={()=>setDescriptionStatus(true)}/></p>
          :
          <form className='update-title-form'>
          <input type='text' value={descriptión} onChange={(e)=>setDescriptión(e.target.value)}/>
          <br/>
          <button onClick={()=>{
              setDescriptionStatus(false);
              setDescriptión(post.description);
              
          }}>Cancel</button>
          <button onClick={handleUpdateDescription}>Done</button>
         </form>
        }
         </>
        :''
       }
       <h4 onClick={()=>setShowComments(!showComments)} style={{borderBottom:"1px solid black",cursor:"pointer"}}>{content.profile.comment}</h4>
       {
        showComments? post.comments.map((comment,i)=><p key={comment._id}>{i+1}. {comment.content}  <DeleteIcon className='comment-delete-icon' onClick={()=>handleDeleteComment(comment._id)}/></p>):''
       }
    </div>
  )
}

export default ProfilePost