import "./style.css";
import Button from "../UI/Button/Button";
import { FaX } from "react-icons/fa6";

function LoginForm() {
  return (
    <>
      <Button styleName="cross">
        <FaX />
      </Button>

      <form className="login card">
        <h2 className="col-2">login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="col-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="col-2"
        />

        <span className="col-2">
          Don't have an account? <a>Sign up</a>
        </span>

        <Button variant="primary" styleName="signup-btn col-2">
          Login
        </Button>
      </form>
    </>
  );
}
