import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { langContent } from "../languagesText";

const CoverPage=()=>{
  const {lang}=useContext(AppContext);
  const content=langContent[lang] || langContent['en'];
    return(
        <div className="coverpage">
            <Link to='/createpost'><h2>{content.cover_page.title}</h2></Link>           
        </div>
    )
}

export default CoverPage;