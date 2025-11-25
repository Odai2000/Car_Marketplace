import { useNavigate } from "react-router-dom";
import NotFoundPlaceholder from "./assets/404.svg";
import Button from "../../UI/Button/Button";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="NotFound flex-col center gap-1em" style={{padding:'2rem' }}>
      <div
        className="not-found-placeholder"
        style={{ aspectRatio: 3/1,width:"90%",}}
      >
        <img src={NotFoundPlaceholder} />
      </div>
      <h2 style={{color:'var(--primary)',overflow:"hidden",textOverflow:"wrap"}}>You may have followed a broken link, or the page may have been removed</h2>
        <Button
        variant="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to homepage
        </Button>
    </div>
  );
};

export default NotFound;
