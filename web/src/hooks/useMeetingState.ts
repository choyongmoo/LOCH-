import { useState } from 'react';

export const useMeetingState = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return {
    showOptions,
    setShowOptions,
    showDetails,
    setShowDetails,
    isMuted,
    setIsMuted
  };
};