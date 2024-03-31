import "./HighlightedPosts.css";
import Carousal from "../UI/Carousel/Carousel";
import Post from "../Post/Post";
const HighlightedPosts = () => {
  return (
    <section className="HighlightedPosts">
      <h2 style={{color:"var(--primary)",padding:""}} >Highlighted Offers</h2>
      <Carousal gap="2em">
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </Carousal>
    </section>
  );
};

export default HighlightedPosts;
