import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";

const teamMembers = [
  {
    name: "조용무",
    role: "팀장",
    studentId: "202307012",
    image: "https://github.com/choyongmoo.png",
    github: "https://github.com/choyongmoo",
  },
  {
    name: "오택현",
    role: "팀원",
    studentId: "202107028",
    image: "https://github.com/Ohteakhyeon.png",
    github: "https://github.com/Ohteakhyeon",
  },
  {
    name: "임현성",
    role: "팀원",
    studentId: "202307032",
    image: "https://github.com/hyeonsl.png",
    github: "https://github.com/hyeonsl",
  },
  {
    name: "황자준",
    role: "팀원",
    studentId: "202307072",
    image: "https://github.com/jajoon123.png",
    github: "https://github.com/jajoon123",
  },
];

export const Team = () => {
  return (
    <section
      id="team"
      className="min-h-[calc(100vh-80px)] container mx-auto pt-12 pb-32 transition-colors duration-300"
    >
      <div className="text-center mb-20">
        <Heading
          level={1}
          className="text-5xl font-extrabold text-gray-900 dark:text-white"
        >
          팀원 소개
        </Heading>
        <Paragraph muted className="text-xl mt-4">
          함께 프로젝트를 만들어 간 팀원들을 소개합니다.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center"
          >
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              title={`${member.name} GitHub`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 dark:border-gray-700 mb-4 transition-transform hover:scale-105"
              />
            </a>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {member.name}
            </h3>

            <p className="text-sm text-muted-foreground">{member.role}</p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              학번: {member.studentId}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
