import Button from "../UI/Button/Button";

function HeroFilter() {
  return (
    <>
    <div className="herofilter-container form">
         <h1>Look for your next car now.</h1>
      <form >
        <select name="make"><option>Make</option></select>
        <select name="model"><option>Model</option></select>
        <select name="year-from"><option>From Year</option></select>
        <select name="year-to"><option>To Year</option></select>
        <div>Advanced search</div>
        <select name="type">Any</select>
        <select name="engine">Any</select>
        <select name="hp" >0000</select>
        <select name="condition">Any</select>
        <select name="mileage">000000</select>
        <Button id = 'hero-btn' variant="primary">Placeholder</Button>
      </form>
    </div>
    </>
  );
}

export default HeroFilter;