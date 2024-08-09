import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeletePopup from './DeletePopup';  // Import the DeletePopup component

const MainContent = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5002/onebox/list')
      .then(response => {
        setThreads(response.data);
      })
      .catch(error => {
        console.error('Error fetching threads:', error);
      });
  }, []);

  // Listen for Ctrl+D or Cmd+D to trigger the delete popup and "R" to open the reply box
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedThread) {
        if (event.key === 'd') {
          event.preventDefault(); // Prevent the default browser action for Ctrl+D / Cmd+D
          setShowPopup(true);  // Show the delete popup
        }
        if (event.key.toLowerCase() === 'r') {
          setShowReplyBox(true); // Show reply box when 'R' is pressed
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedThread]);

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
    setShowReplyBox(false); // Close reply box when a different thread is selected
  };

  const handleDelete = (threadId) => {
    axios.delete(`http://localhost:5002/onebox/${threadId}`)
      .then(response => {
        setThreads(threads.filter(thread => thread._id !== threadId));
        setSelectedThread(null);
        setShowPopup(false);  // Close the popup after deletion
      })
      .catch(error => {
        console.error('Error deleting thread:', error);
      });
  };

  const handleSendReply = () => {
    if (selectedThread) {
      axios.post(`http://localhost:5002/reply/${selectedThread._id}`, {
        from: 'your_email@example.com', // Replace with actual sender's email
        to: selectedThread.creator, // Assuming the creator's email is the recipient
        subject: `Re: ${selectedThread.subject}`,
        body: replyContent
      })
      .then(response => {
        console.log('Reply sent:', response.data);
        setShowReplyBox(false); // Close the reply box after sending
      })
      .catch(error => {
        console.error('Error sending reply:', error);
      });
    }
  };

  return (
    <main className="flex w-full h-full shadow-lg rounded-3xl">
      {/* Sidebar with thread list */}
      <section className="flex flex-col w-2/12 bg-white rounded-l-3xl">
        <div className="w-16 mx-auto mt-12 mb-20 p-4 bg-indigo-600 rounded-2xl text-white">
          {/* SVG Icon */}
        </div>
        <nav className="relative flex flex-col py-4 items-center">
          {/* Navigation items */}
          <a href="#" className="relative w-16 p-4 bg-purple-100 text-purple-900 rounded-2xl mb-4">
            {/* SVG Icon */}
            <span className="absolute -top-2 -right-2 bg-red-600 h-6 w-6 p-2 flex justify-center items-center text-white rounded-full">3</span>
          </a>
          {/* Other navigation items */}
        </nav>
      </section>

      {/* Main content */}
      <section className="flex flex-col pt-3 w-4/12 bg-gray-50 h-full overflow-y-scroll">
        <label className="px-3">
          <input className="rounded-lg p-4 bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 w-full"
            placeholder="Search..." />
        </label>

        <ul className="mt-6">
          {threads.map(thread => (
            <li key={thread._id} className={`cursor-pointer p-4 border-b ${selectedThread === thread ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => handleThreadClick(thread)}>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{thread.subject}</h3>
                <p className="text-sm text-gray-600">Creator: {thread.creator}</p>
                <p className="text-xs text-gray-400">{new Date(thread.date).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Email content */}
      <section className="flex flex-col w-6/12 bg-gray-50 h-full overflow-y-scroll">
        {selectedThread ? (
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">{selectedThread.subject}</h2>
            <p className="text-gray-700 mb-4">Creator: {selectedThread.creator}</p>
            <p className="text-gray-600">{selectedThread.body}</p>
            <p className="text-xs text-gray-400 mt-4">{new Date(selectedThread.date).toLocaleDateString()}</p>
            {showReplyBox && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Reply</h3>
                <textarea
                  className="w-full h-32 p-2 border rounded-lg"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-indigo-600 text-white p-2 rounded-lg" onClick={handleSendReply}>Send</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a thread to view the content</p>
          </div>
        )}
      </section>

      {/* Delete popup */}
      {showPopup && selectedThread && (
        <DeletePopup
          thread={selectedThread}
          onClose={() => setShowPopup(false)}
          onDelete={() => handleDelete(selectedThread._id)}
        />
      )}
    </main>
  );
};

export default MainContent;
