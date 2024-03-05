import "./style.css";
import Button from "../UI/Button/Button";
import { FaX } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

function signup() {
  return (
    <>
      <Button styleName="cross">
        <FaX />
      </Button>

      <form className="signup card">
        <h2 className="col-2">Sign up</h2>

        <input type="text" name="firstName" placeholder="First Name" />

        <input type="text" name="lastName" placeholder="Last Name" />

        <input type="text" name="email" placeholder="Email" className="col-2" />

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="col-2"
        />

        <input type="password" name="password" placeholder="Password" />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
        />

        <span className="col-2">
          Already have an account? <a>Login</a>
        </span>

        <Button variant="primary" styleName="signup-btn col-2">
          Sign up
        </Button>

        <div className="line-breaker col-2">
          <span className="line"></span>
          <span className="word">OR</span>
          <span className="line"></span>
        </div>

        <div className="container">
          <FcGoogle />
              <FaFacebook style={{color:" #4267B2"}}/>
        </div>
      </form>
    </>
  );
}

export default signup;
