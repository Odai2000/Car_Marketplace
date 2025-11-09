import "./PostSearchResult.css";
import Filter from "./Filter";
import Post from "../../Post/Post";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useConfig from "../../../hooks/useConfig";
import useWindowSize from "../../../hooks/useWindow";
import Select from "../../UI/FormControls/Select";

const PostSearchResult = () => {
  const [posts, setPosts] = useState([]);
  const { config } = useConfig();
  const { isSmallScreen } = useWindowSize();
  const [showFilter, setShowFilter] = useState(!isSmallScreen);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const { search } = useLocation();

  const query = new URLSearchParams(search);

  const [sortBy, setSortBy] = useState(query.get("sortBy") || "newest");
  const [limit, setLimit] = useState(Number(query.get("limit")) || 15);
  const [page, setPage] = useState(Number(query.get("page")) || 1);

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
      ...(sortBy && { sortBy }),
      ...(page && { page }),
      ...(limit && { limit }),
    }).toString();

    setPosts([]);
    fetch(`${config.serverURL}/post?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalPosts(data.totalPosts);
        setTotalPages(data.totalPages);
        setPosts(data.posts);
      });
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
    sortBy,
    page,
    limit,
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
          <div className="result-header flex">
            <div className="left flex">
              <span
                style={{ color: "#aaa" }}
              >{`${totalPosts} posts found`}</span>{" "}
              <Select
                variant={"inline"}
                value={sortBy}
                style={{ maxWidth: `${sortBy?.length + 1}ch` }}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Most recent</option>
                <option value="highest-price">Highest price</option>
                <option value="lowest-price">Lowest price</option>
                <option value="most-viewed">Most viewed</option>
              </Select>
            </div>
            <div className="right">
              <Button
                variant="primary"
                id="filter-toggle-btn"
                onClick={toggleFilter}
              >
                Filter
              </Button>
            </div>
          </div>

          {posts?.length > 0
            ? posts.map((post) => <Post key={post._id} data={post} />)
            : Post.skeletons(15)}
          <div
            className="pagination-controls"
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{ display: "flex", gap: ".25rem", alignItems: "center" }}
            >
              {[...Array(totalPages)].map((_, pg) => {
                let distance = Math.abs(page - pg);
                if (distance < 3 || pg == 0 || pg == totalPages - 1)
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      disabled={pg === page}
                      style={{
                        fontWeight: pg === page ? "bold" : "normal",
                        background: pg === page ? "var(--primary)" : "#fff",
                        color: pg === page ? "#fff" : "var(--primary)",
                        padding: "1em 1.25em",
                        border: "1px solid var(--primary)",
                        borderRadius: "4px",
                        cursor: pg === page ? "default" : "pointer",
                      }}
                    >
                      {pg+1}
                    </button>
                  );
                else if (distance == 3)
                  return (
                    <span
                      key={`dot-${pg}`}
                      style={{ minWidth: "2em", textAlign: "center" }}
                    >
                      …
                    </span>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostSearchResult;
