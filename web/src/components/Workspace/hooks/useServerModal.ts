import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Server } from "@/types/workspace";

export function useServerModal(server: Server) {
  const [roomName, setRoomName] = useState(server.room_name);
  const [description, setDescription] = useState(server.description || "");
  const [maxParticipants, setMaxParticipants] = useState(server.max_participants || 10);
  const [isPrivate, setIsPrivate] = useState(server.is_private ?? true);
  const [password, setPassword] = useState(server.password || "");
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const { data: members, error } = await supabase
          .from("server_members")
          .select("*")
          .eq("server_id", server.id)
          .eq("is_active", true);
        if (error) throw error;
        const count = members?.length || 0;
        setCurrentParticipants(count);
        setMaxParticipants((prev) => Math.max(prev, count));
      } catch (err) {
        console.error("참여자 수 가져오기 실패:", err);
      }
    }
    fetchParticipants();
  }, [server.id]);

  const handleSave = (onSave: (server: Server) => void) => {
    if (isPrivate && !password.trim()) {
      setShowErrorModal(true);
      return;
    }

    if (maxParticipants < currentParticipants) {
      setShowErrorModal(true);
      return;
    }

    onSave({
      ...server,
      room_name: roomName,
      description,
      max_participants: maxParticipants,
      is_private: isPrivate,
      password: isPrivate ? password : undefined,
      updated_at: new Date().toISOString(),
    });
  };

  const handleMaxParticipantsChange = (value: number) => {
    setMaxParticipants(value);
  };

  return {
    roomName,
    setRoomName,
    description,
    setDescription,
    maxParticipants,
    setMaxParticipants: handleMaxParticipantsChange,
    isPrivate,
    setIsPrivate,
    password,
    setPassword,
    currentParticipants,
    showErrorModal,
    setShowErrorModal,
    handleSave,
  };
}
