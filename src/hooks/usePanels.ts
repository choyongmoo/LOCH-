import { useState, useEffect } from 'react';
import type { DynamicPanel } from '@/types/meeting';

export const usePanels = () => {
  const [panels, setPanels] = useState<DynamicPanel[]>([]);
  const [colSizes, setColSizes] = useState<number[]>([100, 0]);
  const [rowSizesLeft, setRowSizesLeft] = useState<number[]>([50, 50]);
  const [rowSizesRight, setRowSizesRight] = useState<number[]>([50, 50]);
  const [pendingSplitCol, setPendingSplitCol] = useState<0|1|null>(null);
  const [swapTarget, setSwapTarget] = useState<number | null>(null);

  // 3→4 분할 시 새로 2개가 된 col만 [50,50]로 초기화
  useEffect(() => {
    if (panels.length !== 4 || pendingSplitCol === null) return;
    if (pendingSplitCol === 0) setRowSizesLeft([50, 50]);
    if (pendingSplitCol === 1) setRowSizesRight([50, 50]);
    setPendingSplitCol(null);
  }, [panels.length, pendingSplitCol]);

  const handlePanelSplit = (panelId: number, _direction: 'row' | 'col') => {
    if (panels.length >= 4) return;
    setPanels(prev => {
      const target = prev.find(p => p.id === panelId);
      if (!target) return prev;
      const newId = Math.max(...prev.map(p => p.id)) + 1;
      
      // 1개 → 2개: 좌우 분할
      if (prev.length === 1) {
        setColSizes([50, 50]);
        setRowSizesLeft([100, 0]);
        setRowSizesRight([100, 0]);
        return [
          { ...target, col: 0, colSpan: 1, row: 0, rowSpan: 2 },
          { id: newId, app: undefined, title: undefined, col: 1, colSpan: 1, row: 0, rowSpan: 2 },
        ];
      }
      
      // 2개 → 3개: 한쪽만 상하 분할
      if (prev.length === 2) {
        const isLeft = target.col === 0;
        setRowSizesLeft([50, 50]);
        setRowSizesRight([50, 50]);
        if (isLeft) {
          return [
            { ...target, row: 0, rowSpan: 1, col: 0, colSpan: 1 },
            { id: newId, app: undefined, title: undefined, row: 1, rowSpan: 1, col: 0, colSpan: 1 },
            prev.find(p => p.col === 1)!,
          ];
        } else {
          return [
            prev.find(p => p.col === 0)!,
            { ...target, row: 0, rowSpan: 1, col: 1, colSpan: 1 },
            { id: newId, app: undefined, title: undefined, row: 1, rowSpan: 1, col: 1, colSpan: 1 },
          ];
        }
      }
      
      // 3개 → 4개: 남은 쪽 아래에 새 패널 생성
      if (prev.length === 3) {
        // 각 col별 패널 개수 확인
        const lefts = prev.filter(p => p.col === 0);
        const rights = prev.filter(p => p.col === 1);
        let newPanels;
        let newId = Math.max(...prev.map(p => p.id)) + 1;
        if (lefts.length === 1) {
          // 왼쪽이 1개, 오른쪽이 2개 → 왼쪽 아래에 새 패널
          newPanels = [
            { ...lefts[0], row: 0, rowSpan: 1, col: 0, colSpan: 1 },
            { id: newId, app: undefined, title: undefined, row: 1, rowSpan: 1, col: 0, colSpan: 1 },
            ...rights.map((p, i) => ({ ...p, row: i, rowSpan: 1, col: 1, colSpan: 1 })),
          ];
          setPendingSplitCol(0);
        } else if (rights.length === 1) {
          // 오른쪽이 1개, 왼쪽이 2개 → 오른쪽 아래에 새 패널
          newPanels = [
            ...lefts.map((p, i) => ({ ...p, row: i, rowSpan: 1, col: 0, colSpan: 1 })),
            { ...rights[0], row: 0, rowSpan: 1, col: 1, colSpan: 1 },
            { id: newId, app: undefined, title: undefined, row: 1, rowSpan: 1, col: 1, colSpan: 1 },
          ];
          setPendingSplitCol(1);
        } else {
          // 예외: 이미 2:2라면 기존 로직 유지
          const grid = [[0, 0], [0, 1], [1, 0], [1, 1]];
          const used = prev.map(p => `${p.row},${p.col}`);
          const empty = grid.find(([r, c]) => !used.includes(`${r},${c}`));
          if (!empty) return prev;
          newPanels = [...prev, { id: newId, app: undefined, title: undefined, row: empty[0], col: empty[1], rowSpan: 1, colSpan: 1 }];
          setPendingSplitCol(empty[1] as 0|1);
        }
        return newPanels;
      }
      return prev;
    });
  };

  const handlePanelClose = (panelId: number, onlyNum?: number) => {
    if (panelId === -1) {
      setPanels([]);
      setColSizes([100, 0]);
      setRowSizesLeft([100, 0]);
      setRowSizesRight([100, 0]);
      return;
    }
    if (panelId === -2 && onlyNum !== undefined) {
      setPanels(prev => {
        const remainingPanel = prev.find(p => p.id === onlyNum);
        if (!remainingPanel) return [];
        
        // 남은 패널을 전체 화면으로 설정
        setColSizes([100, 0]);
        setRowSizesLeft([100, 0]);
        setRowSizesRight([100, 0]);
        return [{ ...remainingPanel, col: 0, colSpan: 2, row: 0, rowSpan: 2 }];
      });
      return;
    }
    
    setPanels(prev => {
      const next = prev.filter(p => p.id !== panelId);
      
      if (next.length === 0) {
        // 모든 패널이 닫힌 경우 빈 배열 반환
        setColSizes([100, 0]);
        setRowSizesLeft([100, 0]);
        setRowSizesRight([100, 0]);
        return [];
      } else if (next.length === 1) {
        // 1개 패널만 남은 경우 전체 화면으로
        setColSizes([100, 0]);
        setRowSizesLeft([100, 0]);
        setRowSizesRight([100, 0]);
        return [{ ...next[0], col: 0, colSpan: 2, row: 0, rowSpan: 2 }];
      } else if (next.length === 2) {
        // 2개 패널: 좌우 분할
        setColSizes([50, 50]);
        setRowSizesLeft([100, 0]);
        setRowSizesRight([100, 0]);
        return [
          { ...next[0], col: 0, colSpan: 1, row: 0, rowSpan: 2 },
          { ...next[1], col: 1, colSpan: 1, row: 0, rowSpan: 2 },
        ];
      } else if (next.length === 3) {
        // 3개 패널: 한쪽에 2개, 다른쪽에 1개
        const lefts = next.filter(p => p.col === 0);
        const rights = next.filter(p => p.col === 1);
        
        if (lefts.length === 2) {
          // 왼쪽에 2개, 오른쪽에 1개
          setColSizes([50, 50]);
          setRowSizesLeft([50, 50]);
          setRowSizesRight([100, 0]);
          return [
            { ...lefts[0], row: 0, rowSpan: 1, col: 0, colSpan: 1 },
            { ...lefts[1], row: 1, rowSpan: 1, col: 0, colSpan: 1 },
            { ...rights[0], row: 0, rowSpan: 2, col: 1, colSpan: 1 },
          ];
        } else if (rights.length === 2) {
          // 오른쪽에 2개, 왼쪽에 1개
          setColSizes([50, 50]);
          setRowSizesLeft([100, 0]);
          setRowSizesRight([50, 50]);
          return [
            { ...lefts[0], row: 0, rowSpan: 2, col: 0, colSpan: 1 },
            { ...rights[0], row: 0, rowSpan: 1, col: 1, colSpan: 1 },
            { ...rights[1], row: 1, rowSpan: 1, col: 1, colSpan: 1 },
          ];
        } else {
          // 예외: 이미 올바른 위치에 있다면 그대로 유지
          return next;
        }
      }
      
      // 4개 이상인 경우 그대로 유지
      return next;
    });
  };

  const handleResize = (type: 'col' | 'rowLeft' | 'rowRight', values: number[]) => {
    if (type === 'col') setColSizes(values);
    else if (type === 'rowLeft') setRowSizesLeft(values);
    else if (type === 'rowRight') setRowSizesRight(values);
  };

  const createInitialPanel = () => {
    setPanels([{ id: 1, app: undefined, title: undefined, row: 0, col: 0, rowSpan: 2, colSpan: 2 }]);
    setColSizes([100, 0]);
    setRowSizesLeft([50, 50]);
    setRowSizesRight([50, 50]);
  };

  const handleSwapApp = (panelId: number) => {
    setSwapTarget(panelId);
  };

  const handleSwapHere = (targetId: number) => {
    if (swapTarget === null) return;
    
    setPanels(prev => {
      const sourcePanel = prev.find(p => p.id === swapTarget);
      const targetPanel = prev.find(p => p.id === targetId);
      
      if (!sourcePanel || !targetPanel) return prev;
      
      // 두 패널의 위치 정보를 교환
      return prev.map(p => {
        if (p.id === swapTarget) {
          return { ...p, row: targetPanel.row, col: targetPanel.col };
        } else if (p.id === targetId) {
          return { ...p, row: sourcePanel.row, col: sourcePanel.col };
        }
        return p;
      });
    });
    
    setSwapTarget(null);
  };

  const handleCancelSwap = () => {
    setSwapTarget(null);
  };

  return {
    panels,
    setPanels,
    colSizes,
    rowSizesLeft,
    rowSizesRight,
    swapTarget,
    setSwapTarget,
    handlePanelSplit,
    handlePanelClose,
    handleResize,
    createInitialPanel,
    handleSwapApp,
    handleSwapHere,
    handleCancelSwap,
  };
}; 