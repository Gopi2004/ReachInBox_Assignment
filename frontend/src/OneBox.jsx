import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toggle from './Toggle';
import CustomEditor from './CustomEditor';

const OneBox = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyBody, setReplyBody] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axios.get('/onebox/list');
      setThreads(response.data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const handleDelete = async (threadId) => {
    try {
      await axios.delete(`/onebox/${threadId}`);
      fetchThreads();
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  const handleReply = async (threadId) => {
    try {
      await axios.post(`/reply/${threadId}`, {
        from: 'email',
        to: 'email',
        subject: '',
        body: replyBody,
      });
      setReplyBody('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (selectedThread) {
      if (event.key === 'D') {
        handleDelete(selectedThread);
      } else if (event.key === 'R') {
        // Handle opening the reply box
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedThread]);

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen dark:bg-white dark:text-black">
      <Toggle />
      <h1 className="text-3xl mb-4">OneBox</h1>
      <div>
        {threads.map(thread => (
          <div key={thread.id} className="mb-4 p-4 bg-gray-800 rounded-md">
            <h2 className="text-xl">{thread.subject}</h2>
            <p>{thread.body}</p>
            <button onClick={() => setSelectedThread(thread.id)} className="bg-blue-500 px-4 py-2 rounded mt-2">
              Select
            </button>
          </div>
        ))}
      </div>
      {selectedThread && (
        <div className="mt-4">
          <CustomEditor value={replyBody} onChange={setReplyBody} />
          <button onClick={() => handleReply(selectedThread)} className="bg-blue-500 px-4 py-2 rounded mt-2">
            Send Reply
          </button>
        </div>
      )}
    </div> 
  );
};

export default OneBox;
