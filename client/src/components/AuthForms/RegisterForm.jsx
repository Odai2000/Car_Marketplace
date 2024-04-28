import "./style.css";
import Button from "../UI/Button/Button";
import { FaX } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { useEffect, useState } from "react";

const RegisterForm = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmpassword] = useState('');

const {show,onCancel}=props

  const handleSubmit = (e) => {
    e.preventDefault();
    password !== ConfirmPassword
      ? console.log("Passwords don't match!")
      : registerUser(firstName, lastName, email, username, password);
  };
  const registerUser = async (
    firstName,
    lastName,
    email,
    username,
    password
  ) => {
    await fetch("http://localhost:8080/user", {
      method: "Post",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email:  email ,
        username: username,
        password: password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((respose) => respose.json())
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {}, []);
  return show?(
    <>
      <div className="authFormContainer ">
        <form className="authForm card" onSubmit={handleSubmit}>
          <Button styleName="cross" onClick={onCancel}>
            <FaX />
          </Button>
          <h2 className="col-2">Register</h2>

          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="First Name"
          />

          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Last Name"
          />

          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            className="col-2"
          />

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
          />

          <input
            type="password"
            name="confirmPassword"
            value={ConfirmPassword}
            onChange={(e) => {
              setConfirmpassword(e.target.value);
            }}
            placeholder="Confirm Password"
          />

          <span className="col-2">
            Already have an account? <Button variant="link">Login</Button>
          </span>

          <Button type="submit" variant="primary" styleName="signup-btn col-2">
            Register
          </Button>

          <div className="line-breaker col-2">
            <span className="line"></span>
            <span className="word">OR</span>
            <span className="line"></span>
          </div>

          <div className="container alt col-2">
            <IconContext.Provider value={{ size: "2.5em" }}>
              <Button variant="secondary link round">
                {" "}
                <FcGoogle /> Continue with Google
              </Button>
              <Button variant="secondary link round">
                {" "}
                <FaFacebook
                  style={{ color: " #4267B2", marginBottom: "2px" }}
                />{" "}
                Continue with Facebook
              </Button>
            </IconContext.Provider>
          </div>
        </form>
      </div>
    </>
  ):'';
};

export default RegisterForm;
