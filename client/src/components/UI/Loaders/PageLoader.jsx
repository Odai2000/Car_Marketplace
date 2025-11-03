import FadeLoader from "react-spinners/FadeLoader";

const PageLoader = ({ isLoading = true, color = "var(--primary)", size = 150 }) => {
  return (
    <div
      className="PageLoader"    
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FadeLoader   
        color={color}
        loading={isLoading}
        size={size}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default PageLoader;
