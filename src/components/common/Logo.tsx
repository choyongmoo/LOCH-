import { Link } from "react-router";

export const Logo = () => {
  return (
    <Link
      to="/"
      onClick={() => {
        if (window.location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className="flex items-center gap-3"
    >
      
      <span className="text-3xl font-bold">River</span>
    </Link>
  );
};
