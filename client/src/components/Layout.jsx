//For test only
import NavBar from "./nav/NavBar";
import Hero from "./Hero/Hero";
import Post from "./Post/Post";
import RegisterForm from "./AuthForms/RegisterForm";
import LoginForm from "./AuthForms/LoginForm";
import AboutSection from "./AboutSection/AboutSection";
import PostCreator from "./PostCreator/PostCreator";
import PostSearchResult from "./pages/PostSearchResults/PostSearchResult"
import UserAccountPage from "./pages/UserAccountPage/UserAccountPage";

import Home from "./pages/Home/Home";
function Layout() {
  return (
    <>
      
      <Home />
      <RegisterForm />
      <LoginForm />

      <Post />
      <PostCreator />
      <PostSearchResult />
      <UserAccountPage />
    </>
  );
}

export default Layout;
