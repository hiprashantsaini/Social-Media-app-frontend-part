import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { langContent } from "../../languagesText";

const BasicPlan = ({ displayRazorpay, plans }) => {
  const { userInfo,lang } = useContext(AppContext);
  const content=langContent[lang] || langContent['en'];

  if (!userInfo?.data?.user?.subscription || !plans) {
    return null; // or return a loading spinner / error message
  }

  const MonthlyPlan = userInfo.data.user.subscription.filter(
    (item) => item?.planId?._id === plans[1]?._id && item.isActive === true
  );
  const YearlyPlan = userInfo.data.user.subscription.filter(
    (item) => item?.planId?._id === plans[2]?._id && item?.isActive === true
  );

  return (
    <div className="basic-plan">
      <div className="plan-head" style={{ backgroundColor: "var(--plan1-head-background)" }}>
        <h2>{content.subscription.heading1}</h2>
        <p><span>{content.subscription.rate1}</span>{content.subscription.month}</p>
        <p><span>{content.subscription.rate2}</span>{content.subscription.year}</p>
      </div>
      <div className="plan-body">
        <p>•{content.subscription.para1}</p>
        <p>•{content.subscription.para2}</p>
        <p>•{content.subscription.para3}</p>
      </div>
      <div className="plan-button">
        {MonthlyPlan[0]?.isActive ? (
          <button style={{ backgroundColor: 'green' }}>✅{content.subscription.active}</button>
        ) : (
          <button onClick={() => displayRazorpay(plans[1]?._id)}>{content.subscription.subs_monthly}</button>
        )}
        {YearlyPlan[0]?.isActive ? (
          <button style={{ backgroundColor: 'green' }}>✅{content.subscription.active}</button>
        ) : (
          <button onClick={() => displayRazorpay(plans[2]?._id)}>{content.subscription.subs_yearly}</button>
        )}
      </div>
    </div>
  );
}

export default BasicPlan;

