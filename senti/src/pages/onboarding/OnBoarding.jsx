import React from 'react';

const OnBoarding = () => {
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

        <div className="flex items-center gap-4">
          <button className="icon-btn">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="icon-btn">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div
            className="size-10 rounded-full bg-cover border-2 border-primary"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaQusI5mPL0p6Irp3W2BVJRuWCc_Av1kn-QDbssZ4tTcDv2eEKixFtvVDK_Rx2gJOtPTdrGZT5-xeuU6-aJqvEW3eaUBXe3B7epDx1nDN8M6WzBELMHYY5tFGrIPUfDXntVii7C081yVbA1cc8pmqwB9CURupiXdlPPoJ4K-z6hIYLBkJtQGhIoSIqfRC2f7RYluRLBJ-N7xaWN0MbwKAXnPefWqWAm1SnjsIHoArrxq5zHRPVCSfi7VbY95dewu6Xr4ujB0SlFJM')",
            }}
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex justify-center items-center px-4 py-12">
        <div className="max-w-[960px] w-full space-y-8">
          {/* Title */}
          <div className="flex justify-between items-start flex-wrap gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white">
                Welcome, Alex.
                <br />
                Let’s set up your Sentellent.
              </h1>
              <p className="text-gray-600 dark:text-text-muted mt-2 max-w-xl">
                Connect your digital workspace to give your AI context on your
                schedule, tasks, and communications.
              </p>
            </div>
            <button className="secondary-btn">Skip for now</button>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-card-dark rounded-xl border dark:border-border-dark shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="border-b dark:border-border-dark bg-gray-50/50 dark:bg-black/10 flex">
              {["Authentication", "Knowledge Sync", "Assistant Setup"].map(
                (step, i) => (
                  <div
                    key={i}
                    className={`px-6 py-4 text-sm font-bold ${i === 0
                      ? "text-primary border-b-4 border-primary"
                      : "text-gray-400"
                      }`}
                  >
                    {i + 1}. {step}
                  </div>
                )
              )}
            </div>

            {/* Content */}
            <div className="p-10 space-y-10">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Onboarding Status</span>
                  <span className="text-primary">33% Complete</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-[#324d67] mt-2">
                  <div className="h-full w-1/3 bg-primary rounded-full" />
                </div>
                <p className="text-xs text-gray-500 dark:text-text-muted mt-2">
                  Step 1 of 3: Syncing Identity
                </p>
              </div>

              {/* Google Connect */}
              <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-6 dark:border-border-dark">
                <h3 className="text-2xl font-bold">
                  Connect Google Workspace
                </h3>
                <p className="text-gray-600 dark:text-text-muted max-w-md mx-auto">
                  Securely sync Gmail, Calendar, and Drive to power your AI
                  assistant.
                </p>

                <button className="primary-btn flex items-center gap-3 mx-auto">
                  <svg className="size-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    lock
                  </span>
                  Secure, end-to-end encrypted integration
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-sm text-gray-500 dark:text-text-muted">
            Not using Google?{" "}
            <span className="text-primary font-bold cursor-pointer">
              Connect manually or via Microsoft Outlook
            </span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-border-dark px-10 py-6 text-xs text-gray-400 flex justify-between">
        <div className="space-x-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
        <p>© 2024 Sentellent Inc.</p>
      </footer>
    </div>
  );
};

export default OnBoarding;
