import "./style.css";
import Button from "../UI/Button/Button";

function signup() {
  return (
    <>
      <form className='signup card'>

        <h2 className="col-2">Sign up</h2>
        <input type="text" name="firstName" placeholder="First Name"  />

        <input type="text" name="lastName" placeholder="Last Name" />

        <input type="text" name="email" placeholder="Email" className="col-2" />

        <input type="text" name="username" placeholder="Username" className="col-2" />

        <input type="password" name="password" placeholder="Password"/>

        <input type="text" name="confirmPassword" placeholder="Confirm Password"/>

        <Button variant = "primary" id='signup-btn' grid='col-2'>Signup</Button>
      </form>
    </>
  );
}

export default signup
