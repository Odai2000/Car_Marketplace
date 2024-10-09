//Testing...

import "./PostSearchResult.css";
import Filter from "./Filter/Filter";
import Post from "../../Post/Post";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PostSearchResult = () => {
  const [posts, setPosts] = useState([]);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();


  const make = query.get("make");
  const model = query.get("model");
  const yearMin = query.get("yearMin");
  const yearMax = query.get("yearMax");
  const body = query.get("body");
  const mileageMin = query.get("mileageMin");
  const mileageMax = query.get("mileageMax");
  const transmission = query.get("transmission");
  const priceMin = query.get("priceMin");
  const priceMax = query.get("priceMax");

 
  useEffect(() => {
    const queryParams = new URLSearchParams({
      ...(make && { make }),
      ...(model && { model }),
      ...(yearMin && { yearMin }),
      ...(yearMax && { yearMax }),
      ...(body && { body }),
      ...(mileageMin && { mileageMin }),
      ...(mileageMax && { mileageMax }),
      ...(transmission && { transmission }),
      ...(priceMin && { priceMin }),
      ...(priceMax && { priceMax }),
    }).toString();

    fetch(`http://localhost:8080/post?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, [make, model, yearMin, yearMax, body, mileageMin, mileageMax, transmission, priceMin, priceMax]);
  return (
    <>
      <Button variant="primary" styleName="filter-toggler">
        Filter
      </Button>
      <div className="PostSearchResult">
        <Filter />
        <div className="post-results-container">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <p>No posts found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PostSearchResult;
