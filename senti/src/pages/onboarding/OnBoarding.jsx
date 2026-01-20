import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const OnBoarding = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Redirect directly to backend to ensure session cookies are set correctly
    // Redirect directly to backend to ensure session cookies are set correctly
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-border-dark px-10 py-3 bg-white dark:bg-background-dark">
        <div className="flex items-center gap-4 text-gray-900 dark:text-white">
          <div className="size-6 text-primary">
            <svg viewBox="0 0 48 48" fill="currentColor">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L13.8261 17.4264Z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Sentellent</h2>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex justify-center items-center px-4 py-12">
        <div className="max-w-[500px] w-full space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Welcome to Sentellent
            </h1>
            <p className="text-gray-600 dark:text-text-muted">
              Connect your digital workspace to give your AI context.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-card-dark rounded-xl border dark:border-border-dark shadow-xl overflow-hidden p-8">
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-bold">Connect Workspace</h3>

              <button className="primary-btn w-full flex items-center justify-center gap-3" onClick={handleContinue}>
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-card-dark px-2 text-gray-400">Or</span>
                </div>
              </div>

              <button
                className="w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                Skip for now
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400">
            Secure, end-to-end encrypted integration
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-border-dark px-10 py-6 text-xs text-gray-400 flex justify-center">
        <p>© 2026 Sentellent Inc.</p>
      </footer>
    </div>
  );
};

export default OnBoarding;
