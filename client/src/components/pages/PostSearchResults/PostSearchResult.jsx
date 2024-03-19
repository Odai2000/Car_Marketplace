//Testing...

import "./PostSearchResult.css";
import Filter from "./Filter/Filter";
import Post from "../../Post/Post";
import Button from "../../UI/Button/Button";

const PostSearchResult = () => {
  return (
    <>
      <Button variant="primary" styleName="filter-toggler">Filter</Button>
      <div className="PostSearchResult">
        <Filter />
        <div className="post-results-container">
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      </div>
    </>
  );
};

export default PostSearchResult;