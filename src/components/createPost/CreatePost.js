import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import Header from '../Header';
import './createpost.css';

const MAX_VIDEO_SIZE = 200 * 1024 * 1024;/// It is in bits equal to 200MB. 1MB=1024KB, 1KB=1024Bits
const MAX_VIDEO_DURATION = 600000;/// It is in milliseconds. equals to 10 minutes. 1sec=1000ms

const CreatePost = () => {
  const [postType, setPostType] = useState('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStatus, setOtpStatus] = useState(0);
  const [mediaUrl, setMediaUrl] = useState('');
  const [loadingFile,setloadingFile]=useState(false);



  const { userInfo, lang, setUserInfoFlag, userInfoFlag, planInfo } = useContext(AppContext);

  const content = langContent[lang] || langContent['en'];

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
    setError('')// Clear error when type changes
  };
  const handleMediaChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      //check file size
      if (file.size > MAX_VIDEO_SIZE) {
        setError(`${content.createPost.alerts.size_error} ${MAX_VIDEO_SIZE / (1024 * 1024)} MB`);
        return;
      }
      //is post type is image
      if (postType === 'image') {
        uploadToCloudinary(file);
        return;
      }

      // Check video duration
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = async () => {
        if (videoElement.duration > MAX_VIDEO_DURATION) {
          setError(`${content.createPost.alerts.duration_error} ${MAX_VIDEO_DURATION / 1000} seconds`);
        } else {
          setError('');
          uploadToCloudinary(file);
        }
      }

    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'social_media_uploads');

    try {
      setloadingFile(true);
      const response = await axios.post('https://api.cloudinary.com/v1_1/dea0balam/upload', formData);
      setMediaUrl(response.data.secure_url);
      toast("File Uploaded");
      setloadingFile(false);
    } catch (error) {
      console.log("uploadToCloudinary error", error);
      setloadingFile(false);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loadingFile){
      toast.error("File is uploading!. Please wait.");
      return;
    }
    if (error !== '') {
      alert(`${error}`);
      setTitle('');
      setDescription('');
      return;
    }

    try {

      if (otp === '') {
        setOtpStatus(1);
        const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/send-emailotp', { email: userInfo.data.user.email });
        if (res) {
          setOtpStatus(2);

          return;
        }
        setOtpStatus(0);
        setOtp('');
        toast.error(`${content.createPost.alerts.otp_problem}`)
        return;
      }

      const res2 = await axios.post('https://social-media-app-6lpf.onrender.com/api/auth/signup-verifyOtp', { email: userInfo.data.user.email, emailOtp: otp });
      if (!res2) {
        toast.error(`${content.createPost.alerts.otp_invalid}`);
        setOtp('');
        setOtpStatus(0);
        return;
      }

      let data = {
        title,
        description,
        postType,
        userId: userInfo.data?.user?._id,
        planInfo: JSON.stringify(planInfo),
        fileUrl: mediaUrl
      }
      const res = await axios.post('https://social-media-app-6lpf.onrender.com/api/post/createpost', {...data});
      alert(`${res.data?.message}`);
      setUserInfoFlag(!userInfoFlag);
      setTitle('');
      setDescription('');
      setOtp('');
      setOtpStatus(0);
    } catch (error) {
      console.error('Error creating post:', error);
      setOtpStatus(0);
      setOtp('');
      toast.error(`${content.createPost.alerts.failed}`);
    }
  };

  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="create-post">
        <h2>{content.createPost.heading1}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="postType">{content.createPost.post_type}</label>
            <select id="postType" value={postType} onChange={handlePostTypeChange}>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={75}
              placeholder={content.createPost.max_char}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">{content.createPost.description}</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          {postType !== 'text' && (
            <div className="form-group">
              <label htmlFor="media">{content.createPost.upload} {postType}</label>
              <input
                type="file"
                id="media"
                accept={postType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleMediaChange}
                required
              />
              {
                loadingFile ? <p>Uploading ....</p> : ''
              }
            </div>
          )}
          {
            otpStatus === 1 ? <div className="form-group"><p>{content.createPost.sending_otp}</p></div> : otpStatus === 2 ? <div className="form-group"><p>{content.createPost.sent_otp}</p></div> : ''
          }
          {
            otpStatus === 2 ? <div className="form-group"><input value={otp} placeholder='Enter your OTP' onChange={(e) => setOtp(e.target.value)} /></div> : ''
          }
          <button type="submit" className="btn-submit">{content.createPost.create}</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
