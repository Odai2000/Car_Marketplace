import "./style.css";
import Button from "../UI/Button/Button";
import { FaX } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);

  const login = async (username, password) => {
    fetch("http://localhost:8080/user/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        response.json();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };
  return (
    <>
      <div className="authFormContainer card">
        <form onSubmit={handleSubmit} className="authForm">
          <Button styleName="cross">
            <FaX />
          </Button>
          <h2 className="col-2">Login</h2>

          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Username"
            className="col-2"
          />

          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            className="col-2"
          />

          <span className="col-2">
            Don't have an account? <Button variant="link">Sign up</Button>
          </span>

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
                  style={{ color: " #4267B2", margin: "0 2px 2px" }}
                />
                Continue with Facebook
              </Button>
            </IconContext.Provider>
          </div>
        </form>
      </div>
    </>
  );
}


export default LoginForm;
