import "./HighlightedPosts.css";
import Carousal from "../UI/Carousel/Carousel";
import Post from "../Post/Post";
import { useEffect, useState } from "react";
import useConfig  from "../../hooks/useConfig";
const HighlightedPosts = () => {
  const { config } = useConfig();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`${config.serverURL}/post/highest-score`).then((response)=>response.json()).then((data)=>setPosts(data)).finally(()=>setIsLoading(true));
  }, []);
  return (
    <section className="HighlightedPosts">
      <h2 style={{ color: "var(--primary)", padding: "0.25em" }}>
        Highlighted Offers
      </h2>
      <Carousal gap="2em">
        {isLoading ? (
          posts.map((post) => (
            <Post key={post.id} data={post} />
          ))
        ) : (
          [...Array(12)].map((_,index)=><Post.skeleton key={`post-skeleton-${index}`} />)
        )}
      </Carousal>
    </section>
  );
};

export default HighlightedPosts;
