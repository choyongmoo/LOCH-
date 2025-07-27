import { ServerSidebar } from '@/components/Meeting/ServerSidebar';
import { Outlet } from "react-router";
import { useState, useEffect, useRef } from 'react';
import { ResizableGridLayout } from '@/pages/Meeting/ResizableGridLayout';
import { SlideNotification } from "@/components/Meeting/SlideNotification";
import { MembersBar } from "@/components/Meeting/MembersBar";
import { MeetingDetailsModal } from "@/components/Meeting/MeetingDetailsModal";
import { ChatBox } from "@/components/Meeting/ChatBox";
import { UserDetailsModal } from "@/components/Meeting/UserDetailsModal";
import type { ChatMessage } from "@/pages/Meeting/types";
import { AnimatePresence } from "framer-motion";
import React from "react";

export interface AppInstance {
  id: string;
  type: string;
  title: string;
}

export interface DynamicPanel {
  id: number;
  app?: string;
  title?: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export const MeetingLayout = () => {
  // 모든 상태 통합
  const [instances, setInstances] = useState<AppInstance[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>(["홍길동", "김개발", "이디자인"]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>(members[0] ?? "익명");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showAppModal, setShowAppModal] = useState(false);
  const [appType, setAppType] = useState<string | null>(null);
  const [appTitle, setAppTitle] = useState("");
  const [modalMode, setModalMode] = useState<'select' | 'create'>("select");
  const [pendingDrop, setPendingDrop] = useState<{ type: string; targetNum?: number; mode?: 'replace' | 'split' } | null>(null);
  const [replaceOrSplit, setReplaceOrSplit] = useState<null | { instance: AppInstance; targetNum: number; sourceType: 'instance' | 'app' }>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const resizableLayoutRef = useRef<any>(null);

  // 동적 grid 상태
  const [panels, setPanels] = useState<DynamicPanel[]>([]);
  // 좌우(전체), 상하(좌/우 각각) 비율 관리
  const [colSizes, setColSizes] = useState<number[]>([100, 0]);
  const [rowSizesLeft, setRowSizesLeft] = useState<number[]>([50, 50]);
  const [rowSizesRight, setRowSizesRight] = useState<number[]>([50, 50]);
  const [pendingSplitCol, setPendingSplitCol] = useState<0|1|null>(null);

  // 앱 위치 바꾸기 상태
  const [swapTarget, setSwapTarget] = useState<number | null>(null);

  // 알림(접속/나감)
  useEffect(() => {
    if (current !== null || queue.length === 0) return;
    setCurrent(queue[0]);
    setQueue((prev) => prev.slice(1));
  }, [queue, current]);
  useEffect(() => {
    if (current === null) return;
    const timer = setTimeout(() => setCurrent(null), 3000);
    return () => clearTimeout(timer);
  }, [current]);
  const handleJoin = (name: string) => {
    setQueue((prev) => [...prev, `${name}님이 접속했습니다.`]);
    if (!members.includes(name)) {
      setMembers((prev) => [...prev, name]);
    }
  };
  const handleLeave = (name: string) => {
    setQueue((prev) => [...prev, `${name}님이 나갔습니다.`]);
    setMembers((prev) => prev.filter((m) => m !== name));
    if (currentUser === name) setCurrentUser("익명");
    if (selectedUser === name) setSelectedUser(null);
  };
  // 채팅
  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      user: currentUser,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };
  // 패널 개수 조회 함수
  const getPanelCount = () => {
    if (resizableLayoutRef.current && resizableLayoutRef.current.getPanelCount) {
      return resizableLayoutRef.current.getPanelCount();
    }
    return 0;
  };
  // 인스턴스/모달/분할/교체/드롭 등 모든 핸들러(기존 코드와 동일하게 유지)
  const handleAppCreate = (type: string) => {
    setAppType(type);
    setShowAppModal(true);
    setAppTitle("");
    setPendingDrop(null);
    setModalMode("select");
  };

  const handleAppModalClose = () => {
    setShowAppModal(false);
    setAppType(null);
    setAppTitle("");
    setPendingDrop(null);
    setModalMode("select");
  };

  // 패널 드롭(앱/인스턴스)
  const handlePanelDrop = (panelId: number, data: any) => {
    const target = panels.find(p => p.id === panelId);
    if (!target) return;
    // 빈 패널이면 바로 적용
    if (!target.app) {
      // 인스턴스면 바로 적용, 앱이면 모달
      if (typeof data === 'object' && data.id && data.type) {
        setPanels(prev => prev.map(p => p.id === panelId ? { ...p, app: data.type, title: data.title } : p));
      } else {
        setReplaceOrSplit({ instance: { id: Date.now().toString(), type: data, title: "" }, targetNum: panelId, sourceType: 'app' });
      }
      return;
    }
    // 이미 앱이 있으면 분할/교체/취소 모달
    if (typeof data === 'object' && data.id && data.type) {
      // 인스턴스 드롭: 간단한 교체/취소 창
      setReplaceOrSplit({ instance: data, targetNum: panelId, sourceType: 'instance' });
    } else {
      // 앱 드롭: 기존 인스턴스 선택/생성 모달
      setReplaceOrSplit({ instance: { id: Date.now().toString(), type: data, title: "" }, targetNum: panelId, sourceType: 'app' });
    }
  };

  // 분할/교체/취소 모달 핸들러
  const handleReplaceOrSplit = (mode: 'replace' | 'split' | 'cancel') => {
    if (!replaceOrSplit) return;
    if (mode === 'cancel') {
      setReplaceOrSplit(null);
      return;
    }
    // 인스턴스 드롭일 때만 바로 실행
    if (replaceOrSplit.sourceType === 'instance' && replaceOrSplit.instance && replaceOrSplit.instance.id && replaceOrSplit.instance.type) {
      if (mode === 'replace') {
        setPanels(prev => prev.map(p => p.id === replaceOrSplit.targetNum ? { ...p, app: replaceOrSplit.instance.type, title: replaceOrSplit.instance.title } : p));
      } else if (mode === 'split') {
        // 분할 후 새 패널에 인스턴스 적용
        if (panels.length >= 4) return;
        handlePanelSplit(replaceOrSplit.targetNum, 'col');
        setTimeout(() => {
          setPanels(prev => prev.map(p => !p.app ? { ...p, app: replaceOrSplit.instance.type, title: replaceOrSplit.instance.title } : p));
        }, 0);
      }
      setReplaceOrSplit(null);
      setPendingDrop(null);
      setModalMode("select");
      return;
    }
    // 앱 타입 드롭이면 기존대로 인스턴스 선택/생성 모달 띄움
    setAppType(replaceOrSplit.instance.type);
    setShowAppModal(true);
    setAppTitle("");
    setPendingDrop({ type: replaceOrSplit.instance.type, targetNum: replaceOrSplit.targetNum, mode });
    setModalMode("select");
    setReplaceOrSplit(null);
  };

  // 인스턴스 선택/생성 모달에서 생성 시
  const handleAppModalCreate = () => {
    if (!appType || !appTitle.trim()) return;
    const newInstance = { id: Date.now().toString(), type: appType, title: appTitle.trim() };
    setInstances(prev => [...prev, newInstance]);
    if (pendingDrop) {
      // panels가 0개(첫 화면)일 때는 새 패널 생성
      if (panels.length === 0) {
        setPanels([{ id: 1, app: newInstance.type, title: newInstance.title, row: 0, col: 0, rowSpan: 2, colSpan: 2 }]);
        setColSizes([100, 0]);
        setRowSizesLeft([50, 50]);
        setRowSizesRight([50, 50]);
      } else {
        if (pendingDrop.mode === 'replace') {
          setPanels(prev => prev.map(p => p.id === pendingDrop.targetNum ? { ...p, app: newInstance.type, title: newInstance.title } : p));
        } else if (pendingDrop.mode === 'split') {
          handlePanelSplit(pendingDrop.targetNum!, 'col');
          setTimeout(() => {
            setPanels(prev => prev.map(p => !p.app ? { ...p, app: newInstance.type, title: newInstance.title } : p));
          }, 0);
        } else {
          // 빈 패널에 바로 적용
          setPanels(prev => prev.map(p => p.id === pendingDrop.targetNum ? { ...p, app: newInstance.type, title: newInstance.title } : p));
        }
      }
    }
    setShowAppModal(false);
    setAppType(null);
    setAppTitle("");
    setPendingDrop(null);
    setModalMode("select");
  };

  // 분할/추가/닫기/교체/드롭 로직
  const handlePanelSplit = (panelId: number, direction: 'row' | 'col') => {
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
        // 분할 대상이 col 0(왼쪽)인지 col 1(오른쪽)인지 판별
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
      // 3개 → 4개: 남은 쪽 상하 분할
      if (prev.length === 3) {
        // 2x2 그리드의 모든 좌표
        const grid = [
          [0, 0], [0, 1], [1, 0], [1, 1]
        ];
        // 기존 패널 좌표
        const used = prev.map(p => `${p.row},${p.col}`);
        const empty = grid.find(([r, c]) => !used.includes(`${r},${c}`));
        if (!empty) return prev;
        // 새 패널 추가
        const newPanels = [...prev, { id: newId, app: undefined, title: undefined, row: empty[0], col: empty[1], rowSpan: 1, colSpan: 1 }];
        // 4개 모두 2x2에 맞게 재배치
        setPendingSplitCol(empty[1] as 0|1); // 새로 2개가 된 col만 초기화
        return newPanels.map((p, i) => ({
          ...p,
          row: grid[i][0],
          col: grid[i][1],
          rowSpan: 1,
          colSpan: 1,
        }));
      }
      return prev;
    });
  };

  // 3→4 분할 시 새로 2개가 된 col만 [50,50]로 초기화
  // panels가 4개가 되는 순간에만 동작
  React.useEffect(() => {
    if (panels.length !== 4 || pendingSplitCol === null) return;
    if (pendingSplitCol === 0) setRowSizesLeft([50, 50]);
    if (pendingSplitCol === 1) setRowSizesRight([50, 50]);
    setPendingSplitCol(null);
  }, [panels.length, pendingSplitCol]);
  const handlePanelClose = (panelId: number, onlyNum?: number) => {
    if (panelId === -1) {
      // 전체 닫기
      setPanels([]);
      setColSizes([100, 0]);
      setRowSizesLeft([100, 0]);
      setRowSizesRight([100, 0]);
      return;
    }
    if (panelId === -2 && onlyNum !== undefined) {
      // 나만 남기고 닫기
      setPanels(prev => prev.filter(p => p.id === onlyNum));
      setColSizes([100, 0]);
      setRowSizesLeft([100, 0]);
      setRowSizesRight([100, 0]);
      return;
    }
    setPanels(prev => {
      const next = prev.filter(p => p.id !== panelId);
      if (next.length === 3) {
        // 3분할: 한쪽만 상하, 나머지 좌우 (리사이저 비율은 기존 값 유지)
        const lefts = next.filter(p => p.col === 0);
        const rights = next.filter(p => p.col === 1);
        if (lefts.length === 2) {
          // 왼쪽 상하, 오른쪽 하나
          return [
            { ...lefts[0], row: 0, rowSpan: 1, col: 0, colSpan: 1 },
            { ...lefts[1], row: 1, rowSpan: 1, col: 0, colSpan: 1 },
            { ...rights[0], row: 0, rowSpan: 2, col: 1, colSpan: 1 },
          ];
        } else if (rights.length === 2) {
          // 오른쪽 상하, 왼쪽 하나
          return [
            { ...lefts[0], row: 0, rowSpan: 2, col: 0, colSpan: 1 },
            { ...rights[0], row: 0, rowSpan: 1, col: 1, colSpan: 1 },
            { ...rights[1], row: 1, rowSpan: 1, col: 1, colSpan: 1 },
          ];
        } else {
          return next;
        }
      } else if (next.length === 2) {
        // 2분할: 좌우 (리사이저 비율은 기존 값 유지)
        return [
          { ...next[0], col: 0, colSpan: 1, row: 0, rowSpan: 2 },
          { ...next[1], col: 1, colSpan: 1, row: 0, rowSpan: 2 },
        ];
      } else if (next.length === 1) {
        // 1개: 전체 (리사이저 비율은 초기화)
        setColSizes([100, 0]);
        setRowSizesLeft([100, 0]);
        setRowSizesRight([100, 0]);
        return [{ ...next[0], col: 0, colSpan: 2, row: 0, rowSpan: 2 }];
      }
      return next;
    });
  };
  // 리사이저 핸들러: 좌우/상하(좌)/상하(우) 분리
  const handleResize = (type: 'col' | 'rowLeft' | 'rowRight', values: number[]) => {
    if (type === 'col') setColSizes(values);
    else if (type === 'rowLeft') setRowSizesLeft(values);
    else if (type === 'rowRight') setRowSizesRight(values);
  };

  // UI 통합 렌더링
  // 인스턴스 선택 모달에서 기존 인스턴스 선택 시
  const handleSelectInstance = (instance: AppInstance) => {
    setShowAppModal(false);
    setAppType(null);
    setAppTitle("");
    if (pendingDrop) {
      if (pendingDrop.mode === 'replace') {
        setPanels(prev => prev.map(p => p.id === pendingDrop.targetNum ? { ...p, app: instance.type, title: instance.title } : p));
      } else if (pendingDrop.mode === 'split') {
        handlePanelSplit(pendingDrop.targetNum!, 'col');
        setTimeout(() => {
          setPanels(prev => prev.map(p => !p.app ? { ...p, app: instance.type, title: instance.title } : p));
        }, 0);
      } else {
        setPanels(prev => prev.map(p => p.id === pendingDrop.targetNum ? { ...p, app: instance.type, title: instance.title } : p));
      }
    }
    setPendingDrop(null);
    setModalMode("select");
  };
  // 새로 만들기 버튼
  const handleNewInstance = () => {
    setModalMode("create");
  };
  // 패널이 0개일 때 +버튼 UI
  // panels.length === 0일 때도 전체 레이아웃 유지, Outlet 중앙에 +버튼만 띄움
  // (사이드바, 멤버바, 채팅 등은 그대로 보이고, 회의 화면만 +버튼)
  return (
    <div className="flex h-screen bg-[#36393F]">
      <div className="w-20 text-white bg-[#202225]">
        <ServerSidebar
          onAppCreate={handleAppCreate}
          instances={instances}
          hoveredType={hoveredType}
          setHoveredType={setHoveredType}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-1">
          <div className="flex-1 bg-[#36393F] overflow-hidden relative">
            {/* 상단 알림 */}
            <SlideNotification
              message={current ?? ""}
              visible={current !== null}
              className="top-[80px]"
            />
            {/* 오른쪽 상단 멤버바 */}
            <div className="absolute top-4 right-4 z-50">
              <MembersBar
                members={members}
                onOpenDetails={() => setShowDetails(true)}
                onUserClick={(name: string) => setSelectedUser(name)}
              />
            </div>
            {/* 회의방 상세 모달 */}
            <MeetingDetailsModal
              visible={showDetails}
              onClose={() => setShowDetails(false)}
              details="회의방 상세정보 입력"
            />
            {/* 유저 상세 모달 */}
            <UserDetailsModal
              visible={selectedUser !== null}
              onClose={() => setSelectedUser(null)}
              user={selectedUser}
            />
            {/* 채팅 버튼 */}
            <button
              onClick={() => setChatOpen((open) => !open)}
              className="fixed bottom-4 right-4 z-60 w-12 h-12 rounded-full bg-[#5865F2] text-white shadow-lg flex items-center justify-center hover:bg-[#4752c4] transition"
              aria-label="Toggle Chat"
            >
              💬
            </button>
            {/* 채팅창 */}
            <AnimatePresence>
              {chatOpen && (
                <ChatBox
                  messages={messages}
                  input={input}
                  setInput={setInput}
                  onSend={sendMessage}
                />
              )}
            </AnimatePresence>
            {/* Outlet(실제 회의 화면) */}
            {panels.length === 0 ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const droppedApp = e.dataTransfer.getData("app");
                  const droppedInstance = e.dataTransfer.getData("instance");
                  if (droppedInstance) {
                    try {
                      const instance = JSON.parse(droppedInstance);
                      setPanels([{ id: 1, app: instance.type, title: instance.title, row: 0, col: 0, rowSpan: 2, colSpan: 2 }]);
                      setColSizes([100, 0]);
                      setRowSizesLeft([50, 50]);
                      setRowSizesRight([50, 50]);
                    } catch {}
                    return;
                  }
                  if (droppedApp) {
                    setAppType(droppedApp);
                    setShowAppModal(true);
                    setAppTitle("");
                    setPendingDrop({ type: droppedApp, targetNum: 1, mode: undefined });
                    setModalMode("select");
                  }
                }}
              >
                <div className="mb-6 text-gray-400 text-base text-center select-none">
                  앱을 드래그하거나 <span className="font-bold text-[#5865F2]">+</span> 버튼을 눌러<br/>새로운 회의 화면을 시작하세요!
                </div>
                <button
                  className="w-16 h-16 flex items-center justify-center text-3xl rounded-full bg-[#5865F2] text-white shadow-lg hover:bg-[#4752c4] transition focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
                  onClick={() => {
                    setPanels([{ id: 1, app: undefined, title: undefined, row: 0, col: 0, rowSpan: 2, colSpan: 2 }]);
                    setColSizes([100, 0]);
                    setRowSizesLeft([50, 50]);
                    setRowSizesRight([50, 50]);
                  }}
                  aria-label="패널 추가"
                >
                  <span style={{fontWeight:'bold', fontSize:'2rem', lineHeight:1}}>+</span>
                </button>
              </div>
            ) : (
              <ResizableGridLayout
                panels={panels}
                colSizes={colSizes}
                rowSizesLeft={rowSizesLeft}
                rowSizesRight={rowSizesRight}
                onPanelDrop={handlePanelDrop}
                onPanelSplit={handlePanelSplit}
                onPanelClose={handlePanelClose}
                onResize={handleResize}
                swapTarget={swapTarget}
                onSwapApp={id => setSwapTarget(id)}
                onSwapHere={id => {
                  if (swapTarget === null) return;
                  setPanels(prev => {
                    const a = prev.find(p => p.id === swapTarget);
                    const b = prev.find(p => p.id === id);
                    if (!a || !b) return prev;
                    return prev.map(p =>
                      p.id === a.id ? { ...p, app: b.app, title: b.title }
                      : p.id === b.id ? { ...p, app: a.app, title: a.title }
                      : p
                    );
                  });
                  setSwapTarget(null);
                }}
                onCancelSwap={() => setSwapTarget(null)}
              />
            )}
            {/* 테스트용 접속/나감 버튼 등 기타 UI는 그대로 */}
            <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2">
              <button
                onClick={() => handleJoin("홍길동")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                홍길동 접속
              </button>
              <button
                onClick={() => handleLeave("홍길동")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                홍길동 나감
              </button>
            </div>
            {/* 모달/분할/교체/인스턴스 선택 등 모든 모달 UI도 여기에 통합 */}
            {showAppModal && (
              <div>
                <div
                  className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-40"
                  onClick={handleAppModalClose}
                />
                <div
                  className="fixed top-1/2 left-1/2 max-w-md w-full bg-[#2F3136] p-6 rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-50 text-white"
                >
                  <h2 className="text-xl font-semibold mb-4">어플리케이션 생성</h2>
                  {modalMode === "select" && appType && (
                    <>
                      <div className="mb-4">
                        <div className="mb-2 font-semibold text-[#7289DA]">기존 인스턴스 선택</div>
                        <div className="flex flex-row gap-2 flex-wrap">
                          {instances.filter(i => i.type === appType).length === 0 ? (
                            <div className="text-gray-400 text-sm">생성된 인스턴스 없음</div>
                          ) : (
                            instances.filter(i => i.type === appType).map(i => (
                              <button
                                key={i.id}
                                onClick={() => handleSelectInstance(i)}
                                className="bg-[#40444B] px-3 py-1 rounded text-white hover:bg-[#5865F2] transition-colors text-sm max-w-[120px] truncate"
                              >
                                {i.title}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleNewInstance}
                          className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition"
                        >
                          새로 만들기
                        </button>
                        <button
                          onClick={handleAppModalClose}
                          className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  )}
                  {modalMode === "create" && (
                    <>
                      <div className="mb-4">
                        <label className="block mb-2">제목</label>
                        <input
                          type="text"
                          value={appTitle}
                          onChange={e => setAppTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-[#40444B] text-white focus:outline-none"
                          placeholder="제목을 입력하세요"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleAppModalCreate}
                          className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition"
                        >
                          생성
                        </button>
                        <button
                          onClick={handleAppModalClose}
                          className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* 인스턴스 교체/취소/분할 간단 창 */}
            {replaceOrSplit && replaceOrSplit.sourceType === 'instance' && (
              <div>
                <div
                  className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-50"
                  onClick={() => setReplaceOrSplit(null)}
                />
                <div
                  className="fixed top-1/2 left-1/2 max-w-xs w-full bg-[#2F3136] p-6 rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-60 text-white"
                >
                  <h2 className="text-lg font-semibold mb-4">이 화면을 "{replaceOrSplit.instance.title}"(으)로 교체할까요?</h2>
                  <div className="flex flex-row gap-3 justify-center">
                    <button
                      className={`px-4 py-2 rounded-full transition ${panels.length >= 4 ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-[#5865F2] text-white hover:bg-[#4752c4]'}`}
                      onClick={() => handleReplaceOrSplit('split')}
                      disabled={panels.length >= 4}
                    >분할</button>
                    <button
                      className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition"
                      onClick={() => handleReplaceOrSplit('replace')}
                    >교체</button>
                    <button
                      className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
                      onClick={() => handleReplaceOrSplit('cancel')}
                    >취소</button>
                  </div>
                </div>
              </div>
            )}
            {/* 기존 앱 드롭/분할/교체 모달은 sourceType === 'app'일 때만 */}
            {replaceOrSplit && replaceOrSplit.sourceType === 'app' && (
              <div>
                <div
                  className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-50"
                  onClick={() => setReplaceOrSplit(null)}
                />
                <div
                  className="fixed top-1/2 left-1/2 max-w-xs w-full bg-[#2F3136] p-6 rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-60 text-white"
                >
                  <h2 className="text-lg font-semibold mb-4">어떻게 하시겠습니까?</h2>
                  <div className="flex flex-col gap-3">
                    <button
                      className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                      onClick={() => handleReplaceOrSplit('split')}
                      disabled={panels.length >= 4}
                    >
                      화면 분할
                    </button>
                    <button
                      className="px-4 py-2 bg-[#40444B] rounded-full hover:bg-[#5865F2] transition"
                      onClick={() => handleReplaceOrSplit('replace')}
                    >
                      이 화면 교체
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
                      onClick={() => handleReplaceOrSplit('cancel')}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
