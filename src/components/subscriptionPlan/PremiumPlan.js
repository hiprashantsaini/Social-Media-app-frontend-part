import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { langContent } from "../../languagesText";

const PremiumPlan=({displayRazorpay,plans})=>{
    const {userInfo,planInfo,lang}=useContext(AppContext);
    const content=langContent[lang] || langContent['en'];

    if (!userInfo?.data?.user?.subscription || !plans) {
        return null; // or return a loading spinner / error message
      }

    const MonthlyPlan=planInfo.filter((item)=>item?.planId?._id === plans[3]._id && item.planId.isActive===true);

    const YearlyPlan=planInfo.filter((item)=>item?.planId?._id==plans[4]._id && item?.isActive===true);
    return(
        <div className="basic-plan">
           <div className="plan-head" style={{backgroundColor:"var(--plan3-head-background)"}}>
            <h2>{content.subscription.heading3}</h2>
            <p><span>{content.subscription.rate4}</span>{content.subscription.month}</p>
            <p><span>{content.subscription.rate5}</span>{content.subscription.year}</p>
           </div>
           <div className="plan-body">
            <p>•{content.subscription.para8}</p>
            <p>•{content.subscription.para9}</p>
            <p>•{content.subscription.para10}</p>
           </div>
           <div className="plan-button">
           {
            MonthlyPlan[0]?.isActive?<button style={{backgroundColor:'green'}}>✅{content.subscription.active}</button>
           :<button onClick={()=>displayRazorpay(plans[3]._id)}>{content.subscription.subs_monthly}</button>
            } 
         {
           YearlyPlan[0]?.isActive?<button style={{backgroundColor:'green'}}>✅{content.subscription.active}</button>
           :
           <button onClick={()=>displayRazorpay(plans[4]._id)}>{content.subscription.subs_yearly}</button>
            }
           </div>
        </div>
    )
}

export default PremiumPlan;