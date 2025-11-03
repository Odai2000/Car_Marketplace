import "./PostSkeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const PostSkeleton = () => {
  return (
    <SkeletonTheme inline={true}>
      <div className="PostSkeleton">
        <div className="post-img-container">
          <Skeleton height="100%" width="100%" style={{display:"block",inset:0,position:'absolute'}} />
        </div>

        <div className="post-details">
          <span className="post-title ">
            <Skeleton />
          </span>
          <span className="post-price">
            <Skeleton />
          </span>

          <span className="car-name">
            <Skeleton />
          </span>
          <span>
            <Skeleton />
          </span>
          <span>
            <Skeleton />
          </span>
          <span>
            <Skeleton />
          </span>
          <span>
            <Skeleton />
          </span>
          <span>
            <Skeleton />
          </span>
          <span>
            <Skeleton />
          </span>

          <span className="post-location">
            <Skeleton />
          </span>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PostSkeleton;
