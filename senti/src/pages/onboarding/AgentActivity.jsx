import React from "react";

const AgentActivity = () => {
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

                        <div className="flex items-center rounded-lg border border-slate-200 dark:border-none overflow-hidden h-10">
                            <div className="pl-4 flex items-center bg-slate-50 dark:bg-[#233648]">
                                <span className="material-symbols-outlined text-slate-400">
                                    search
                                </span>
                            </div>
                            <input
                                className="bg-slate-50 dark:bg-[#233648] px-4 text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92adc9]"
                                placeholder="Search logs..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6">
                            {["Dashboard", "Activity", "Memory", "Settings"].map((item) => (
                                <a
                                    key={item}
                                    className={`text-sm font-medium ${item === "Activity"
                                        ? "text-primary font-semibold"
                                        : "text-slate-600 dark:text-white hover:text-primary"
                                        }`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="h-6 w-px bg-slate-200 dark:bg-[#233648]" />

                        <button className="flex items-center gap-2 bg-primary text-white px-4 h-10 rounded-lg text-sm font-bold">
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                            Agent Active
                        </button>

                        <div
                            className="size-10 rounded-full bg-cover border-2 border-primary/20"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdHp3A6sxmHpruGUVAyjVyGx0F4y1CwfQHijCSVOVM4F5KXglA8e8YAClBfoBhBC7oujA26MdvEf-v_rif8zyMqUykoVe5-JaVcgt7gvI8waUtY_MGS51kigx8wvauEm_pZuP2lrpAdy1zaCyjeVgtl1IONjVDqOARpnYgDJM7jDT-CRQco7bF_Tt46v9SrIdvaSZYjbWibJCVfe925bsd_2kRBOdwchx-vqxE5YuhIHHCUdGRQfk6yrCfYZIBCPwcOojy5QN7wHw')",
                            }}
                        />
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
                            <SideItem icon="mail" label="Email Syncs" />
                            <SideItem icon="calendar_month" label="Calendar Logic" />
                            <SideItem icon="chat_bubble" label="Chat Updates" />
                            <SideItem icon="database" label="Memory Logs" />
                        </nav>

                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#233648]">
                            <button className="w-full bg-[#233648] text-white h-10 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">sync</span>
                                Trigger Sync
                            </button>
                        </div>
                    </aside>

                    {/* CENTER CONTENT */}
                    <section className="flex-1 bg-slate-50 dark:bg-[#111a22] overflow-y-auto">
                        <div className="p-8">
                            <h1 className="text-4xl font-black mb-2">Activity & Reasoning</h1>
                            <p className="text-slate-500 dark:text-[#92adc9] max-w-xl">
                                Real-time trace of background reasoning and autonomous actions.
                            </p>
                        </div>

                        <div className="px-8 space-y-4 pb-12">
                            <ActivityCard
                                icon="mail"
                                title="Synced Email: Extracted Project X delay"
                                time="14:22:05 UTC"
                                status="Success"
                                statusColor="emerald"
                                description="Processed 14 new messages from Engineering Team."
                            />

                            <ActivityCard
                                icon="chat_bubble"
                                title="Chat Update: Noted preference for no 9 AM meetings"
                                time="12:05:11 UTC"
                                status="Learned Insight"
                                statusColor="amber"
                            />

                            <ActivityCard
                                icon="calendar_today"
                                title='Calendar Logic: Rescheduled "Deep Work" block'
                                time="09:15:44 UTC"
                                status="Auto-Action"
                                statusColor="primary"
                            />

                            <ActivityCard
                                icon="warning"
                                title="API Error: Notion Sync Failed"
                                time="08:02:11 UTC"
                                status="Needs Attention"
                                statusColor="red"
                                error
                            />
                        </div>
                    </section>

                    {/* RIGHT PANEL */}
                    <aside className="w-80 hidden xl:flex flex-col border-l border-slate-200 dark:border-[#233648] bg-white dark:bg-background-dark p-6">
                        <h4 className="text-sm font-bold uppercase mb-4">Agent Stats (24h)</h4>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <Stat label="Actions" value="142" color="primary" />
                            <Stat label="Learning" value="28" color="amber" />
                        </div>

                        <h4 className="text-sm font-bold uppercase mb-4">Current Thinking</h4>
                        <div className="bg-[#111a22] p-4 rounded-lg border border-[#233648]">
                            <p className="text-xs text-slate-400 font-mono mb-2">t+2s status</p>
                            <p className="text-sm italic text-slate-300">
                                "Monitoring project-delta channel for release blockers..."
                            </p>
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
