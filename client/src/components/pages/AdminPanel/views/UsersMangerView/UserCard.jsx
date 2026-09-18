import ProfileImage from "@/components/UI/Utility/ProfileImage/ProfileImage";
import "./UserCard.css";
import Chip from "@/components/UI/Chip/Chip";
const UserCard = ({ user }) => {
  return (
    <div className="UserCard flex-col center gap-2em">
      <ProfileImage size="md" round src={user?.profileImageUrl} />
      <header>
      <h2>{`${user?.name}`}</h2>
      <h4>{`@${user?.username}`}</h4>

      </header>
      
      <div className="user-details grid">
        <div className="detail">
          <label>First Name: </label>
          <div className="value">{user?.firstName}</div>
        </div>
        <div className="detail">
          <label>Last Name: </label>
          <div className="value">{user?.lastName}</div>
        </div>
        <div className="detail">
          <label>Email: </label>
          <div className="value">{user?.email}</div>
        </div>
        <div className="detail">
          <label>Email status: </label>
            {user?.emailVert ? (<Chip type="success" className="status">
          Verified</Chip>) : (<Chip type="warning" className="status">
          Unverified</Chip>)}
          
        </div>
        <div className="detail">
          <label>Phone: </label>
          <div className="value">{user?.phone}</div>
        </div>
        <div className="detail">
          <label>Address: </label>
          <div className="value">{user?.location?.address}</div>{" "}
        </div>
        <div className="detail">
          <label>Roles: </label>
          <div className="roles flex gap-05em font-lg">
            {user?.roles?.map((role, index) => (
              <Chip key={index} className="role" style={role === "ADMIN"||"MODERATOR"||"USER" ? { backgroundColor: `var(--role-${role.toLowerCase()}-light)`,color: `var(--role-${role.toLowerCase()})`,border:'none'} : {}}>
                {role}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
