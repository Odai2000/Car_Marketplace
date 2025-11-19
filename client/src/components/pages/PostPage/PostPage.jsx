import "./PostPage.css";
import { useEffect, useState } from "react";
import Input from "../../UI/FormControls/Input";
import Button from "../../UI/Button/Button";
import Alert from "../../UI/Alert/Alert";
import useMap from "../../../hooks/useMap";
import useAuthModal from "../../../hooks/useAuthModal";
import PropTypes from "prop-types";
import DefaultProfile from "../../UI/Utility/DefaultProfile/DefaultProfile";
import useConfig from "../../../hooks/useConfig";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../../UI/Carousel/Carousel";
import {
  FaCamera,
  FaEllipsisVertical,
  FaLocationDot,
  FaMessage,
  FaPhone,
  FaRegStar,
  FaStar,
} from "react-icons/fa6";
import useToast from "../../../hooks/useToast";
import useDialog from "../../../hooks/useDialog";
import useAuth from "../../../hooks/useAuth";
import useAuthFetch from "../../../hooks/useAuthFetch";
import ReactStars from "react-rating-stars-component";
import { FaStarHalfAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import NumericInput from "../../UI/FormControls/NumericInput/NumericInput";
import Dropdown from "../../UI/Dropdown/Dropdown";

const PostPage = () => {
  const [comments, setComments] = useState([]);
  const [bids, setBids] = useState([]);
  const [rating, setRating] = useState(0);
  const [bid, setBid] = useState("");
  const [comment, setComment] = useState("");
  const [totalComments, setTotalComments] = useState("");
  const [commentTextFocus, setCommentTextFocus] = useState(false);

  const [commentsPagination, setCommentsPagination] = useState(0);
  const [data, setData] = useState({});

  const { auth, setAuth } = useAuth();
  const authFetch = useAuthFetch();
  const { config } = useConfig();
  const { showToast } = useToast();
  const { openDialog } = useDialog();
  const { openLogin } = useAuthModal();
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
    data?.user_id && navigate(`/chat/${data?.user_id}`);
  };

  const handleCall = async () => {
    console.log(await openDialog());
    return;
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
  const handleDeleteComment = async (_id) => {
    try {
      const response = await authFetch(
        `${config.serverURL}/comment/${_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error('Failed to delete comment')
      setComments(prev=>prev.filter((cmt)=>cmt._id!==_id))
    } catch (error) {
      showToast("Failed to delete comment", "error");

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

  const loadComments = async () => {
    try {
      const nextPage = commentsPagination + 1;
      const response = await fetch(
        `${config.serverURL}/comment/post/${data?._id}?page=${nextPage}&limit=${config?.commentLimit}`
      );

      const fetchedComments = await response.json();
      setComments((prev) => [...prev, ...fetchedComments.comments]);
      setTotalComments(fetchedComments.totalComments);
      setCommentsPagination(nextPage);
    } catch (error) {
      showToast("Failed to load comments", "error");
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

  const dropdownOpts = (
    <>
      {isOwner || isAdmin ? (
        <>
          <li>Archive</li>
          <li onClick={handleDelete}>Delete</li>
        </>
      ) : isUser ? (
        <>
          {isSaved ? (
            <li onClick={handleUnsave}>Unsave</li>
          ) : (
            <li onClick={handleSave}>Save</li>
          )}
          <li>Report</li>
        </>
      ) : null}
    </>
  );

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
            <h1>{data?.title || <Skeleton width="40ch" />}</h1>
            <h2 className="">${data?.price?.toLocaleString()}</h2>
            <div className="meta-data">
              <span className="date">
                <span>Posted on </span>
                {data?.createdAt &&
                  new Date(data?.createdAt).toLocaleDateString()}
              </span>

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
                  <Button
                    variant="primary"
                    onClick={auth ? handleCall : openLogin}
                  >
                    <FaPhone /> Call
                  </Button>
                  <Button
                    variant="primary"
                    onClick={auth ? handleMessage : openLogin}
                  >
                    <FaMessage /> Message
                  </Button>
                </>
              )}
            </div>
            <div className="page-control flex" style={{ alignItems: "center" }}>
              <div
                className="share-container flex gap-1em round"
                style={{
                  border: "1px solid var(--primary)",
                  padding: ".5em",
                  overflow: "hidden",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textWrap: "nowrap",
                }}
              >
                <span>{document.URL}</span>
                <Button
                  variant="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(document.URL);
                    showToast("Copied", "success");
                  }}
                >
                  copy URL
                </Button>
              </div>
              <Dropdown
                className="opts-btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                trigger={
                  <Button
                    styleName="opts-btn"
                    variant="icon"
                    onClick={() => {}}
                  >
                    <div className="overlay">
                      <FaEllipsisVertical color="var(--primary)" />
                    </div>
                  </Button>
                }
              >
                <ul>{dropdownOpts} </ul>
              </Dropdown>
            </div>
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
              <span className="data">{data?.car?.make || <Skeleton />}</span>
            </div>
            <div>
              <span className="label">Model: </span>
              <span className="data">{data?.car?.model || <Skeleton />}</span>
            </div>
            <div>
              <span className="label">Body Type: </span>
              <span className="data">
                {data?.car?.bodyType || <Skeleton />}
              </span>
            </div>
            <div>
              <span className="label">Year: </span>
              <span className="data">{data?.car?.year || <Skeleton />}</span>
            </div>
            <div>
              <span className="label">Mileage: </span>
              <span className="data">
                {data?.car?.mileage ? (
                  `${data.car.mileage.toLocaleString()} km`
                ) : (
                  <Skeleton />
                )}
              </span>
            </div>
            <div>
              <span className="label">Condition: </span>
              <span className="data">
                {data?.car?.condition || <Skeleton />}
              </span>
            </div>
            <div>
              <span className="label">Fuel Type: </span>
              <span className="data">{data?.car?.fuel || <Skeleton />}</span>
            </div>
            <div>
              <span className="label">Horsepower: </span>
              <span className="data">
                {data?.car?.hp ? `${data.car.hp} HP` : <Skeleton />}
              </span>
            </div>
            <div>
              <span className="label">Transmission: </span>
              <span className="data">
                {data?.car?.transmission || <Skeleton />}
              </span>
            </div>
          </section>
          <section className="location">
            <h2> Location</h2>

            <div className="address">
              <FaLocationDot style={{ color: "var(--primary)" }} />
              {data?.location?.address || <Skeleton />}
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
            <div className="bids-interface">
              <div
                className={`list flex-col gap-1em ${
                  isOwner ? "full-border" : ""
                }`}
              >
                {bids?.length ? (
                  bids.map((bid) => (
                    <div key={bid?._id} className="bid">
                      <div
                        className="left flex gap-05em"
                        style={{ alignItems: "center" }}
                      >
                        <div className="user-profile-image round">
                          {bid?.user?.profileImageUrl ? (
                            <img src={bid.user.profileImageUrl} />
                          ) : (
                            <DefaultProfile size="xs" round />
                          )}
                        </div>
                        <div className="user-name"><Button varaint="link"  onClick={()=>navigate(`/user/${comment?.user?._id}`)} >{bid?.user?.name}</Button></div>
                        <div className="actions">
                          {isOwner && (
                            <Button
                              variant="link"
                              onClick={() =>
                                navigate(`/chat/${bid?.user?._id}`)
                              }
                            >
                              Chat
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="right">
                        <div className="amount">
                          ${bid?.amount?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-bids">
                    <img
                      src="../../../../dist/assets/hour-glass.svg"
                      style={{ width: "16rem", height: "12rem" }}
                    />
                    <h1 style={{ color: "var(--primary)", fontWeight: "500" }}>
                      No bids yet...
                    </h1>
                  </div>
                )}
              </div>
              {!isOwner && (
                <div className="bids-control footer flex gap-05em">
                  <h2 className="col-3">Offer a price:</h2>
                  <span className="biggest-bid" style={{ fontSize: "1.25em" }}>
                    Highiest bid: {`$${bids[0]?.amount?.toLocaleString() || 0}`}
                  </span>
                  <div className="bid-options">
                    {[0.25, 0.5, 0.75, 1.25, 1.5, 1.75].map((x, i) => {
                      return (
                        <Button
                          styleName="option"
                          key={`opt-${i}`}
                          variant="secondary round"
                          onClick={() => {
                            setBid(data?.price * x);
                          }}
                        >
                          {(data?.price * x).toLocaleString()}
                        </Button>
                      );
                    })}
                  </div>
                  <NumericInput
                    value={bid}
                    onChange={setBid}
                    placeholder="Enter bid..."
                    style={{ position: "relative" }}
                  >
                    <Button
                      variant="primary"
                      onClick={auth ? handleBid : openLogin}
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: ".75em",
                      }}
                    >
                      Make offer
                    </Button>
                  </NumericInput>
                </div>
              )}
            </div>
          </section>
          <section className="comments">
            <h2>Comments</h2>

            <div className="comment-box">
              <textarea
                className={`comment-textarea ${
                  commentTextFocus ? "focused" : ""
                }`}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="Enter comment..."
                // cols={2}
                // rows={3}
              />
              <div className="comment-box-control">
                {" "}
                <Button
                  variant="primary"
                  onClick={auth ? handleComment : openLogin}
                >
                  Comment
                </Button>
              </div>
            </div>
            <div className="list flex-col gap-1em">
              {comments?.length ? (
                comments.map((comment) => (
                  <div key={comment?._id} className="comment">
                    <div className="user-profile-image round">
                      {comment?.user?.profileImageUrl ? (
                        <img src={comment.user.profileImageUrl} />
                      ) : (
                        <DefaultProfile size="xs" round />
                      )}
                    </div>
                    <div className="comment-header flex gap-05em">
                      <div className="user-name"><Button variant="link" onClick={()=>navigate(`/user/${comment?.user?._id}`)}>{comment?.user?.name}</Button> </div>
                      <div className="date">{`posted on ${
                        comment?.createdAt &&
                        new Date(comment?.createdAt).toLocaleDateString()
                      }`}</div>
                    </div>

                    <div className="text">{comment?.text}</div>
                    <div className="comment-control flex gap-0.5em">
                      {auth?.userData?._id===comment?.user?._id?<>
                  
                      <Button variant="link" onClick={() => handleDeleteComment(comment._id)}>
                        delete
                      </Button></>:<>    <Button variant="link" onClick={() => {}}>
                        reply
                      </Button></>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-txt">No Comments</div>
              )}
            </div>
            {totalComments - config?.commentsLimit * commentsPagination > 0 && (
              <Button variant="secondary round" onClick={loadComments}>
                Load more comments
              </Button>
            )}
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
