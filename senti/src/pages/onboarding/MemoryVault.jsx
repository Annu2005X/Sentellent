import React from "react";

const MemoryVault = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
            <div className="flex h-screen overflow-hidden">

                {/* SIDEBAR */}
                <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col">
                    <div className="p-6 flex items-center gap-3">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold">Memory Vault</h1>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                                Sentellent
                            </p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        <NavItem active icon="neurology" label="Vault" />
                        <NavItem icon="check_circle" label="Tasks" />
                        <NavItem icon="calendar_today" label="Calendar" />
                        <NavItem icon="person" label="Contacts" />
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div
                                className="size-8 rounded-full bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtvYOW3MbPyap3KyqIMu6dOInl159XHJb_mEX0az4iQ4uKPQNcLCmDTboEJ87K1hTRYst4BAmuOdswR0Bd8DtMsN9VXmKsrXsyK9toPukJFt1DZtR5zRom6KzJyH6lJe1rBU6NNTR62aoTskgj0G5XkEW51BBfuG6MFW3Mw_ayfsziV6AOom6DwKOzaAzPiE85z-ZK9zaaBg0kiNdF6S1dAeLG8XnoCr8QLc9ZnuHfDOh0fV0oqMQpNs911YeJI0u_p4gEdRnqUS8')",
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">Alex Rivera</p>
                                <p className="text-[10px] text-slate-500 truncate">
                                    Pro Account
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer">
                                settings
                            </span>
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* TOP BAR */}
                    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8">
                        <div className="relative w-full max-w-xl">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                search
                            </span>
                            <input
                                className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
                                placeholder="Search memories, facts, or preferences..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 relative rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined">
                                    notifications
                                </span>
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full" />
                            </button>

                            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
                                <span className="material-symbols-outlined text-sm">add</span>
                                New Fact
                            </button>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-black mb-2">The Brain</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mb-8">
                                A centralized knowledge base of everything your Sentellent
                                has learned.
                            </p>

                            {/* FILTERS */}
                            <div className="flex gap-3 mb-8 overflow-x-auto">
                                {[
                                    "All Memories",
                                    "Preferences",
                                    "Project Updates",
                                    "Schedules",
                                    "Financials",
                                ].map((f, i) => (
                                    <button
                                        key={f}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${i === 0
                                            ? "bg-primary text-white"
                                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            {/* GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <MemoryCard
                                    tag="Preference"
                                    tagColor="blue"
                                    title="Meeting Summaries"
                                    text="Prefers all meeting recaps in concise bullet points."
                                    source="Gmail"
                                />
                                <MemoryCard
                                    tag="Project Update"
                                    tagColor="emerald"
                                    title="Project Helios Deadline"
                                    text="Roadmap review moved to October 27th."
                                    source="Slack"
                                />
                                <MemoryCard
                                    tag="Schedule"
                                    tagColor="purple"
                                    title="Morning Routine"
                                    text="No meetings before 9:00 AM. Reserved for deep work."
                                    source="Calendar"
                                />

                                {/* ADD CARD */}
                                <div className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer">
                                    <span className="material-symbols-outlined text-4xl mb-2">
                                        add_circle
                                    </span>
                                    <p className="text-sm font-bold">Add Extracted Fact</p>
                                    <p className="text-[11px] opacity-60">
                                        Teach your AI something new
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

/* -------- Components -------- */

const NavItem = ({ icon, label, active }) => (
    <a
        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${active
            ? "bg-primary/10 text-primary"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
    >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </a>
);

const MemoryCard = ({ tag, tagColor, title, text, source }) => (
    <div className="bg-white dark:bg-slate-900 border rounded-xl p-5 flex flex-col hover:border-primary/50 transition">
        <span
            className={`text-[10px] font-bold uppercase mb-3 text-${tagColor}-600`}
        >
            {tag}
        </span>
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
            {text}
        </p>
        <div className="mt-4 pt-3 border-t text-[11px] text-slate-500">
            Source: {source}
        </div>
    </div>
);

export default MemoryVault;
