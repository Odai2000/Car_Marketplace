import Button from "../../UI/Button/Button";

const UserAccountPage = () => {
  return (
    <>
      <div className="UserAccountPage">
        <div className="profile-image"></div>
        <div className="username-container">
          <span>@Username</span>
        </div>
        <div className="account-info">
          <div className="item">
            <label>First Name</label>
            <span></span>
          </div>
          <div className="item">
            <label>Last Name</label>
            <span></span>
          </div>
          <div className="item">
            <label>Email Address</label>
            <span></span>
          </div>
          <div className="item">
            <label>Phone Number</label>
            <span></span>
          </div>
        </div>
        <div className="edit-account-info">
          <div className="item">
            <label>First Name</label>
            <input name="First Name" placeholder="First Name" />
          </div>
          <div className="item">
            <label>Last Name</label>
            <input name="Last Name" placeholder="Last Name" />
          </div>
          <div className="item">
            <label>Email Address</label>
            <input name="Email" placeholder="Email" />
          </div>
          <div className="item">
            <label>Phone Number</label>
            <input name="Phone Number" placeholder="Phone Number" />
          </div>
        </div>
        <div className="delete-btn-container">
            <Button>Delete Account</Button>
        </div>
      </div>
    </>
  );
};

export default UserAccountPage;
