import "./Chip.css";

const Chip = ({ type = "info",className,style,fontSize="font-xs",children}) => {
  return (
    <div className={`Chip ${type} ${fontSize} ${className}`} style={{ ...style}  }>
      <span className="chip-text">{children}</span>
    </div>
  );
};

export default Chip;