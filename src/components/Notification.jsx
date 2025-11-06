import React, { useEffect } from 'react';

const Notification = ({ type = 'info', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
