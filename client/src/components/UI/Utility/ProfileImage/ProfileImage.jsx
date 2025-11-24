import DefaultProfile from "../DefaultProfile/DefaultProfile";

const ProfileImage = ({
  className,
  size = "sm",
  src,
  round = true,
}) => {
  let value = size;
    switch (size) {
      case "lg":
        value = "14rem";
        break;
      case "md":
        value = "9rem";
        break;
      case "sm":
        value = "4rem";
        break;
      case "xs":
        value = "2rem";
        
        break;
      default:
        value;
        break;
    }
  
  return (
    <div
      className={`ProfileImage profile-image ${round && "round"} ${className}`}
      style={{ width:value,height:value }}
    >
      {src ? (
        <img src={src} alt="profile-image" />
      ) : (
        <DefaultProfile size={`${parseFloat(value)/2}rem`} round />
      )}
    </div>
  );
};

export default ProfileImage;
