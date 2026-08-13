import clsx from "clsx";
import { Marker } from "./Marker.jsx";

const Button = ({
  icon,
  children,
  href,
  containerClassName,
  onClick,
  fill,
}) => {
  const Inner = () => (
    <>
      <span className="relative flex items-center min-h-[60px] px-4 g4 rounded-2xl inner-before group-hover:before:opacity-100 overflow-hidden">
        <span className="absolute -left-[1px]">
          <Marker fill={fill} />
        </span>

        {icon && (
          <img
            src={icon}
            alt="icon"
            className="size-10 mr-5 object-contain z-10"
          />
        )}

        <span className="relative z-2 font-poppins base-bold text-p1 uppercase whitespace-nowrap">
          {children}
        </span>
      </span>

      <span className="glow-before glow-after" />
    </>
  );
  
  const commonClasses = clsx(
    "relative p-0.5 g5 rounded-2xl shadow-500 group inline-block",
    containerClassName,
  );

  return href ? (
    <a className={commonClasses} href={href} target={href.startsWith('http') ? "_blank" : undefined} rel="noreferrer">
      <Inner />
    </a>
  ) : (
    <button className={commonClasses} onClick={onClick}>
      <Inner />
    </button>
  );
};
export default Button;
