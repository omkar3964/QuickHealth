import React, { useEffect, useState, useRef } from 'react';
import { assets } from '../assets/assets';
import ChatPanel from './ChatPanel';

const Support = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  // Auto-show on activity
  useEffect(() => {
    const handleActivity = () => {
      setVisible(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), 3000);
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('scroll', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Chat Panel */}
      {open && <ChatPanel onClose={() => setOpen(false)} />}

      {/* Floating Button */}
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 z-50 transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-end pointer-events-auto">
          <img
            className="w-12 cursor-pointer"
            src={assets.customer_service_support}
            alt="customer_service_support"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default Support;
