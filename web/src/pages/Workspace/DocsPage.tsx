import { Button } from "@/components/common/ui/button";
import { supabase } from "@/lib/supabase";
import React from "react";
import { PartialSummarySheet } from "./components/PartialSummarySheet";
import { SummarySheet } from "./components/SummarySheet";
import { TranscriptSheet } from "./components/TranscriptSheet";

type MeetingLog = {
  id: string;
  server_id: string;
  transcript: unknown;
  summary: string;
  started_at: string;
  ended_at: string;
};

function formatDate(value: string) {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  } catch {
    return "-";
  }
}

const DocsPage = () => {
  const [selectedServerId, setSelectedServerId] = React.useState<string | null>(null);
  const [logs, setLogs] = React.useState<MeetingLog[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const [summaryOpen, setSummaryOpen] = React.useState<boolean>(false);
  const [transcriptOpen, setTranscriptOpen] = React.useState<boolean>(false);
  const [activeLog, setActiveLog] = React.useState<MeetingLog | null>(null);
  const [partialOpen, setPartialOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("home:selectedMeeting");
      if (raw) {
        const parsed = JSON.parse(raw) as { meetingId?: string } | null;
        setSelectedServerId(parsed?.meetingId ?? null);
      } else {
        setSelectedServerId(null);
      }
    } catch {
      setSelectedServerId(null);
    }

    const handleShowParticipants = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ meetingId?: string }>;
        const id = ce.detail?.meetingId ?? "";
        setSelectedServerId(id || null);
      } catch {
        /* ignore */
      }
    };

    const handleMeetingsUpdated = () => {
      // Re-read in case selection or data changed
      try {
        const raw2 = localStorage.getItem("home:selectedMeeting");
        if (raw2) {
          const parsed2 = JSON.parse(raw2) as { meetingId?: string } | null;
          setSelectedServerId(parsed2?.meetingId ?? null);
        }
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("show-participants", handleShowParticipants as EventListener);
    window.addEventListener("meetings-updated", handleMeetingsUpdated as EventListener);
    return () => {
      window.removeEventListener("show-participants", handleShowParticipants as EventListener);
      window.removeEventListener("meetings-updated", handleMeetingsUpdated as EventListener);
    };
  }, []);

  const loadLogs = React.useCallback(async (serverId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("meeting_logs")
        .select("id, server_id, transcript, summary, started_at, ended_at")
        .eq("server_id", serverId)
        .order("started_at", { ascending: false });

      if (error) throw error;
      setLogs((data ?? []) as unknown as MeetingLog[]);
    } catch (e) {
      const msg = (e as { message?: string })?.message ?? "불러오는 중 오류가 발생했습니다.";
      setError(msg);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!selectedServerId) {
      setLogs([]);
      return;
    }
    void loadLogs(selectedServerId);
  }, [selectedServerId, loadLogs]);

  const openSummary = (log: MeetingLog) => {
    setActiveLog(log);
    setSummaryOpen(true);
  };

  const openTranscript = (log: MeetingLog) => {
    setActiveLog(log);
    setTranscriptOpen(true);
  };

  return (
    <div className="h-screen w-full min-w-0 overflow-hidden bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">회의 내역</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (selectedServerId) void loadLogs(selectedServerId);
            }}
          >
            새로고침
          </Button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {selectedServerId ? "" : "좌측에서 서버를 선택해 주세요"}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-[#23242e] bg-white dark:bg-[#23242e] overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#2a2b36]">
          <div className="col-span-4 sm:col-span-3">시작 시간</div>
          <div className="col-span-4 sm:col-span-3">끝난 시간</div>
          <div className="col-span-2 sm:col-span-3 text-center">요약본</div>
          <div className="col-span-2 sm:col-span-3 text-center">대화 기록</div>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              불러오는 중...
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-sm text-red-500">{error}</div>
          ) : logs.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              회의 내역이 없습니다.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-gray-100 dark:border-[#2a2b36] text-sm"
              >
                <div
                  className="col-span-4 sm:col-span-3 truncate"
                  title={formatDate(log.started_at)}
                >
                  {formatDate(log.started_at)}
                </div>
                <div className="col-span-4 sm:col-span-3 truncate" title={formatDate(log.ended_at)}>
                  {formatDate(log.ended_at)}
                </div>
                <div className="col-span-2 sm:col-span-3 flex justify-center">
                  <Button size="sm" variant="outline" onClick={() => openSummary(log)}>
                    요약본 보기
                  </Button>
                </div>
                <div className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => openTranscript(log)}>
                    대화 기록 보기
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveLog(log);
                      setPartialOpen(true);
                    }}
                  >
                    부분 요약
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SummarySheet open={summaryOpen} onOpenChange={setSummaryOpen} summary={activeLog?.summary} />

      <TranscriptSheet
        open={transcriptOpen}
        onOpenChange={setTranscriptOpen}
        log={{
          id: activeLog?.id,
          started_at: activeLog?.started_at,
          ended_at: activeLog?.ended_at,
          transcript: activeLog?.transcript,
        }}
      />

      <PartialSummarySheet
        open={partialOpen}
        onOpenChange={setPartialOpen}
        log={{
          id: activeLog?.id,
          started_at: activeLog?.started_at,
          ended_at: activeLog?.ended_at,
          transcript: activeLog?.transcript,
        }}
      />
    </div>
  );
};

export default DocsPage;
