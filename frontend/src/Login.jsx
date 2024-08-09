import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from './Firebase';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User info:', result.user);
      navigate('/layout');
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Reachinbox logo at the top */}
      <div className="bg-black p-4">
        <div className="flex items-center justify-center">
          <div className="bg-white text-black font-bold text-xl p-1 mr-2">M</div>
          <h1 className="text-white text-xl font-bold">REACHINBOX</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-white text-lg font-semibold mb-4 text-center">Create a new account</h2>
          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded flex items-center justify-center mb-4 hover:bg-gray-700 transition duration-300"
          >
            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google" className="w-4 h-4 mr-2" />
            Sign Up with Google
          </button>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Create an Account
          </button>
          <p className="text-gray-400 text-sm mt-4 text-center">
            Already have an account? <a href="#" className="text-blue-400 hover:underline">Sign In</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs py-4">
        © 2023 Reachinbox. All rights reserved.
      </div>
    </div>
  );
};

export default Login;