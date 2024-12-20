'use client';

import { useConversation } from '@11labs/react';
import { useCallback } from 'react';

const ElevenLabsConversation = () => {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center">
        <p>Trạng thái: {conversation.status}</p>
        <p>Agent đang {conversation.isSpeaking ? 'nói' : 'nghe'}</p>
        {conversation.status === 'connected' && (
          <button
            onClick={stopConversation}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Kết thúc cuộc gọi
          </button>
        )}
      </div>
    </div>
  );
};

export default ElevenLabsConversation;