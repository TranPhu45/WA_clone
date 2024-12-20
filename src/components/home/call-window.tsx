import React from 'react';

interface CallWindowProps {
  onEndCall: () => void;
}

const CallWindow: React.FC<CallWindowProps> = ({ onEndCall }) => {
  return (
    <div className="call-window">
      <div>
        <p className="font-bold">Calling...</p>
      </div>
      <button onClick={onEndCall}>
        End call
      </button>
    </div>
  );
};

export default CallWindow; 