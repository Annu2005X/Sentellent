import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const CommandCenter = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "ai",
            content: "**Good morning, Alex.**\n\nI've finished scanning your communications. I am ready to assist you.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [memories, setMemories] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch memory on mount
    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const data = await api.getMemory();
                setMemories(data.memories || []);
            } catch (e) {
                console.error("Failed to fetch memories", e);
            }
        };
        fetchMemory();
    }, [messages]); // Refetch when messages change (in case memory updated)

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsLoading(true);

        try {
            const response = await api.sendMessage(inputText);

            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                content: response.response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                role: "ai",
                content: "I'm having trouble connecting to the server. Please ensure the backend is running.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleLogout = async () => {
        await api.logout();
        navigate("/login");
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden">
            <div className="flex h-screen w-full">

                {/* SIDEBAR */}
                <aside className="w-64 flex flex-col justify-between border-r border-[#233648] bg-[#111a22] p-4 hidden md:flex">
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
                            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30">
                                <span className="material-symbols-outlined">dashboard</span>
                                <p className="text-sm font-semibold">Command Center</p>
                            </a>

                            <a
                                href="/activity"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#92adc9] hover:bg-[#233648] hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[22px]">analytics</span>
                                <p className="text-sm font-medium">Activity Logs</p>
                            </a>
                        </nav>
                    </div>

                    {/* User Card */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 bg-[#1c2a38] rounded-xl border border-[#233648]">
                            <div
                                className="size-10 rounded-full bg-cover bg-center bg-gray-600"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">Alex Sterling</p>
                                <p className="text-[10px] text-[#92adc9]">Premium Workspace</p>
                            </div>
                            <span
                                className="material-symbols-outlined text-[#92adc9] text-sm cursor-pointer hover:text-red-500"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                logout
                            </span>
                        </div>

                        <button className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            New Command
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Top Bar */}
                    <header className="flex items-center justify-between border-b border-[#233648] px-8 py-4 bg-[#111a22]">
                        <div className="text-sm text-[#92adc9]">
                            Home / <span className="text-white">Command Center</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[11px] font-bold text-green-500 uppercase">
                                        System Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Chat */}
                        <section className="flex-1 flex flex-col border-r border-[#233648]">
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                                {messages.map((msg) => (
                                    <ChatBubble
                                        key={msg.id}
                                        ai={msg.role === 'ai'}
                                        user={msg.role === 'user'}
                                        time={msg.time}
                                        text={msg.content}
                                    />
                                ))}
                                {isLoading && (
                                    <div className="flex gap-4 max-w-3xl">
                                        <div className="size-9 rounded-lg flex items-center justify-center bg-primary/20">
                                            <span className="material-symbols-outlined text-white animate-spin">
                                                sync
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="bg-[#1c2a38] border border-[#233648] rounded-xl px-5 py-4 text-sm text-[#92adc9]">
                                                Processing...
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 md:p-6 bg-[#111a22] border-t border-[#233648]">
                                <div className="relative max-w-4xl mx-auto">
                                    <textarea
                                        rows={1}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Type a command or ask a question..."
                                        className="w-full bg-[#1c2a38] border border-[#233648] rounded-xl py-4 pl-5 pr-24 text-white resize-none placeholder:text-[#92adc9] focus:outline-none focus:border-primary"
                                    />
                                    <div className="absolute right-3 bottom-3 flex gap-2">
                                        <button className="bg-primary hover:bg-primary/90 p-2 rounded-lg transition-colors" onClick={handleSend} disabled={isLoading}>
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* RIGHT PANEL - Hidden on small screens */}
                        <aside className="w-96 bg-[#0b1218] p-6 overflow-y-auto hidden lg:block">
                            <h3 className="text-sm font-bold uppercase mb-4">
                                Dynamic Context
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase text-[#92adc9] mb-2">
                                        Active Memories
                                    </p>
                                    {memories.length > 0 ? (
                                        <div className="space-y-2">
                                            {memories.map((m) => (
                                                <div key={m.id} className="bg-[#1c2a38] p-3 rounded-lg border border-[#233648] text-xs text-slate-300">
                                                    {m.content}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-600 italic">No memories yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 border-t border-[#233648] pt-4">
                                <p className="text-xs uppercase text-[#92adc9]">
                                    Memory Load
                                </p>
                                <div className="h-1 bg-[#233648] rounded-full mt-2">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, memories.length * 10)}%` }}
                                    />
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
};

/* Chat Bubble Component with Markdown */
const ChatBubble = ({ ai, user, time, text }) => {
    const isAI = ai;
    return (
        <div
            className={`flex gap-4 max-w-3xl ${user ? "ml-auto flex-row-reverse" : ""
                }`}
        >
            <div
                className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${isAI ? "bg-primary/20" : "bg-[#233648]"
                    }`}
            >
                <span className="material-symbols-outlined text-white">
                    {isAI ? "smart_toy" : "person"}
                </span>
            </div>
            <div className={`space-y-1 ${user ? "text-right" : ""}`}>
                <div className="text-[10px] text-[#92adc9]">
                    {isAI ? "Sentellent" : "You"} · {time}
                </div>
                <div className={`bg-[#1c2a38] border border-[#233648] rounded-xl px-5 py-4 text-sm whitespace-pre-wrap text-left ${user ? "bg-primary/10 border-primary/20" : ""}`}>
                    {user ? (
                        text
                    ) : (
                        <div className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {text}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
