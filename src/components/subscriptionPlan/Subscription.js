import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { RAZOR_PAY_TEST_KEY } from '../../config';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';
import Header from '../Header';
import BasicPlan from './BasicPlan';
import FreePlan from './FreePlan';
import PremiumPlan from './PremiumPlan';
import './subscriptionPlan.css';
const Subscription=()=>{
    const {lang,userInfo,userInfoFlag,setUserInfoFlag}=useContext(AppContext);
    const [plans,setPlans]=useState('')
    const content=langContent[lang] || langContent['en'];

    const getAllPlans=async()=>{
        try {
            const allplans=await axios.post('https://social-media-app-6lpf.onrender.com/api/payment/allplans',{userId:userInfo.data?.user?._id});
            if(allplans){
                setPlans(allplans.data.plans);
            }
        } catch (error) {
            console.log("getAllPlans error");
        }
    }

    useEffect(()=>{
        getAllPlans();
    },[userInfo])

    function loadScript(src){
        return new Promise((resolve)=>{
            const script=document.createElement("script");
            script.src=src;
            script.onload=()=>{
                resolve(true);
            };
            script.onerror=()=>{
                resolve(false);
            };
            document.body.appendChild(script);     
        });
    };

    async function displayRazorpay(selectedPlanId){
        const res=await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if(!res){
            toast.error(`${content.subscription.alerts.razorpay_fail}`);
            return;
        }
        // creating a new order
        const result=await axios.post("https://social-media-app-6lpf.onrender.com/api/payment/orders",{planId:selectedPlanId});

        if(!result){
            toast.error(`${content.subscription.alerts.razorpay_error}`);
            return;
        }
        
        // Getting the order details back
        const {amount,id:order_id,currency}=result.data;

        const options={
            key:RAZOR_PAY_TEST_KEY,/// Enter the Key ID generated from the Dashboard
            amount:amount.toString(),
            currency:currency,
            name:"Your Company",
            description:"Test Transaction",
            order_id:order_id,
            handler:async function(response){
                const data={
                    orderCreationId:order_id,
                    razorpayPaymentId:response.razorpay_payment_id,
                    razorpayOrderId:response.razorpay_order_id,
                    razorpaySignature:response.razorpay_signature,
                    planId:selectedPlanId,
                    userId:userInfo.data?.user?._id
                };
                const result=await axios.post("https://social-media-app-6lpf.onrender.com/api/payment/success",data);
                setUserInfoFlag(!userInfoFlag)
                alert(`${result.data.msg}`);
            },
            prefill:{
                name:userInfo.data?.user?.name,
                email:userInfo.data?.user?.email,
                contact:userInfo.data?.user?.phone || ' ',
            }
        };

        const paymentObject=new window.Razorpay(options);
        paymentObject.open();
    }

    return(
        <div className="subscription">
            <Header/>
            <div className='subscription-body'>
                <ToastContainer/>
                <h1>{content.subscription.plan}</h1>
                <div className='plans'>
                <FreePlan/>
                <BasicPlan displayRazorpay={displayRazorpay} plans={plans}/>
                <PremiumPlan displayRazorpay={displayRazorpay} plans={plans}/>
                </div>
            </div>
        </div>
    )
}

export default Subscription;