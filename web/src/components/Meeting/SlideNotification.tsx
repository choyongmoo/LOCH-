import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SlideNotificationProps } from "@/pages/Meeting/types";

export const SlideNotification = ({ message, visible, duration = 3000 }: SlideNotificationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (visible) {
      setShow(true);
      timerId = setTimeout(() => {
        setShow(false);
      }, duration);
    } else {
      timerId = setTimeout(() => {
        setShow(false);
      }, 450);
    }

    return () => clearTimeout(timerId);
  }, [visible, duration]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={message}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 bg-gray-800 text-white px-6 py-3 rounded shadow-lg z-50"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
