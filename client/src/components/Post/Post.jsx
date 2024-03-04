import Button from "../UI/Button/Button";
function Post() {
  return (
    <div className="post">
      <div className="cor"></div>

      <h3>Title</h3>

      <span>Location</span>

      <div className="car-specs">
        <span>Type</span>
        <span>Make Model</span>
        <span>2010</span>
      </div>

      <Button variant="primary">Call</Button>

      <Button variant="primary">Message</Button>
    </div>
  );
}

export default Post;
