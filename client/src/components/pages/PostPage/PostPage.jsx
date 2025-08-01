import "./PostPage.css";
import { useEffect, useState } from "react";
import Input from "../../UI/FormControls/Input";
import Button from "../../UI/Button/Button";
import Alert from "../../UI/Alert/Alert";
import useMap from "../../../hooks/useMap";
import PropTypes from "prop-types";
import DefaultProfile from "../../UI/Utility/DefaultProfile/DefaultProfile";
import useConfig from "../../../hooks/useConfig";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../../UI/Carousel/Carousel";
import {
  FaCamera,
  FaLocationDot,
  FaMessage,
  FaPhone,
  FaRegStar,
  FaStar,
} from "react-icons/fa6";
import useToast from "../../../hooks/useToast";
import useAuth from "../../../hooks/useAuth";
import useAuthFetch from "../../../hooks/useAuthFetch";
import ReactStars from "react-rating-stars-component";
import { FaStarHalfAlt } from "react-icons/fa";

const PostPage = () => {
  const [comments, setComments] = useState([]);
  const [bids, setBids] = useState([]);
  const [rating, setRating] = useState(0);
  const [bid, setBid] = useState("");
  const [comment, setComment] = useState("");
  const [data, setData] = useState({});

  const { auth, setAuth } = useAuth();
  const authFetch = useAuthFetch();
  const { config } = useConfig();
  const { showToast } = useToast();
  const { getEmbeddedMapURL } = useMap();
  const navigate = useNavigate();

  const { _id } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!_id || !config?.serverURL) return;

        const response = await fetch(
          `${config.serverURL}/post/${_id}?include=bids,comments&user_id=${auth?.userData?._id}`
        );
        const data = await response.json();
        setData(data);
        setBids([...(data?.bids || [])].sort((a, b) => b.amount - a.amount));
        setComments(data?.comments);
      } catch (error) {
        console.error("Failed to load post data:", error);
        showToast("Failed to load post data", "error");
      }
    };

    loadData();
  }, [_id, config?.serverURL]);

  useEffect(() => {
    if (data?.user?.reputation) {
      setRating(Number(data.user.reputation));
    }
  }, [data?.user?.reputation]);

  let images = data?.images;

  let defaultBlock = (
    <div key="0" className="no-image" alt="No Photos">
      <FaCamera style={{ height: "2em", width: "2em" }} /> No Photos
    </div>
  );

  const isOwner = auth?.userData?._id === data.user?._id;
  const isAdmin = auth?.roles?.includes("ADMIN");
  const isUser = auth?.roles?.includes("USER");
  const isSaved = auth?.userData?.savedPosts?.includes(data?._id);
  const handleMessage = () => {
    navigate(`/chat/${data?.user_id?._id}`);
  };

  const handleSave = async () => {
    try {
      await authFetch(
        `${config.serverURL}/user/${auth?.userData._id}/save-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: data?._id,
          }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setAuth({
            ...auth,
            userData: { ...auth?.userData, savedPosts: data?.savedPosts },
          });
        });
    } catch (error) {
      showToast("Failed to save", "error");

      console.error(error);
    }
  };

  const handleUnsave = async () => {
    try {
      await authFetch(
        `${config.serverURL}/user/${auth?.userData._id}/unsave-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: data?._id,
          }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setAuth({
            ...auth,
            userData: { ...auth?.userData, savedPosts: data?.savedPosts },
          });
        });
    } catch (error) {
      showToast("error", "Failed to unsave");
      console.error(error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await authFetch(
        `${config.serverURL}/post/${data?._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) showToast("Post deleted.", "success");
    } catch (error) {
      showToast("Failed to delete post", "error");

      console.error(error);
    }
  };
  const handleBid = async () => {
    try {
      const amount = Number(bid);

      if (!amount || isNaN(amount) || amount <= 0) {
        showToast("Please enter a valid bid amount", "error");
        return;
      }
      if (data.user_id === auth?.userData?._id) {
        showToast("You can't bid on your own post.", "error");
      }
      const response = await authFetch(`${config.serverURL}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: data._id, amount: amount }),
      });
      if (response.ok) {
        const data = await response.json();
        setBids((prev) =>
          [...prev, data.bid].sort((a, b) => b.amount - a.amount)
        );
        setBid("");
      }
    } catch (error) {
      showToast("Failed to bid", "error");

      console.error(error);
    }
  };
  const handleComment = async () => {
    try {
      if (!comment) {
        showToast("Please enter a valid comment", "error");
        return;
      }
      const response = await authFetch(`${config.serverURL}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: data._id, text: comment }),
      });
      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [...prev, data.comment]);
        setComment("");
      }
    } catch (error) {
      showToast("Failed to comment", "error");

      console.error(error);
    }
  };

  const handleRating = async (value) => {
    try {
      await authFetch(`${config.serverURL}/user/${data?.user?._id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rater_id: auth?.userdata?._id,
          rate: value,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((rateData) => {
          setData({
            ...data,
            user: {
              ...data?.user,
              reputation: rateData?.reputation,
              ratingCount: rateData?.ratingCount,
              rate: rateData?.rate,
            },
          });
        });
    } catch (error) {
      showToast("Failed to save", "error");

      console.error(error);
    }
  };

  return (
    <>
      <div className="PostPage">
        <div className="container">
          <section className="photos">
            {images && images.length > 0 ? (
              <Carousel thumbnails counter>
                {images.map((image, index) => (
                  <img key={index} src={`${image.imageURL}`} />
                ))}
              </Carousel>
            ) : (
              defaultBlock
            )}
          </section>
          <header>
            <h1>{data?.title}</h1>
            <h2 className="">${data?.price?.toLocaleString()}</h2>
            <div className="meta-data">
              <span className="date">
                Posted on
                {data?.createdAt &&
                  new Date(data?.createdAt).toLocaleDateString()}
              </span>{" "}
              <span className="views">views: {data?.views}</span>
            </div>
          </header>
          <section className="actions">
            <div className="btn-group">
              {isOwner ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate("/edit", { state: { postData: data } });
                  }}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button variant="primary">
                    <FaPhone /> Call
                  </Button>
                  <Button variant="primary" onClick={handleMessage}>
                    <FaMessage /> Message
                  </Button>
                </>
              )}
            </div>
            <Button variant="secondary">share</Button>
          </section>
          <section
            className="user"
            onClick={() => navigate(`/user/${data?.user_id}`)}
          >
            <div className="profile-image">
              {data?.user?.profileImageUrl ? (
                <img src={data?.user?.profileImageUrl} />
              ) : (
                <DefaultProfile size="sm" />
              )}
            </div>
            <div className="user-details">
              <h2 className="name">{data?.user?.name}</h2>
              <div className="rating" onClick={(e) => e.stopPropagation()}>
                <ReactStars
                  key={rating}
                  value={rating}
                  count={5}
                  onChange={handleRating}
                  size={28}
                  edit={
                    !auth && auth?.userData?._id === data?.user?._id
                      ? false
                      : true
                  }
                  half={true}
                  isHalf={true}
                  emptyIcon={<FaRegStar />}
                  halfIcon={<FaStarHalfAlt />}
                  filledIcon={<FaStar />}
                  activeColor="var(--primary)"
                />
                <div className="ratingCount">({data?.user?.ratingCount})</div>
              </div>
            </div>
          </section>
          <section className="details">
            <h2>Vehicle Details</h2>
            <div>
              <span className="label">Make: </span>
              <span className="data">{data?.car?.make || "N/A"}</span>
            </div>
            <div>
              <span className="label">Model: </span>
              <span className="data">{data?.car?.model || "N/A"}</span>
            </div>
            <div>
              <span className="label">Body Type: </span>
              <span className="data">{data?.car?.bodyType || "N/A"}</span>
            </div>
            <div>
              <span className="label">Year: </span>
              <span className="data">{data?.car?.year || "N/A"}</span>
            </div>
            <div>
              <span className="label">Mileage: </span>
              <span className="data">
                {data?.car?.mileage
                  ? `${data.car.mileage.toLocaleString()} km`
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="label">Condition: </span>
              <span className="data">{data?.car?.condition || "N/A"}</span>
            </div>
            <div>
              <span className="label">Fuel Type: </span>
              <span className="data">{data?.car?.fuel || "N/A"}</span>
            </div>
            <div>
              <span className="label">Horsepower: </span>
              <span className="data">
                {data?.car?.hp ? `${data.car.hp} HP` : "N/A"}
              </span>
            </div>
            <div>
              <span className="label">Transmission: </span>
              <span className="data">{data?.car?.transmission || "N/A"}</span>
            </div>
          </section>
          <section className="location">
            <h2> Location</h2>

            <div className="address">
              <FaLocationDot style={{ color: "var(--primary)" }} />
              {data?.location?.address || "N/A"}
            </div>
            <div className="map">
              <iframe
                width="350"
                height="225"
                frameBorder="0"
                scrolling="no"
                src={getEmbeddedMapURL({
                  longitude: data?.location?.longitude,
                  latitude: data?.location?.latitude,
                })}
              ></iframe>
            </div>
          </section>
          <section className="desc">
            <h2>Description</h2>
            {data?.desc || <div className="empty-txt">No Description</div>}
          </section>
          <section className="stats">
            <h2>Analyze & Stats</h2>

            <div className="empty-txt">WIP</div>
          </section>
          <section className="bids">
            <h2>Bids</h2>
            <div className="list flex-col gap-1em">
              {bids?.length ? (
                bids.map((bid) => (
                  <div key={bid?._id} className="bid">
                    <div className="user-profile-image">
                      {bid?.user?.profileImageUrl ? (
                        <img src={bid.user.profileImageUrl} />
                      ) : (
                        <DefaultProfile size="xs" round />
                      )}
                    </div>
                    <div className="user-name">{bid?.user?.name}</div>

                    <div className="amount">
                      ${bid?.amount?.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-txt">No Bids</div>
              )}
            </div>

            <div className="footer flex gap-05em">
              <Input
                value={bid}
                onChange={(e) => {
                  setBid(e.target.value);
                }}
                placeholder="Enter bid..."
              />
              <Button variant="primary" onClick={handleBid}>
                Bid
              </Button>
            </div>
          </section>
          <section className="comments">
            <h2>Comments</h2>
            <div className="list flex-col gap-1em">
              {comments?.length ? (
                comments.map((comment) => (
                  <div key={comment?._id} className="comment">
                    <div className="user-profile-image">
                      {comment?.user?.profileImageUrl ? (
                        <img src={comment.user.profileImageUrl} />
                      ) : (
                        <DefaultProfile size="xs" round />
                      )}
                    </div>
                    <div className="user-name">{comment?.user?.name}</div>

                    <div className="text">{comment?.text}</div>
                  </div>
                ))
              ) : (
                <div className="empty-txt">No Comments</div>
              )}
            </div>

            <div className="footer flex-col gap-05em">
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="Enter comment..."
                cols={2}
                rows={3}
                style={{padding:'1em'}}
              />
              <Button variant="primary" onClick={handleComment}>
                Comment
              </Button>
            </div>
          </section>
          <section className="similar-posts">
            <h3>Similar Posts</h3>
          </section>
          <section
            className="privacy-notice"
            style={{ gridColumn: "3/4", gridRow: "6/7" }}
          >
            <Alert type="info">
              <h3>Notice</h3>Site stores one-way IP hashings without consent to
              avoid duplicated views
            </Alert>
          </section>
        </div>
      </div>
    </>
  );
};

PostPage.propTypes = {
  data: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.object),

    car: PropTypes.shape({
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      condition: PropTypes.string.isRequired,
      bodyType: PropTypes.string.isRequired,
      fuel: PropTypes.string.isRequired,
      transmission: PropTypes.string.isRequired,
      mileage: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      hp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),

    location: PropTypes.shape({
      countyCode: PropTypes.string.isRequired,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

PostPage.defaultProps = {
  data: {
    user_id: "",
    title: "",
    price: 0,
    images: [],

    car: {
      make: "",
      model: "",
      condition: "",
      bodyType: "",
      fuel: "",
      mileage: "",
      hp: "",
      year: "",
      transmission: "",
    },

    location: {
      countyCode: "",
      latitude: null,
      longitude: null,
    },
  },
};
export default PostPage;
