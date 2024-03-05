//For test only
import NavBar from "./nav/NavBar";
import Hero from "./Hero/Hero";
import Post from "./Post/Post";
import RegisterForm from "./AuthForms/RegisterForm";
import LoginForm from "./AuthForms/LoginForm";

function Layout() {
  return (
    <>
      <header>
        <NavBar />
        <Hero />
      </header>
      <RegisterForm/>
      <LoginForm/>
      <Post />
    </>
  );
}

export default Layout;
