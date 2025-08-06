import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { ChevronDown } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import infraDiagram from "@/assets/infra-diagram.png";

const frontendTech = [
  { title: "React", description: "사용자 인터페이스 개발" },
  { title: "Axios", description: "HTTP 요청 처리" },
  { title: "Socket.IO-client", description: "실시간 양방향 통신" },
  { title: "Zustand", description: "로그인, 문서 상태 등 전역 정보 관리" },
  { title: "TailwindCSS", description: "UI 스타일링 및 컴포넌트 구성" },
];

const backendTech = [
  { title: "Spring Boot", description: "서버 구축 및 API 개발" },
  { title: "PostgreSQL", description: "데이터베이스 관리" },
  { title: "Spring Security + JWT", description: "사용자 인증 및 권한 관리" },
  { title: "JPA (Hibernate)", description: "ORM으로 DB 연동" },
  { title: "WebSocket", description: "실시간 통신" },
];

const devTools = [
  { title: "GitHub", description: "버전 관리 및 협업" },
  { title: "Postman", description: "API 테스트" },
  { title: "Docker", description: "개발 환경 컨테이너화" },
  { title: "AWS", description: "서버 호스팅" },
];

export const Tech = () => {
  return (
    <section
      id="tech"
      className="container mx-auto pt-6 pb-24 scroll-mt-32 transition-colors duration-300"
    >
      {/* 제목 */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
          기술 스택
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xl mt-4">
          프로젝트를 구성한 프론트엔드, 백엔드, 협업 도구 환경을 소개합니다.
        </p>
      </div>

      {/* 인프라 다이어그램 이미지 -> 여기에 이미지 나중에 넣어주기*/} 
      <div className="flex justify-center mb-12">
        <img
          src={infraDiagram}
          alt="인프라 아키텍처 다이어그램"
          className="w-[850px] h-[520px] object-contain mx-auto rounded-xl shadow-md border dark:brightness-90"
        />
      </div>

      {/*  아래로 스크롤 화살표 버튼 */}
      <div className="flex justify-center mb-20">
        <ScrollLink to="frontend-section" smooth={true} duration={500} offset={-40}>
          <button
            className="animate-bounce text-gray-400 hover:text-primary transition-all"
            aria-label="아래로 이동"
          >
            <ChevronDown className="w-10 h-10" />
          </button>
        </ScrollLink>
      </div>

      {/* 프론트엔드 */}
      <div id="frontend-section" className="mt-32 mb-16">
        <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">프론트엔드</h3>
        <Paragraph muted className="mb-8">
          사용자와 직접 상호작용하는 화면을 구성하고, 상태 관리 및 실시간 통신을 구현했습니다.
        </Paragraph>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {frontendTech.map((tech, idx) => (
            <Card key={idx} className="text-left">
              <CardHeader>
                <CardTitle>{tech.title}</CardTitle>
                <CardDescription>{tech.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>

      {/* 백엔드 */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">백엔드</h3>
        <Paragraph muted className="mb-8">
          서버 환경을 구성하고 데이터 처리, 인증, API 개발 등 핵심 로직을 구현했습니다.
        </Paragraph>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {backendTech.map((tech, idx) => (
            <Card key={idx} className="text-left">
              <CardHeader>
                <CardTitle>{tech.title}</CardTitle>
                <CardDescription>{tech.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>

      {/* 협업 및 개발 도구 */}
      <div>
        <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">협업 및 개발 도구</h3>
        <Paragraph muted className="mb-8">
          팀 협업, API 테스트, 배포 환경 구성 등 전반적인 개발 생태계를 구성했습니다.
        </Paragraph>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {devTools.map((tech, idx) => (
            <Card key={idx} className="text-left">
              <CardHeader>
                <CardTitle>{tech.title}</CardTitle>
                <CardDescription>{tech.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>

     <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-48" />
    </section>
  );
};
