import "./style.css";
import Input from "../UI/FormControls/Input";
import Button from "../UI/Button/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import Alert from "../UI/Alert/Alert";

function LoginForm({onSuccess}) {
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
      onSuccess()
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
  return  (
    <>
        <form onSubmit={handleSubmit} className="authForm card">

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

          <span className="col-2 flex gap-05em">
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
          <Alert className="col-2" type="warning">
            Disclaimer: This site is for demonstration purposes only. Please do
            not enter any personal information
          </Alert>
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
     
    </>
  )
}

export default LoginForm;
