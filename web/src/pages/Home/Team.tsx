import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";

const teamMembers = [
  {
    name: "조용무",
    role: "팀장 / 백엔드",
    studentId: "202307012",
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leader", // 예시 이미지
    tasks: ["DB 설계 및 연동", "Postgre 테이블 설계", "무결성 관리 / 쿼리 최적화"],
  },
  {
    name: "오택현",
    role: "백엔드",
    studentId: "202107028",
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Backend", // 예시 이미지
    tasks: ["API 개발", "Spring Boot 기반 REST API 설계 / 구현"],
  },
  {
    name: "임현성",
    role: "프론트엔드",
    studentId: "202307032",
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Frontend", // 예시 이미지
    tasks: ["UI/UX 설계", "레이아웃 구성", "사용자 피드백 반영"],
  },
  {
    name: "황자준",
    role: "프론트엔드",
    studentId: "202307072",
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Dev", // 예시 이미지
    tasks: ["기능 구현", "React 컴포넌트 구현", "API 연동 및 상태 관리"],
  },
];

export const Team = () => {
  return (
 <section
  id="team"
  className="min-h-[calc(100vh-80px)] container mx-auto pt-12 pb-32 transition-colors duration-300"
> 

      {/* 타이틀 */}
      <div className="text-center mb-20">
        <Heading level={1} className="text-5xl font-extrabold text-gray-900 dark:text-white">
          팀원 소개
        </Heading>
        <Paragraph muted className="text-xl mt-4">
          함께 프로젝트를 만들어 간 팀원들을 소개합니다.
        </Paragraph>
      </div>

      {/* 팀원 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center"
          >
            {/* 프로필 이미지 */}
            <img
              src={member.image}
              alt={member.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 dark:border-gray-700 mb-4"
            />

            {/* 이름 및 역할 */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>

            {/* 학번 */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              학번: {member.studentId}
            </p>

            {/* 업무 리스트 */}
            <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {member.tasks.map((task, i) => (
                <li key={i}>· {task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>


    </section>
  );
};
