import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Button } from "@/components/common/ui/button";
import { Link } from "react-router";

// 기능 소개 이미지
import CodeImage from "../../assets/feature-code.svg";
import NoteImage from "../../assets/feature-note.svg";
import DesignImage from "../../assets/feature-design.svg";
import CalendarImage from "../../assets/feature-calendar.svg";

export const About = () => {
  return (
    <div className="w-full text-foreground transition-colors">
      <section className="w-full py-36 px-6 bg-transparent transition-colors">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          {/* 기능 태그 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm7 11v7h-7v-7h7z" />
            </svg>
            기능
          </div>
          {/* 타이틀 */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            목표 달성을 위한 <span className="text-primary">플랫폼</span>
          </h1>

          {/* 설명 */}
          <Paragraph size="lg" muted>
            팀 전체 업무 현황을 한눈에 파악하고, 전략적인 결정을 빠르고 자신 있게 내릴 수 있도록 돕습니다.
            LOCH는 효율적인 프로젝트 관리를 위한 최적의 협업 환경을 제공합니다.
          </Paragraph>

          {/* CTA 버튼 */}
         <Button asChild>
          <Link to="/signup">지금 시작하기</Link>
        </Button>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="max-w-6xl mx-auto px-6 py-32 space-y-32">
        {/* 기능 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <Heading level={2}>텍스트1</Heading>
            
          </div>
          <img src={CodeImage} alt="" className="rounded-xl shadow-lg" />
        </div>

        {/* 기능 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src={NoteImage}
            alt=""
            className="rounded-xl shadow-lg order-2 md:order-1"
          />
          <div className="space-y-4 order-1 md:order-2">
            <Heading level={2}>텍스트2</Heading>
            
          </div>
        </div>

        {/* 기능 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <Heading level={2}>텍스트3</Heading>
           
          </div>
          <img src={DesignImage} alt="" className="rounded-xl shadow-lg" />
        </div>

        {/* 기능 4 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src={CalendarImage}
            className="rounded-xl shadow-lg order-2 md:order-1"
          />
          <div className="space-y-4 order-1 md:order-2">
            <Heading level={2}>텍스트4</Heading>
          </div>
        </div>
      </section>
    </div>
  );
};
