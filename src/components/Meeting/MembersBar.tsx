import React, { useState } from "react";
import type { MembersBarProps } from "@/pages/Meeting/types";

export const MembersBar = ({ members, onOpenDetails, onUserClick }: MembersBarProps) => {
  const [hovered, setHovered] = useState(false);

  const iconSize = 40;
  const baseOffset = 8;
  const expandedOffset = 30;
  const containerWidth = iconSize + (members.length - 1) * expandedOffset;

  return (
    <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
      <div
        className="relative select-none -mr-14"
        style={{ width: containerWidth, height: iconSize }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="접속 멤버"
      >
        {members.map((name, i) => {
          const offset = hovered
            ? -expandedOffset * (members.length - 1 - i)
            : -baseOffset * (members.length - 1 - i);

          return (
            <div
              key={i}
              title={name}
              className="absolute top-0 w-10 h-10 rounded-full bg-[#5865F2] text-white flex items-center justify-center text-sm font-semibold border-2 border-white/30 shadow-lg cursor-pointer transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(${offset}px)`, 
                zIndex: i + 1,
              }}
              onClick={() => onUserClick?.(name)}
            >
              {name.slice(0, 2)}
            </div>
          );
        })}
      </div>

      <button
        onClick={onOpenDetails}
        className="px-4 py-2 bg-[#5865F2] text-white rounded-full shadow hover:bg-[#4752c4] transition"
      >
        회의방 상세정보
      </button>
    </div>
  );
};
