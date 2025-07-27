import React, { useState } from "react";
import type { MembersBarProps } from "@/pages/Meeting/types";

export const MembersBar = ({ members, onOpenDetails, onUserClick }: MembersBarProps) => {
  const [hovered, setHovered] = useState(false);

  const iconSize = 40;
  const baseOffset = 8;
  const expandedOffset = 30;
  const containerWidth = iconSize + (members.length - 1) * expandedOffset;

  const commonCircleStyle = {
    position: "absolute" as const,
    top: 0,
    width: iconSize,
    height: iconSize,
    borderRadius: "9999px",
    backgroundColor: "#5865F2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: 600,
    border: "2px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 0 6px rgba(0,0,0,0.2)",
    right: 0,
    transition: "transform 0.3s ease",
    cursor: "pointer",
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      <div
        className="relative select-none"
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
              style={{ 
                ...commonCircleStyle, 
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
