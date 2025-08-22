import { useState } from "react";
import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Button } from "@/components/common/ui/button";
import { useNavigate } from "react-router";
import {
  FileText,
  Wrench,
  CheckCircle2,
  GitBranchPlus,
  PenLine,
} from "lucide-react";

const VERSION = "v0.9.3";
const LAST_UPDATED = "2025-08-18";

const PRODUCTS = [
  {
    slug: "transcript",
    title: "회의록 자동화",
    desc: "음성 채팅 기반 회의록 작성 및 공유",
    bullets: ["실시간 음성 인식", "자동 회의록 생성", "GitHub 공유 기능"],
    icon: <FileText className="h-5 w-5" />,
  },
];

export default function Docs() {
  const nav = useNavigate();
  const [todo, setTodo] = useState({ addCard: false, writeDetail: false });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
  
      <section className="mb-10">
        <Heading level={1} className="text-4xl font-extrabold">
          LOCH 문서
        </Heading>
        <Paragraph className="text-muted-foreground mt-3">
          주요 기능을 간단히 살펴보고, 자세한 내용은 문서에서 확인하세요.
        </Paragraph>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="inline-flex items-center rounded-full px-2.5 py-1 border bg-secondary text-secondary-foreground">
            버전 {VERSION}
          </span>
          <span className="text-muted-foreground">
            최종 업데이트 {LAST_UPDATED}
          </span>
        </div>
      </section>

      
      <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] items-start gap-6">
        
        <div>
          <h2 className="text-xl font-semibold mb-4">기능</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRODUCTS.map((p) => (
              <div
                key={p.slug}
                className="relative rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(var(--tw-prose-bullets, rgba(0,0,0,0.06)) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                  backgroundPosition: "calc(12px/2) calc(12px/2)",
                }}
              >
              
                <span
                  className="absolute left-0 top-0 h-full w-[6px] bg-gradient-to-b from-primary/80 via-primary to-primary/60"
                  aria-hidden="true"
                />

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-md border bg-background/60 backdrop-blur flex items-center justify-center text-xs shrink-0">
                    {p.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                    <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                      {p.bullets.map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

             
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => nav(`/docs/${p.slug}`)}
                    className="mx-auto"
                  >
                    설명서 열기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

 
        <aside className="xl:sticky xl:top-8 xl:-mt-60 relative">
          <div className="rounded-2xl border p-6 bg-gradient-to-br from-muted/60 via-transparent to-transparent shadow-md 
                          ring-2 ring-primary/40 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">개발자 안내판</p>
                <p className="text-sm text-muted-foreground">
                  기능이 추가되면 아래 항목을 완료하고 문서를 갱신하세요.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <DevCheck
                label="기능 카드 추가"
                icon={<GitBranchPlus className="h-4 w-4" />}
                done={todo.addCard}
                onToggle={() =>
                  setTodo((t) => ({ ...t, addCard: !t.addCard }))
                }
              />
              <DevCheck
                label="상세 문서 작성"
                icon={<PenLine className="h-4 w-4" />}
                done={todo.writeDetail}
                onToggle={() =>
                  setTodo((t) => ({ ...t, writeDetail: !t.writeDetail }))
                }
              />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              * 내부용 안내판입니다. 배포 대상이 아닙니다.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}


function DevCheck({
  label,
  icon,
  done,
  onToggle,
}: {
  label: string;
  icon: React.ReactNode;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "w-full flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition",
        "hover:bg-accent",
        done
          ? "border-green-300/60 bg-green-50 dark:bg-green-900/20"
          : "",
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-2 text-left">
        {icon}
        {label}
      </span>
      {done && (
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      )}
    </button>
  );
}
