import "./PostSearchResult.css";
import Filter from "./Filter/Filter";
import Post from "../../Post/Post";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useConfig from "../../../hooks/useConfig";
import useWindowSize from "../../../hooks/useWindow";

const PostSearchResult = () => {
  const [posts, setPosts] = useState([]);
  const { config } = useConfig();
  const { isSmallScreen } = useWindowSize();
  const [showFilter, setShowFilter] = useState(!isSmallScreen);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  const make = query.get("make");
  const model = query.get("model");
  const yearMin = query.get("yearMin");
  const yearMax = query.get("yearMax");
  const bodyType = query.get("bodyType");
  const mileageMin = query.get("mileageMin");
  const mileageMax = query.get("mileageMax");
  const hpMin = query.get("hpMin");
  const hpMax = query.get("hpMax");
  const transmission = query.get("transmission");
  const priceMin = query.get("priceMin");
  const priceMax = query.get("priceMax");

  useEffect(() => {
    const queryParams = new URLSearchParams({
      ...(make && { make }),
      ...(model && { model }),
      ...(yearMin && { yearMin }),
      ...(yearMax && { yearMax }),
      ...(bodyType && { bodyType }),
      ...(mileageMin && { mileageMin }),
      ...(mileageMax && { mileageMax }),
      ...(transmission && { transmission }),
      ...(hpMin && { hpMin }),
      ...(hpMax && { hpMax }),
      ...(priceMin && { priceMin }),
      ...(priceMax && { priceMax }),
    }).toString();

    fetch(`${config.serverURL}/post?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, [
    make,
    model,
    yearMin,
    yearMax,
    bodyType,
    mileageMin,
    mileageMax,
    hpMin,
    hpMax,
    transmission,
    priceMin,
    priceMax,
  ]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <>
      <div className="PostSearchResult">
        {(showFilter || !isSmallScreen) && (
          <Filter
            query={query}
            handleToggle={toggleFilter}
            isSmallScreen={isSmallScreen}
          />
        )}

        <div className="post-results-container">
          <Button
            variant="primary"
            id="filter-toggle-btn"
            onClick={toggleFilter}
          >
            Filter
          </Button>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} data={post} />)
          ) : (
            <p>No posts found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PostSearchResult;
