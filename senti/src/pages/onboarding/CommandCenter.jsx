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
            content: "**System Online.**\n\nI am ready to assist you. You can attach images or documents for analysis.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [memories, setMemories] = useState([]);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const loadData = async () => {
            // Fetch Profile
            const profile = await api.getUserProfile();
            setUser(profile);

            // Fetch Memory
            try {
                const data = await api.getMemory();
                setMemories(data.memories || []);
            } catch (e) {
                console.error("Failed to fetch memories", e);
            }
        };
        loadData();
    }, []);

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setFile({
                name: selected.name,
                type: selected.type,
                data: e.target.result // base64 data url
            });
        };
        reader.readAsDataURL(selected);
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSend = async () => {
        if (!inputText.trim() && !file) return;

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: inputText,
            file: file,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        // Store temp file ref for API call, then clear UI state
        const tempFile = file;

        setInputText("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setIsLoading(true);

        try {
            const response = await api.sendMessage(inputText, tempFile);

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

    const handleNewCommand = () => {
        setMessages([
            {
                id: Date.now(),
                role: "ai",
                content: "**System Online.**\n\nI am ready to assist you.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        setInputText("");
        clearFile();
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
                            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary border border-[#233648]">
                                <span className="material-symbols-outlined">dashboard</span>
                                <p className="text-sm font-semibold">Command Center</p>
                            </a>

                            <a
                                href="/activity"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#92adc9] hover:bg-[#233648] hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-auth-light dark:text-auth-dark text-[22px]">analytics</span>
                                <p className="text-sm font-medium">Activity Logs</p>
                            </a>
                        </nav>
                    </div>

                    {/* User Card */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 bg-[#1c2a38] rounded-xl border border-[#233648]">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{user?.name || "Guest User"}</p>
                                <p className="text-[10px] text-[#92adc9] truncate">{user?.email || "Premium Workspace"}</p>
                            </div>
                            <span
                                className="material-symbols-outlined text-[#92adc9] text-sm cursor-pointer hover:text-red-500"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                logout
                            </span>
                        </div>

                        <button
                            onClick={handleNewCommand}
                            className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            New Chat
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="flex-1 flex overflow-hidden">
                        {/* Chat Area */}
                        <section className="flex-1 flex flex-col relative">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                                {messages.map((msg) => (
                                    <ChatBubble
                                        key={msg.id}
                                        ai={msg.role === 'ai'}
                                        user={msg.role === 'user'}
                                        time={msg.time}
                                        text={msg.content}
                                        file={msg.file}
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
                                    {/* File Preview */}
                                    {file && (
                                        <div className="absolute bottom-full mb-2 left-0 bg-[#1c2a38] border border-[#233648] rounded-lg p-2 pr-3 flex items-center gap-2 shadow-lg">
                                            {file.type.startsWith('image/') ? (
                                                <img src={file.data} className="w-8 h-8 rounded object-cover" alt="preview" />
                                            ) : (
                                                <div className="bg-slate-700/50 p-1.5 rounded">
                                                    <span className="material-symbols-outlined text-sm text-primary">description</span>
                                                </div>
                                            )}
                                            <span className="text-xs text-white max-w-[200px] truncate">{file.name}</span>
                                            <button onClick={clearFile} className="ml-2 text-gray-400 hover:text-red-500 flex items-center">
                                                <span className="material-symbols-outlined text-[16px]">close</span>
                                            </button>
                                        </div>
                                    )}

                                    <textarea
                                        rows={1}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Type a command or attach a file..."
                                        className="w-full bg-[#1c2a38] border border-[#233648] rounded-xl py-4 pl-5 pr-24 text-white resize-none placeholder:text-[#92adc9] focus:outline-none focus:border-primary"
                                    />
                                    <div className="absolute right-3 bottom-3 flex gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleFileSelect}
                                            accept="image/*,.pdf,.txt,.doc,.docx"
                                        />
                                        <button
                                            className="text-[#92adc9] hover:text-white p-2 transition-colors flex items-center justify-center"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Attach file"
                                        >
                                            <span className="material-symbols-outlined">attach_file</span>
                                        </button>
                                        <button className="bg-primary hover:bg-primary/90 p-2 rounded-lg transition-colors flex items-center justify-center" onClick={handleSend} disabled={isLoading}>
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

/* Chat Bubble Component with Markdown */
const ChatBubble = ({ ai, user, time, text, file }) => {
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
                    {file && (
                        <div className="mb-3 p-2 bg-black/20 rounded border border-white/10 flex items-center gap-3 w-fit">
                            {file.type.startsWith('image/') ? (
                                <img src={file.data} alt="attachment" className="w-16 h-16 object-cover rounded" />
                            ) : (
                                <div className="bg-white/10 p-2 rounded">
                                    <span className="material-symbols-outlined text-xl">description</span>
                                </div>
                            )}
                            <div className="text-left">
                                <p className="text-xs font-bold truncate max-w-[150px]">{file.name}</p>
                                <p className="text-[10px] text-gray-400 uppercase">{file.type.split('/')[1]}</p>
                            </div>
                        </div>
                    )}

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
