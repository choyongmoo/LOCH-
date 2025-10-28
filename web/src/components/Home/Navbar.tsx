"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/common/ui/navigation-menu";
import { Link } from "react-router";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router";

export function Navbar() {
  const navigate = useNavigate();

  const handleIntroClick = (id: string) => {
    if (window.location.pathname !== "/") {
      (window as any).__scrollTo = id;
      navigate("/");
    }
  };

  return (
    <NavigationMenu viewport={false} className="relative z-50">
      <NavigationMenuList>

        <NavigationMenuItem>
          <NavigationMenuTrigger>소개</NavigationMenuTrigger>

          <NavigationMenuContent className="z-[60]">
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <ScrollLink
                  to="about"
                  smooth={true}
                  duration={500}
                  offset={0}
                  onClick={() => handleIntroClick("about")}
                >
                  <NavigationMenuLink asChild>
                    <div className="text-sm leading-none font-medium cursor-pointer">
                      주요 기능
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug mt-1">
                        어떤 기능들이 제공되는지 간단히 살펴보세요.
                      </p>
                    </div>
                  </NavigationMenuLink>
                </ScrollLink>
              </li>

              {/* 팀 소개 */}
              <li>
                <ScrollLink
                  to="team"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  onClick={() => handleIntroClick("team")}
                >
                  <NavigationMenuLink asChild>
                    <div className="text-sm leading-none font-medium cursor-pointer">
                      팀 소개
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug mt-1">
                        팀원 역할, 담당 파트, 사진 등 프로젝트를 함께 만든 구성원 소개
                      </p>
                    </div>
                  </NavigationMenuLink>
                </ScrollLink>
              </li>

              {/* 기술 스택 */}
              <li>
                <ScrollLink
                  to="tech"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  onClick={() => handleIntroClick("tech")}
                >
                  <NavigationMenuLink asChild>
                    <div className="text-sm leading-none font-medium cursor-pointer">
                      기술 스택
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug mt-1">
                        프론트엔드, 백엔드, 배포 환경 등 프로젝트에 사용된 기술들을 설명합니다.
                      </p>
                    </div>
                  </NavigationMenuLink>
                </ScrollLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 다운로드 메뉴 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/download">다운로드</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* 문서 메뉴 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/docs">문서</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
