import React from 'react';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import './share.css';
function Share({url}) {
    return (
        <div className='share-container'>
            <EmailShareButton 
            url={url}
            >
                <EmailIcon className='icon'/>
            </EmailShareButton>
            <FacebookShareButton
                url={url}
                quote={'Dummy text!'}
                hashtag="#muo"
            >
                <FacebookIcon className='icon'/>
            </FacebookShareButton>
            <TwitterShareButton
                url={url}
            >
                <TwitterIcon className='icon'/>
            </TwitterShareButton>

            <TelegramShareButton
                url={url}
            >
                <TelegramIcon className='icon'/>
            </TelegramShareButton>

            <LinkedinShareButton
                url={url}
            >
                <LinkedinIcon className='icon'/>
            </LinkedinShareButton>

            <WhatsappShareButton
                url={url}
            >
                <WhatsappIcon className='icon'/>
            </WhatsappShareButton>

        </div>
    )
}

export default Share