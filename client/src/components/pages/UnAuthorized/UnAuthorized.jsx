import { useNavigate } from "react-router-dom";
import UnAuthorizedPlaceholder from "./assets/401.svg";
import Button from "../../UI/Button/Button";
import useAuthModal from "../../../hooks/useAuthModal";
const UnAuthorized = () => {
  const {openLogin} = useAuthModal()
  return (
    <div className="UnAuthorized flex-col center gap-1em"style={{padding:'2rem' }}>
      <div
        className="unauthorized-placeholder"
        style={{ aspectRatio: 3/1, width:"80%",minHeight:"60%" }}
      >
        <img src={UnAuthorizedPlaceholder} />
      </div>
      <h2 style={{color:'var(--primary)',overflow:"hidden",textOverflow:"wrap"}}>It seems you&apos;re trying to reach a page that requires an account. Please log in and try again</h2>
      <h2 style={{color:'var(--primary)'}}></h2>
        <Button
        variant="primary"
          onClick={() => {
            openLogin()
          }}
        >
          Login
        </Button>
    </div>
  );
};

export default UnAuthorized;
