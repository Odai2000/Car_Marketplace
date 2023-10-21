import NavBar from "../nav/NavBar";
import HeroFilter from "./HeroFilter";
import "./style.css";

function Hero() {
  return (
    <>
      <section className="hero">
        <HeroFilter />
      </section>
    </>
  );
}

export default Hero;
