import { useState, useRef } from "react";
import { PanelContent } from "./PanelContent";

interface DynamicPanel {
  id: number;
  app?: string;
  title?: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

interface ResizableGridLayoutProps {
  panels: DynamicPanel[];
  colSizes: number[];
  rowSizesLeft: number[];
  rowSizesRight: number[];
  onPanelDrop: (panelId: number, data: any) => void;
  onPanelSplit: (panelId: number, direction: 'row' | 'col') => void;
  onPanelClose: (panelId: number, onlyNum?: number) => void;
  onResize: (type: 'col' | 'rowLeft' | 'rowRight', values: number[]) => void;
  // swap 관련
  swapTarget?: number | null;
  onSwapApp?: (id: number) => void;
  onSwapHere?: (id: number) => void;
  onCancelSwap?: () => void;
}

type DraggingState = { type: 'row' | 'col' | 'rowLeft' | 'rowRight', idx: number, start: number, startSizes: number[] } | null;

export function ResizableGridLayout({ panels, colSizes, rowSizesLeft, rowSizesRight, onPanelDrop, onPanelSplit, onPanelClose, onResize, swapTarget, onSwapApp, onSwapHere, onCancelSwap }: ResizableGridLayoutProps) {
  // 리사이저 상태
  const [dragging, setDragging] = useState<DraggingState>(null);
  const draggingRef = useRef<DraggingState>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 마우스 이벤트 핸들러 (드래그 해제시 mousemove 리스너도 반드시 해제)
  const mouseMoveRef = useRef<(e: MouseEvent) => void>(null);
  const mouseUpRef = useRef<(e: MouseEvent) => void>(null);
  const onMouseDownResizer = (type: 'row' | 'col' | 'rowLeft' | 'rowRight', idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    const start = type === 'col' ? e.clientX : e.clientY;
    const startSizes = type === 'col' ? [...colSizes] : type === 'rowLeft' ? [...rowSizesLeft] : [...rowSizesRight];
    const dragState = { type, idx, start, startSizes };
    setDragging(dragState);
    draggingRef.current = dragState;

    const onMouseMove = (ev: MouseEvent) => {
      const dragging = draggingRef.current;
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (dragging.type === 'col') {
        const total = rect.width;
        const delta = ev.clientX - dragging.start;
        let s0 = dragging.startSizes[0] + (delta / total) * 100;
        let s1 = 100 - s0;
        s0 = Math.max(10, Math.min(90, s0));
        s1 = 100 - s0;
        onResize('col', [s0, s1]);
      } else if (dragging.type === 'rowLeft') {
        const total = rect.height;
        const delta = ev.clientY - dragging.start;
        let s0 = dragging.startSizes[0] + (delta / total) * 100;
        let s1 = 100 - s0;
        s0 = Math.max(10, Math.min(90, s0));
        s1 = 100 - s0;
        onResize('rowLeft', [s0, s1]);
      } else if (dragging.type === 'rowRight') {
        const total = rect.height;
        const delta = ev.clientY - dragging.start;
        let s0 = dragging.startSizes[0] + (delta / total) * 100;
        let s1 = 100 - s0;
        s0 = Math.max(10, Math.min(90, s0));
        s1 = 100 - s0;
        onResize('rowRight', [s0, s1]);
      }
    };
    const onMouseUp = () => {
      setDragging(null);
      draggingRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const resizerBase: React.CSSProperties = {
    opacity: 0,
    pointerEvents: 'auto',
    transition: 'background 0.18s, opacity 0.18s',
  };
  const resizerHover: React.CSSProperties = {
    background: '#5865F2',
    opacity: 1,
    transition: 'background 0.18s, opacity 0.18s',
  };
  const [hoveredResizer, setHoveredResizer] = useState<string | null>(null);

  // 동적으로 gridTemplateRows/Columns, 셀 배치
  return (
    <div
      id="grid-container"
      ref={containerRef}
      className="relative w-full h-full flex"
      style={{
        minHeight: 0,
        minWidth: 0,
        gap: '8px',
        padding: '12px',
        background: '#23272A',
        borderRadius: '18px',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
      }}
    >
      {/* 좌측 grid */}
      <div
        style={{
          width: `calc(${colSizes[0]}% - 6px)`,
          height: '100%',
          display: 'grid',
          gridTemplateRows: rowSizesLeft.map(s => `${s}%`).join(' '),
          gap: '8px',
          position: 'relative',
        }}
      >
        {panels.filter(p => p.col === 0).map(panel => (
          <div
            key={panel.id}
            style={{
              gridRow: `${panel.row + 1} / span ${panel.rowSpan}`,
              minWidth: 0,
              minHeight: 0,
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '14px',
              background: '#2F3136',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
              border: '1.5px solid #23243a',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 0.2s',
            }}
            className="group hover:shadow-lg focus-within:shadow-lg"
            onDrop={e => {
              e.preventDefault();
              const droppedApp = e.dataTransfer.getData("app");
              const droppedInstance = e.dataTransfer.getData("instance");
              if (droppedInstance) {
                try {
                  const instance = JSON.parse(droppedInstance);
                  onPanelDrop(panel.id, instance);
                } catch {}
                return;
              }
              if (droppedApp) {
                onPanelDrop(panel.id, droppedApp);
              }
            }}
            onDragOver={e => e.preventDefault()}
          >
            <PanelContent
              num={panel.id}
              app={panel.app}
              title={panel.title}
              onSplit={(num, droppedApp) => onPanelSplit(num, 'row')}
              onAppDrop={(appType, targetNum) => onPanelDrop(targetNum, appType)}
              onAdd={() => onPanelSplit(panel.id, 'row')}
              onClose={() => onPanelClose(panel.id)}
              onCloseAll={() => { onPanelClose(-1); }}
              onCloseOthers={() => { onPanelClose(-2, panel.id); }}
              openMenu={null}
              onToggleMenu={() => {}}
              maxPanelsReached={panels.length >= 4}
              showSwap={!!panel.app}
              showSwapHere={!!panel.app && swapTarget !== undefined && swapTarget !== null && swapTarget !== panel.id}
              isSwapTarget={swapTarget === panel.id}
              onSwapApp={onSwapApp ? () => onSwapApp(panel.id) : undefined}
              onSwapHere={onSwapHere ? () => onSwapHere(panel.id) : undefined}
              onCancelSwap={onCancelSwap}
            />
          </div>
        ))}
        {/* 상하(좌) 리사이저 */}
        {rowSizesLeft.length > 1 && panels.filter(p => p.col === 0).length === 2 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: '12px',
              zIndex: 50,
              cursor: 'row-resize',
              pointerEvents: 'auto',
              ...(dragging?.type === 'rowLeft' || hoveredResizer === 'rowLeft' ? resizerHover : resizerBase),
              borderRadius: '6px',
              top: `calc(${rowSizesLeft[0]}% - 6px)`,
            }}
            onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.cursor = 'row-resize'; setHoveredResizer('rowLeft'); }}
            onMouseOut={() => setHoveredResizer(null)}
            onMouseDown={e => onMouseDownResizer('rowLeft', 0, e)}
          />
        )}
      </div>
      {/* 좌우 리사이저 */}
      {colSizes.length > 1 && panels.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(${colSizes[0]}% - 6px)`,
            width: '12px',
            zIndex: 50,
            cursor: 'col-resize',
            pointerEvents: 'auto',
            ...(dragging?.type === 'col' || hoveredResizer === 'col' ? resizerHover : resizerBase),
            borderRadius: '6px',
          }}
          onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.cursor = 'col-resize'; setHoveredResizer('col'); }}
          onMouseOut={() => setHoveredResizer(null)}
          onMouseDown={e => onMouseDownResizer('col', 0, e)}
        />
      )}
      {/* 우측 grid */}
      <div
        style={{
          width: `calc(${colSizes[1]}% - 6px)`,
          height: '100%',
          display: 'grid',
          gridTemplateRows: rowSizesRight.map(s => `${s}%`).join(' '),
          gap: '8px',
          position: 'relative',
        }}
      >
        {panels.filter(p => p.col === 1).map(panel => (
          <div
            key={panel.id}
            style={{
              gridRow: `${panel.row + 1} / span ${panel.rowSpan}`,
              minWidth: 0,
              minHeight: 0,
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '14px',
              background: '#2F3136',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
              border: '1.5px solid #23243a',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 0.2s',
            }}
            className="group hover:shadow-lg focus-within:shadow-lg"
            onDrop={e => {
              e.preventDefault();
              const droppedApp = e.dataTransfer.getData("app");
              const droppedInstance = e.dataTransfer.getData("instance");
              if (droppedInstance) {
                try {
                  const instance = JSON.parse(droppedInstance);
                  onPanelDrop(panel.id, instance);
                } catch {}
                return;
              }
              if (droppedApp) {
                onPanelDrop(panel.id, droppedApp);
              }
            }}
            onDragOver={e => e.preventDefault()}
          >
            <PanelContent
              num={panel.id}
              app={panel.app}
              title={panel.title}
              onSplit={(num, droppedApp) => onPanelSplit(num, 'row')}
              onAppDrop={(appType, targetNum) => onPanelDrop(targetNum, appType)}
              onAdd={() => onPanelSplit(panel.id, 'row')}
              onClose={() => onPanelClose(panel.id)}
              onCloseAll={() => { onPanelClose(-1); }}
              onCloseOthers={() => { onPanelClose(-2, panel.id); }}
              openMenu={null}
              onToggleMenu={() => {}}
              maxPanelsReached={panels.length >= 4}
              showSwap={!!panel.app}
              showSwapHere={!!panel.app && swapTarget !== undefined && swapTarget !== null && swapTarget !== panel.id}
              isSwapTarget={swapTarget === panel.id}
              onSwapApp={onSwapApp ? () => onSwapApp(panel.id) : undefined}
              onSwapHere={onSwapHere ? () => onSwapHere(panel.id) : undefined}
              onCancelSwap={onCancelSwap}
            />
          </div>
        ))}
        {/* 상하(우) 리사이저 */}
        {rowSizesRight.length > 1 && panels.filter(p => p.col === 1).length === 2 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: '12px',
              zIndex: 50,
              cursor: 'row-resize',
              pointerEvents: 'auto',
              ...(dragging?.type === 'rowRight' || hoveredResizer === 'rowRight' ? resizerHover : resizerBase),
              borderRadius: '6px',
              top: `calc(${rowSizesRight[0]}% - 6px)`,
            }}
            onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.cursor = 'row-resize'; setHoveredResizer('rowRight'); }}
            onMouseOut={() => setHoveredResizer(null)}
            onMouseDown={e => onMouseDownResizer('rowRight', 0, e)}
          />
        )}
      </div>
    </div>
  );
} 