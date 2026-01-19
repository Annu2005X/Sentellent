import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const AgentActivity = () => {
    const navigate = useNavigate();
    const [memories, setMemories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        await api.logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getMemory();
                setMemories(data.memories || []);
            } catch (e) {
                console.error("Failed to fetch activity", e);
            }
        };
        fetchData();
    }, []);

    const filteredMemories = memories.filter(mem =>
        mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mem.time && mem.time.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
            <div className="flex flex-col min-h-screen">

                {/* TOP NAV */}
                <header className="flex items-center justify-between border-b border-slate-200 dark:border-[#233648] px-6 py-3 bg-white dark:bg-background-dark sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-primary">
                            <div className="size-6">
                                <svg viewBox="0 0 48 48" className="w-full h-full" fill="currentColor">
                                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold">Sentellent</h2>
                        </div>

                        <div className="flex items-center rounded-lg border border-slate-200 dark:border-none overflow-hidden h-10 w-96 max-w-full">
                            <div className="pl-4 flex items-center bg-slate-50 dark:bg-[#233648] h-full">
                                <span className="material-symbols-outlined text-slate-400">
                                    search
                                </span>
                            </div>
                            <input
                                className="bg-slate-50 dark:bg-[#233648] px-4 text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92adc9] h-full w-full"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-white hover:text-primary">Dashboard</a>
                            <a href="/activity" className="text-sm font-medium text-primary font-semibold">Activity</a>
                        </nav>

                        <div className="h-6 w-px bg-slate-200 dark:bg-[#233648]" />

                        <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors" title="Logout">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex flex-1 max-w-[1440px] mx-auto w-full">

                    {/* LEFT SIDEBAR */}
                    <aside className="w-64 hidden lg:flex flex-col border-r border-slate-200 dark:border-[#233648] bg-white dark:bg-background-dark p-4 gap-6">
                        <div>
                            <h1 className="text-sm font-bold uppercase">Agentic AI</h1>
                            <p className="text-xs text-[#92adc9] flex items-center gap-1">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                v2.4.0 Running
                            </p>
                        </div>

                        <nav className="space-y-1">
                            <SideItem icon="analytics" label="All Activity" active />
                        </nav>
                    </aside>

                    {/* CENTER CONTENT */}
                    <section className="flex-1 bg-slate-50 dark:bg-[#111a22] overflow-y-auto">
                        <div className="p-8">
                            <h1 className="text-4xl font-black mb-2">Activity & Reasoning</h1>
                            <p className="text-slate-500 dark:text-[#92adc9] max-w-xl">
                                Real-time trace of memory updates and autonomous actions.
                            </p>
                        </div>

                        <div className="px-8 space-y-4 pb-12">
                            {filteredMemories.length > 0 ? (
                                filteredMemories.map((mem) => (
                                    <ActivityCard
                                        key={mem.id}
                                        icon="psychology"
                                        title={`Memory Update: ${mem.content.split(':')[0]}`}
                                        time={mem.time}
                                        status="Learned"
                                        statusColor="emerald"
                                        description={mem.content}
                                    />
                                ))
                            ) : (
                                <div className="text-center text-slate-500 py-10">
                                    {searchQuery ? "No matching logs found." : "No activity recorded yet. Chat with the agent to generate memories."}
                                </div>
                            )}

                            {/* Static Example - shown only if no search or if search matches it (but hard to match static) */}
                            {/* Let's hide static example if searching to avoid confusion, or keep it. I'll hide it if there is a search query that doesn't match 'System' */}
                            {!searchQuery && (
                                <ActivityCard
                                    icon="calendar_today"
                                    title='System: Agent Initialized'
                                    time="Just now"
                                    status="System"
                                    statusColor="primary"
                                />
                            )}
                        </div>
                    </section>

                    {/* RIGHT PANEL */}
                    <aside className="w-80 hidden xl:flex flex-col border-l border-slate-200 dark:border-[#233648] bg-white dark:bg-background-dark p-6">
                        <h4 className="text-sm font-bold uppercase mb-4">Agent Stats</h4>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <Stat label="Memories" value={memories.length} color="primary" />
                            <Stat label="Actions" value="0" color="amber" />
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};

/* ---------- COMPONENTS ---------- */

const SideItem = ({ icon, label, active }) => (
    <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${active
            ? "bg-primary/10 text-primary"
            : "text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-[#233648]"
            }`}
    >
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
        <p className="text-sm font-medium">{label}</p>
    </div>
);

const ActivityCard = ({ icon, title, time, status, statusColor, description, error }) => (
    <div
        className={`bg-white dark:bg-[#1c2a39] rounded-xl border p-5 shadow-sm ${error
            ? "border-red-500/30"
            : "border-slate-200 dark:border-[#233648]"
            }`}
    >
        <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${statusColor}-500/10 text-${statusColor}-500`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-1">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <span className="text-xs font-mono text-slate-400">{time}</span>
                </div>
                {description && (
                    <p className="text-sm text-slate-500 dark:text-[#92adc9]">
                        {description}
                    </p>
                )}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-${statusColor}-500/10 text-${statusColor}-500`}>
                {status}
            </span>
        </div>
    </div>
);

const Stat = ({ label, value, color }) => (
    <div className="bg-slate-50 dark:bg-[#1c2a39] p-4 rounded-lg border border-slate-100 dark:border-[#233648]">
        <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
        <p className={`text-2xl font-black text-${color}-500`}>{value}</p>
    </div>
);

export default AgentActivity;
