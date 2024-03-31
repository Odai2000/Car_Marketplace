import React from "react";
import HighlightedPosts from "../../HighlightedPosts/HighlightedPosts";
import AboutSection from "../../AboutSection/AboutSection";
import NavBar from "../../nav/NavBar";
import Hero from "../../Hero/Hero";

const Home = () => {
  return (
    <>
    <header>
        <NavBar />
        <Hero />
    </header>
      <HighlightedPosts />
      <AboutSection />
    </>
  );
};

export default Home