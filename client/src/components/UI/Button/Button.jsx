import "./Button.css";

function Button({
  styleName,
  id,
  type = "button",
  variant = "secondary",
  destructive,
  onClick,
  children,
  icon,
  ...props
}) {
  const className = `btn ${variant} ${destructive ? "destructive" : ""} `;

  return (
    <button
      type={type}
      id={id}
      className={className + (styleName ? styleName : "")}
      onClick={onClick}
      {...props}
    >
      {(icon && <i className='icon' >{children}</i>) ||  children}
    </button>
  );
}

export default Button;
