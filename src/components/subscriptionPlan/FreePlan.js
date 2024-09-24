import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { langContent } from "../../languagesText";

const FreePlan=()=>{
    const {lang}=useContext(AppContext)
  const content=langContent[lang] || langContent['en'];

    return(
        <div className="basic-plan">
           <div className="plan-head" style={{backgroundColor:"var(--plan2-head-background)"}}>
            <h2>{content.subscription.heading2}</h2>
            <p><span>{content.subscription.rate3}</span>{content.subscription.month}</p>
            <p><span>{content.subscription.rate3}</span>{content.subscription.year}</p>
           </div>
           <div className="plan-body">
            <p>•{content.subscription.para4}</p>
            <p>•{content.subscription.para5}</p>
            <p>•{content.subscription.para6}</p>
            <p>•{content.subscription.para7}</p>
           </div>
           <div className="plan-button">
           {/* <button>Subscribe monthly</button> */}
           <button style={{backgroundColor:'green'}}>✅{content.subscription.active}</button>
           </div>
        </div>
    )
}

export default FreePlan;