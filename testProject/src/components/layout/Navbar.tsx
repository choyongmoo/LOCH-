import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#23272a] text-white">
      <Link to="/" className="text-2xl font-bold">
        LOCH
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="px-4 py-2">
              제품
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="px-4 py-2">
              다운로드
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="px-4 py-2">
              고객지원
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="default" size="sm">
            로그인
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="default" size="sm">
            회원가입
          </Button>
        </Link>
      </div>
    </header>
  );
}
