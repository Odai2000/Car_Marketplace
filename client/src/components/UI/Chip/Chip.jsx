// TODO: Make it cancelable; 
// add the ability to navigate as a tag
import "./Chip.css";

const Chip = ({ type = "info",className,style,fontSize="font-xs",children}) => {
  return (
    <div className={`Chip ${type} ${fontSize} ${className}`} style={{ ...style}  }>
    {children}
    </div>
  );
};

export default Chip;