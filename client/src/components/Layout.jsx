//For test only
import NavBar from "./nav/NavBar";
import Hero from "./Hero/Hero";
import Post from "./Post/Post";
import SignUpForm from "./signUp/SignUpForm";
import LoginForm from "./Login/LoginForm";

function Layout() {
  return (
    <>
      <header>
        <NavBar />
        <Hero />
      </header>
      <SignUpForm/>
      <LoginForm/>
      <Post />
    </>
  );
}

export default Layout;
