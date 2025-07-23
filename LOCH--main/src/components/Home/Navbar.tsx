"use client";

import * as React from "react";
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

// 기능 소개 서브 메뉴 항목
const features: { title: string; href: string; description: string }[] = [
  {
    title: "실시간 코드 편집",
    href: "/features/code",
    description: "여러 사용자가 동시에 코드를 작성하고 리뷰할 수 있는 편집기",
  },
  {
    title: "회의 및 일정 관리",
    href: "/features/meeting",
    description: "회의 예약, 알림, 채팅 및 화상 회의까지 통합된 회의 관리",
  },
  {
    title: "회의록 자동 생성",
    href: "/features/minutes",
    description: "음성을 텍스트로 변환하고 요약하여 회의록으로 자동 저장",
  },
  {
    title: "문서 & 스프레드시트",
    href: "/features/docs",
    description: "문서, 엑셀을 공동 작성하며 실시간으로 협업",
  },
  {
    title: "화이트보드",
    href: "/features/whiteboard",
    description: "아이디어를 자유롭게 표현하고 공유할 수 있는 협업 공간",
  },
];

export function Navbar() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>

        {/* 홈 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">홈</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* 소개 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/about">소개</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* 기능 소개 */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>기능</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {features.map((feature) => (
                <ListItem
                  key={feature.title}
                  title={feature.title}
                  href={feature.href}
                >
                  {feature.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 시작 가이드 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/getting-started">시작 가이드</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* 팀 소개 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/team">팀 소개</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* 고객지원 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/faq">고객지원</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* 기술 문서 */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/docs">기술 문서</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
}

// 메뉴 리스트 아이템 컴포넌트
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
