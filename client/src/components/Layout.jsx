//For test only
import NavBar from "./nav/NavBar";
import Hero from "./Hero/Hero";
import Post from "./Post/Post";
import RegisterForm from "./AuthForms/RegisterForm";
import LoginForm from "./AuthForms/LoginForm";
import AboutSection from "./AboutSection/AboutSection";
import PostCreator from "./PostCreator/PostCreator";
import PostSearchResult from "./pages/PostSearchResults/PostSearchResult"

function Layout() {
  return (
    <>
      <header>
        <NavBar />
        <Hero />
      </header>
      <AboutSection />
      <RegisterForm />
      <LoginForm />

      <Post />
      <PostCreator />
      <PostSearchResult />
    </>
  );
}

export default Layout;
