import { Link } from "react-router";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img src="/src/assets/link.png" alt="River Logo" className="size-12" />
      <span className="text-3xl font-bold">LOCH</span>
    </Link>
  );
};
