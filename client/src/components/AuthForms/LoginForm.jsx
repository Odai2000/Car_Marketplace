import "./style.css";
import Input from "../UI/FormControls/Input";
import Button from "../UI/Button/Button";
import { FaX } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";

function LoginForm({ show, onCancel }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const { persist, setPersist, login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);

    if (result.success) {
      setUsername("");
      setPassword("");
    } else {
      showToast(result.errorMsg, "error");
    }
  };
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  return show ? (
    <>
      <div className="authFormContainer">
        <form onSubmit={handleSubmit} className="authForm card">
          <Button styleName="cross" onClick={onCancel}>
            <FaX />
          </Button>
          <h2 className="col-2">Login</h2>

          <Input
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Username"
            styleName="col-2"
          />

          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            styleName="col-2"
          />

          <span className="col-2">
            {`Don't have an account?`} <Button variant="link">Sign up</Button>
          </span>

          <div id="remeber-me-container">
            <Input
              type="checkbox"
              onChange={togglePersist}
              checked={persist || false}
            />
            <label>Remeber Me</label>
          </div>

          <Button type="submit" variant="primary" styleName="login-btn col-2">
            Login
          </Button>

          <div className="line-breaker col-2">
            <span className="line"></span>
            <span className="word">OR</span>
            <span className="line"></span>
          </div>

          <div className="container alt col-2">
            <IconContext.Provider value={{ size: "2.5em" }}>
              <Button variant="secondary link round">
                <FcGoogle /> Continue with Google
              </Button>
              <Button variant="secondary link round">
                <FaFacebook
                  style={{
                    color: " #4267B2",
                    margin: "0 2px 2px",
                    minHeight: "1em",
                  }}
                />
                Continue with Facebook
              </Button>
            </IconContext.Provider>
          </div>
        </form>
      </div>
    </>
  ) : (
    ""
  );
}

export default LoginForm;
