import React from 'react';

const Sidebar = () => {
  return (
    <div className="h-screen w-16 bg-gray-900 flex flex-col items-center space-y-4 py-6">
      <div className="text-white">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
      </div>
      <nav className="flex flex-col space-y-6">
        <a href="/" className="text-gray-500 hover:text-white">
          <i className="fas fa-home"></i>
        </a>
        <a href="/contacts" className="text-gray-500 hover:text-white">
          <i className="fas fa-user"></i>
        </a>
        <a href="/messages" className="text-gray-500 hover:text-white">
          <i className="fas fa-envelope"></i>
        </a>
        <a href="/campaigns" className="text-gray-500 hover:text-white">
          <i className="fas fa-paper-plane"></i>
        </a>
        <a href="/tasks" className="text-gray-500 hover:text-white">
          <i className="fas fa-tasks"></i>
        </a>
      </nav>
      <div className="mt-auto text-white">
        <div className="rounded-full bg-green-500 p-2">
          <i className="fas fa-user"></i>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
