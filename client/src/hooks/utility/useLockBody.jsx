const useLockBody = (toggle) => {
  if (toggle) {
    document.body.style.overflow = "hidden";
    
    document.body.style.pointerEvents = "none";
    document.body.style.userSelect = "none !important";
    document.body.style.pointerEvents = "none";
  } else {
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
        document.body.style.userSelect = "";
  }
};

export default useLockBody;
