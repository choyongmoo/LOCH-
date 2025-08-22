import React from "react";
import zustandLogo from "@/assets/landing/zus.jpg";
import awsLogo from "@/assets/landing/aws.png";


type StackItem = { label: string; icon?: React.ReactNode };
type StackColumnProps = { title: string; items: StackItem[] };

const StackColumn = ({ title, items }: StackColumnProps) => {
  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
      <h3 className="text-center text-sm font-extrabold tracking-wider text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center gap-3 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-800 dark:text-gray-100 text-sm font-semibold"
          >
            {it.icon}
            <span className="w-full text-center">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


const IconImg = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    className="w-5 h-5 object-contain select-none"
    loading="lazy"
    draggable={false}
  />
);

const FRONTEND: StackItem[] = [
  { label: "React", icon: <IconImg src="https://cdn.simpleicons.org/react" alt="React" /> },
  { label: "Axios", icon: <IconImg src="https://avatars.githubusercontent.com/u/32372333?s=200&v=4" alt="Axios" /> },
  { label: "Socket.IO Client", icon: <IconImg src="https://cdn.simpleicons.org/socketdotio" alt="Socket.IO" /> },
  { label: "Zustand", icon: <IconImg src={zustandLogo} alt="Zustand" /> },   // ✅ 로컬 이미지
  { label: "Tailwind CSS", icon: <IconImg src="https://cdn.simpleicons.org/tailwindcss" alt="TailwindCSS" /> },
];

const BACKEND_SUPABASE: StackItem[] = [
  { label: "Supabase Auth", icon: <IconImg src="https://cdn.simpleicons.org/supabase" alt="Supabase" /> },
  { label: "Supabase Database", icon: <IconImg src="https://cdn.simpleicons.org/supabase" alt="Supabase" /> },
  { label: "Supabase Realtime", icon: <IconImg src="https://cdn.simpleicons.org/supabase" alt="Supabase" /> },
];

const DATABASE: StackItem[] = [
  { label: "PostgreSQL (via Supabase)", icon: <IconImg src="https://cdn.simpleicons.org/postgresql" alt="PostgreSQL" /> },
];

const DEVOPS: StackItem[] = [
  { label: "GitHub", icon: <IconImg src="https://cdn.simpleicons.org/github" alt="GitHub" /> },
  { label: "Postman", icon: <IconImg src="https://cdn.simpleicons.org/postman" alt="Postman" /> },
  { label: "Docker", icon: <IconImg src="https://cdn.simpleicons.org/docker" alt="Docker" /> },
  { label: "AWS", icon: <IconImg src={awsLogo} alt="AWS" /> },  
];

export const Tech = () => {
  return (
    <section id="tech" className="relative w-full min-h-[88vh] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl">
     
        <div className="relative flex justify-center">
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <span className="text-base font-extrabold tracking-wide text-gray-800 dark:text-white">
              FULL STACK
            </span>
          </div>
          <div className="absolute left-0 right-0 top-1/2 translate-y-[42px] hidden md:block">
            <div className="mx-auto max-w-5xl border-t border-gray-300 dark:border-gray-700" />
          </div>
        </div>

      
        <div className="relative mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="hidden md:block absolute -top-10 left-0 right-0">
            <div className="grid grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex justify-center">
                  <div className="h-10 w-px bg-gray-300 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>

          <StackColumn title="FRONT-END" items={FRONTEND} />
          <StackColumn title="BACK-END (Supabase)" items={BACKEND_SUPABASE} />
          <StackColumn title="DATABASE" items={DATABASE} />
          <StackColumn title="DEVOPS" items={DEVOPS} />
        </div>
      </div>
    </section>
  );
};

export default Tech;
