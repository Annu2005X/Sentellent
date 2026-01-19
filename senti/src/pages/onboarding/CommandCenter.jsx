import React from "react";

const CommandCenter = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden">
            <div className="flex h-screen w-full">

                {/* SIDEBAR */}
                <aside className="w-64 flex flex-col justify-between border-r border-[#233648] bg-[#111a22] p-4">
                    <div className="flex flex-col gap-6">
                        {/* Branding */}
                        <div className="flex items-center gap-3 px-2">
                            <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">
                                    shield_person
                                </span>
                            </div>
                            <div>
                                <h1 className="text-white text-base font-bold leading-none">
                                    Sentellent
                                </h1>
                                <p className="text-[#92adc9] text-[11px] font-medium mt-1">
                                    v2.4 Proactive
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30">
                                <span className="material-symbols-outlined">dashboard</span>
                                <p className="text-sm font-semibold">Command Center</p>
                            </a>

                            {[
                                ["database", "Knowledge Base"],
                                ["hub", "Integrations"],
                                ["settings", "System Settings"],
                            ].map(([icon, label]) => (
                                <a
                                    key={label}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#92adc9] hover:bg-[#233648] hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[22px]">
                                        {icon}
                                    </span>
                                    <p className="text-sm font-medium">{label}</p>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* User Card */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 bg-[#1c2a38] rounded-xl border border-[#233648]">
                            <div
                                className="size-10 rounded-full bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKTsvmwD59qTrd001lHX_VXTtN9PA0lftupBrj4MT5FNfQkIAHWmjZdIGg7k1dE2qLb2zyHfedDhJIuxgo2rsUdjOpk4kAKPZRuXp1tRFMmftg1CUpAGcxQzp-cR43TcTE6RBBDcEhbERx3O1nxz1j9J9Jjl2N6Edbu6PHf7PMi47ymU0hAHf9EubNvonyCjidtZ9FxQ5FlLQz93A00qylsvLogGmXJtDStKC5Na2BYPQ6wOLUUThuk-SCFGLfAPFx9iK0MdNw_70')",
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">Alex Sterling</p>
                                <p className="text-[10px] text-[#92adc9]">Premium Workspace</p>
                            </div>
                            <span className="material-symbols-outlined text-[#92adc9] text-sm cursor-pointer">
                                more_vert
                            </span>
                        </div>

                        <button className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            New Command
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <header className="flex items-center justify-between border-b border-[#233648] px-8 py-4 bg-[#111a22]">
                        <div className="text-sm text-[#92adc9]">
                            Home / <span className="text-white">Command Center</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2 text-[#92adc9]">
                                    search
                                </span>
                                <input
                                    className="bg-[#233648] rounded-lg pl-10 pr-4 py-2 text-sm text-white w-64 placeholder:text-[#92adc9]"
                                    placeholder="Search insights or history..."
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[11px] font-bold text-green-500 uppercase">
                                        System Online
                                    </span>
                                </div>
                                <button>
                                    <span className="material-symbols-outlined text-[#92adc9]">
                                        notifications
                                    </span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Chat */}
                        <section className="flex-1 flex flex-col border-r border-[#233648]">
                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {/* AI Message */}
                                <ChatBubble
                                    ai
                                    time="08:15 AM"
                                    text={
                                        <>
                                            Good morning, Alex. I've finished scanning your
                                            communications.
                                            <br />
                                            <br />
                                            <strong className="text-primary">
                                                Priority Alert:
                                            </strong>{" "}
                                            Project X is delayed due to API documentation.
                                        </>
                                    }
                                />

                                {/* User */}
                                <ChatBubble
                                    user
                                    time="08:17 AM"
                                    text="Let's nudge the engineer first. Also pull up my agenda."
                                />

                                {/* AI Reply */}
                                <ChatBubble
                                    ai
                                    time="08:17 AM"
                                    text="Understood. Nudge sent. Your agenda has been updated on the right panel."
                                />
                            </div>

                            {/* Input */}
                            <div className="p-6 bg-[#111a22] border-t border-[#233648]">
                                <div className="relative max-w-4xl mx-auto">
                                    <textarea
                                        rows={1}
                                        placeholder="Type a command or ask a question..."
                                        className="w-full bg-[#1c2a38] border border-[#233648] rounded-xl py-4 pl-5 pr-24 text-white resize-none placeholder:text-[#92adc9]"
                                    />
                                    <div className="absolute right-3 bottom-3 flex gap-2">
                                        <button>
                                            <span className="material-symbols-outlined">mic</span>
                                        </button>
                                        <button className="bg-primary p-2 rounded-lg">
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* RIGHT PANEL */}
                        <aside className="w-96 bg-[#0b1218] p-6 overflow-y-auto">
                            <h3 className="text-sm font-bold uppercase mb-4">
                                Today's Agenda
                            </h3>
                            <p className="text-xs text-[#92adc9]">
                                09:00 AM — Executive Board Sync
                            </p>

                            <div className="mt-6 border-t border-[#233648] pt-4">
                                <p className="text-xs uppercase text-[#92adc9]">
                                    Memory Load
                                </p>
                                <div className="h-1 bg-[#233648] rounded-full mt-2">
                                    <div className="h-full w-[42%] bg-primary rounded-full" />
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
};

/* Chat Bubble Component */
const ChatBubble = ({ ai, user, time, text }) => {
    const isAI = ai;
    return (
        <div
            className={`flex gap-4 max-w-3xl ${user ? "ml-auto flex-row-reverse" : ""
                }`}
        >
            <div
                className={`size-9 rounded-lg flex items-center justify-center ${isAI ? "bg-primary/20" : "bg-[#233648]"
                    }`}
            >
                <span className="material-symbols-outlined text-white">
                    {isAI ? "smart_toy" : "person"}
                </span>
            </div>
            <div className="space-y-1">
                <div className="text-[10px] text-[#92adc9]">
                    {isAI ? "Sentellent" : "You"} · {time}
                </div>
                <div className="bg-[#1c2a38] border border-[#233648] rounded-xl px-5 py-4 text-sm">
                    {text}
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
