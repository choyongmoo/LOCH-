import { useState } from 'react';
import type { AppInstance, PendingDrop, ReplaceOrSplit, ModalMode } from '@/types/meeting';

export const useAppInstances = () => {
  const [instances, setInstances] = useState<AppInstance[]>([]);
  const [showAppModal, setShowAppModal] = useState(false);
  const [appType, setAppType] = useState<string | null>(null);
  const [appTitle, setAppTitle] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>("select");
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);
  const [replaceOrSplit, setReplaceOrSplit] = useState<ReplaceOrSplit | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);

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

  const handleAppModalCreate = (): AppInstance | null => {
    if (!appType || !appTitle.trim()) return null;
    const newInstance = { id: Date.now().toString(), type: appType, title: appTitle.trim() };
    setInstances(prev => [...prev, newInstance]);
    setShowAppModal(false);
    setAppType(null);
    setAppTitle("");
    setPendingDrop(null);
    setModalMode("select");
    return newInstance;
  };

  const handleNewInstance = () => {
    setModalMode("create");
  };

  return {
    instances,
    setInstances,
    showAppModal,
    setShowAppModal,
    appType,
    setAppType,
    appTitle,
    setAppTitle,
    modalMode,
    setModalMode,
    pendingDrop,
    setPendingDrop,
    replaceOrSplit,
    setReplaceOrSplit,
    hoveredType,
    setHoveredType,
    handleAppCreate,
    handleAppModalClose,
    handleAppModalCreate,
    handleNewInstance,
  };
};