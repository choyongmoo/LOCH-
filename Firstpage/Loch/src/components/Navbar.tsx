import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle2,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* 왼쪽: 로고 */}
        <Link to="/" className="text-xl font-bold">
          LOCH
        </Link>

        {/* 가운데: 메뉴 */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle2()}>
                기능1
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/discover" className={navigationMenuTriggerStyle2()}>
                기능2
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className={navigationMenuTriggerStyle2()}>
                기능3(추가할거면 이거 추가한거처럼 추가)
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* 오른쪽: 로그인 */}
        <Link
          to="/login"
          className="px-4 py-2 text-sm rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
        >
          Login
        </Link>
      </div>
    </header>
  )
}

export default Navbar
