import Button from "../UI/Button/Button";
import {FaAngleRight} from "react-icons/fa6"
function HeroFilter() {
  return (
    <>
    <div className="herofilter-container form">
         <h1>Look for your next car now.</h1>
      <form >
        <select name="make"><option>Make</option></select>
        <select name="model"><option>Model</option></select>
        <select name="year-from"><option>From Year</option></select>
        <select name="mileage-to"><option >Mileage</option></select>
        <select name="price-to"><option >Budget</option></select>
        <Button variant="link" id="hero-advanced-btn">Advanced search<FaAngleRight/></Button>
        
        <Button id = 'hero-btn' variant="primary">Placeholder</Button>
      </form>
    </div>
    </>
  );
}

export default HeroFilter;