import { useState } from 'react';
import React from 'react';
import type { AppInstance } from '@/types/meeting';

export const useInstanceManagement = (
  setInstances?: React.Dispatch<React.SetStateAction<AppInstance[]>>,
  panels?: any[],
  setPanels?: React.Dispatch<React.SetStateAction<any[]>>,
  instances?: AppInstance[]
) => {
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<AppInstance | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showOpenInstanceWarning, setShowOpenInstanceWarning] = useState(false);

  const handleInstanceEdit = (instance: AppInstance) => {
    setSelectedInstance(instance);
    setEditingTitle(instance.title);
    setShowInstanceModal(true);
  };

  const handleInstanceDelete = (instanceId: string) => {
    // 현재 열린 인스턴스인지 확인 (app 타입과 title로 비교)
    const selectedInstanceData = instances?.find(instance => instance.id === instanceId);
    const isOpenInstance = panels?.some(panel => 
      panel.app === selectedInstanceData?.type && panel.title === selectedInstanceData?.title
    );
    
    if (isOpenInstance) {
      setShowOpenInstanceWarning(true);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    if (selectedInstance && setInstances) {
      setInstances(prev => prev.filter(instance => instance.id !== selectedInstance.id));
      console.log('인스턴스 삭제:', selectedInstance.id);
      setShowDeleteConfirm(false);
      setShowInstanceModal(false);
      setSelectedInstance(null);
      setEditingTitle('');
    }
  };

  const handleInstanceTitleChange = () => {
    if (selectedInstance && editingTitle.trim() && setInstances) {
      // 인스턴스 제목 변경 로직
      setInstances(prev => prev.map(instance => 
        instance.id === selectedInstance.id 
          ? { ...instance, title: editingTitle.trim() }
          : instance
      ));
      
      // 패널의 제목도 업데이트 (app 타입과 기존 title로 매칭)
      if (setPanels) {
        setPanels(prev => prev.map(panel => 
          panel.app === selectedInstance.type && panel.title === selectedInstance.title
            ? { ...panel, title: editingTitle.trim() }
            : panel
        ));
      }
      
      console.log('인스턴스 제목 변경:', selectedInstance.id, editingTitle);
      setShowInstanceModal(false);
      setSelectedInstance(null);
      setEditingTitle('');
      setSuccessMessage('인스턴스 이름이 변경되었습니다.');
      setShowSuccessModal(true);
    }
  };

  return {
    showInstanceModal,
    selectedInstance,
    editingTitle,
    setShowInstanceModal,
    setSelectedInstance,
    setEditingTitle,
    handleInstanceEdit,
    handleInstanceDelete,
    handleInstanceTitleChange,
    showDeleteConfirm,
    setShowDeleteConfirm,
    confirmDelete,
    showSuccessModal,
    setShowSuccessModal,
    successMessage,
    showOpenInstanceWarning,
    setShowOpenInstanceWarning
  };
}; 