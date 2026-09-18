import "./style.css";
import Input from "../UI/FormControls/Input";
import Button from "../UI/Button/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { useEffect, useState } from "react";
import useToast from "../../hooks/useToast";
import useAuth from "../../hooks/useAuth";
import Alert from "../UI/Alert/Alert";
import useAuthModal from "../../hooks/useAuthModal";

const RegisterForm = ({onSuccess}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmpassword] = useState("");

  const { register,googleLogin,login } = useAuth();
  const { showToast } = useToast();
  const {openLogin} = useAuthModal()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== ConfirmPassword) {
      console.log("Passwords don't match!");
      return;
    }

    const result = await register(
      firstName,
      lastName,
      email,
      username,
      password
    );

    if (result.success) {
      setUsername("");
      setPassword("");
      onSuccess()
      await login(username,password) //attempt login
    } else {
      showToast(result.errorMsg, "error");
    }
  };

  useEffect(() => {}, []);
  return (
    <>
      <form className="authForm" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          placeholder="First Name"
        />

        <Input
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          placeholder="Last Name"
        />

        <Input
          type="text"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          styleName="col-2"
        />

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
        />

        <Input
          type="password"
          name="confirmPassword"
          value={ConfirmPassword}
          onChange={(e) => {
            setConfirmpassword(e.target.value);
          }}
          placeholder="Confirm Password"
        />
        <span className="col-2 flex gap-05em">
          Already have an account?<Button variant="link" onClick={openLogin}> Login</Button>
        </span>

        <Alert className="col-2" type="warning">
          Disclaimer: This site is for demonstration purposes only. Please do
          not enter any personal information
        </Alert>

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
            <Button variant="secondary link round" onClick={googleLogin}>
              <FcGoogle /> Continue with Google
            </Button>
            <Button variant="secondary link round">
              <FaFacebook style={{ color: " #4267B2", marginBottom: "2px" }} />
              Continue with Facebook
            </Button>
          </IconContext.Provider>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
