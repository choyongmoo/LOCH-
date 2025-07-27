import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/ui/button";
import type { AppInstance } from '@/layouts/MeetingLayout';
import { useRef } from 'react';

interface ServerSidebarProps {
  onAppCreate?: (appType: string) => void;
  instances?: AppInstance[];
  hoveredType?: string | null;
  setHoveredType?: (type: string | null) => void;
}

export function ServerSidebar({ onAppCreate, instances = [], hoveredType, setHoveredType }: ServerSidebarProps) {
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className="flex flex-col items-center p-2 w-full h-full relative">
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => location.href = "/"}
          variant="default"
          size="icon"
          className="rounded-full mt-2 text-xs"
        >
          LOCH
        </Button>

        <div className="h-px bg-[#4F545C] w-10 my-1 rounded mx-auto" />

        {["P", "S", "N", "C"].map((server) => (
          <div key={server} className="relative">
            <Button
              draggable
              onDragStart={(e) => e.dataTransfer.setData("app", server)}
              onClick={() => onAppCreate?.(server)}
              variant="ghost"
              size="icon"
              className="rounded-sm"
              onMouseEnter={() => {
                if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                setHoveredType?.(server);
              }}
              onMouseLeave={() => {
                hoverTimeout.current = setTimeout(() => setHoveredType?.(null), 200);
              }}
            >
              {server}
            </Button>
            {/* 인스턴스 목록 슬라이드 */}
            {hoveredType === server && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50"
                onMouseEnter={() => {
                  if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                  setHoveredType?.(server);
                }}
                onMouseLeave={() => {
                  hoverTimeout.current = setTimeout(() => setHoveredType?.(null), 200);
                }}
              >
                <div
                  className="bg-[#2F3136] text-white rounded-lg shadow-lg px-4 py-2 min-w-[160px] animate-slide-in flex flex-row items-center gap-2"
                  style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)' }}
                >
                  {instances.filter(i => i.type === server).length === 0 ? (
                    <div className="text-gray-400 text-sm">생성된 인스턴스 없음</div>
                  ) : (
                    <div className="flex flex-row gap-2">
                      {instances.filter(i => i.type === server).map(i => (
                        <div
                          key={i.id}
                          className="truncate text-sm text-white bg-[#40444B] px-3 py-1 rounded hover:bg-[#5865F2] transition-colors cursor-pointer max-w-[120px]"
                          draggable
                          onDragStart={e => {
                            e.dataTransfer.setData("instance", JSON.stringify(i));
                          }}
                        >
                          {i.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <Button
          variant="destructive"
          size="icon"
          className="text-sm"
          onClick={() => alert("회의방에서 나갑니다.")}
        >
          OUT
        </Button>
      </div>
      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-24px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
