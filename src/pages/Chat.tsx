
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    setDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    orderBy,
    limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Send, Heart, Search, Copy, User } from 'lucide-react';
import { MessageCircleHeart } from '../components/ui/Icons';

export function Chat() {
    const { user, signInWithGoogle, romanticUsername, loading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [recentChats, setRecentChats] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db!, 'chats'),
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageTimestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRecentChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe;
    }, [user]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Search for users
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const q = query(
            collection(db!, 'users'),
            where('romanticUsername', '>=', searchQuery),
            where('romanticUsername', '<=', searchQuery + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((u: any) => u.id !== user?.uid); // Exclude self
        setSearchResults(results);
    };

    // Initialize/Fetch Chat
    useEffect(() => {
        if (!user || !selectedUser) return;

        // Create a consistent Chat ID based on sorted UIDs
        const participants = [user.uid, selectedUser.id].sort();
        const generatedChatId = participants.join('_');
        setChatId(generatedChatId);

        // Listen for messages
        const q = query(
            collection(db!, 'chats', generatedChatId, 'messages'),
            orderBy('timestamp', 'asc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe;
    }, [user, selectedUser]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId || !user || !selectedUser) return;

        // 1. Add message to subcollection
        await addDoc(collection(db!, 'chats', chatId, 'messages'), {
            text: newMessage,
            senderId: user.uid,
            timestamp: serverTimestamp(),
            senderName: romanticUsername
        });

        // 2. Update/Create parent chat document for "Inbox" listing
        // We store participantNames map so we don't need to fetch user docs every time we list chats
        await setDoc(doc(db!, 'chats', chatId), {
            participants: [user.uid, selectedUser.id],
            lastMessage: newMessage,
            lastMessageTimestamp: serverTimestamp(),
            participantNames: {
                [user.uid]: romanticUsername,
                [selectedUser.id]: selectedUser.romanticUsername
            }
        }, { merge: true });

        setNewMessage('');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!db || !auth) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-red-100">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Configuration Missing</h2>
                    <p className="text-gray-600">
                        To use the Secret Chat, you need to configure Firebase.
                        Please check the <code>.env</code> file instructions.
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-love-100"
                >
                    <div className="w-20 h-20 bg-love-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircleHeart className="w-10 h-10 text-love-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Secret Chat</h1>
                    <p className="text-gray-600 mb-8">
                        Sign in to get your secret romantic identity and find your Valentine.
                    </p>
                    <button
                        onClick={signInWithGoogle}
                        className="w-full py-4 bg-white border-2 border-gray-200 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                        Sign in with Google
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">

                {/* Sidebar: Profile & Search */}
                <div className="md:col-span-1 bg-white rounded-3xl shadow-lg border border-love-100 overflow-hidden flex flex-col">
                    <div className="p-6 bg-love-50 border-b border-love-100">
                        <h2 className="text-xs font-bold text-love-600 uppercase tracking-wider mb-1">Your Secret Identity</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-love-200 flex items-center justify-center text-xl">
                                🎭
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{romanticUsername}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer hover:text-love-600" onClick={() => navigator.clipboard.writeText(romanticUsername || '')}>
                                    <Copy className="w-3 h-3" /> Copy Username
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Find your Valentine</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search username..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-love-500 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="p-2 bg-love-500 text-white rounded-xl hover:bg-love-600"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Search Results</h3>
                                <div className="space-y-2">
                                    {searchResults.map((result) => (
                                        <div
                                            key={result.id}
                                            onClick={() => {
                                                setSelectedUser(result);
                                                setSearchResults([]); // Clear search after selection
                                                setSearchQuery('');
                                            }}
                                            className="p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-love-50 border border-transparent hover:border-love-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{result.romanticUsername}</p>
                                                <p className="text-xs text-gray-500">Tap to chat</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Chats (Inbox) */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Messages</h3>
                            {recentChats.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <MessageCircleHeart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No messages yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentChats.map((chat) => {
                                        // Find the OTHER user in the participant list/map
                                        // We stored { uid: "Romeo", uid2: "Juliet" } in chat metadata
                                        // But simplified, we can just save "participantNames" map in the chat doc
                                        const otherName = chat.participantNames?.[Object.keys(chat.participantNames).find(uid => uid !== user?.uid) || ''] || "Secret Admirer";

                                        return (
                                            <div
                                                key={chat.id}
                                                onClick={() => {
                                                    // Construct a fake "user" object to trigger the chat view
                                                    const otherUid = chat.participants.find((uid: string) => uid !== user?.uid);
                                                    setSelectedUser({ id: otherUid, romanticUsername: otherName });
                                                }}
                                                className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${chatId === chat.id ? 'bg-love-100 border-love-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-love-100 flex items-center justify-center text-lg">
                                                    💌
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">{otherName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage || "Start chatting..."}</p>
                                                </div>
                                                {chat.lastMessageTimestamp && (
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                        {chat.lastMessageTimestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="md:col-span-2 bg-white rounded-3xl shadow-lg border border-love-100 flex flex-col overflow-hidden">
                    {selectedUser ? (
                        <>
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white z-10">
                                <div className="w-10 h-10 rounded-full bg-love-100 flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-love-500 fill-love-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{selectedUser.romanticUsername}</h3>
                                    <p className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((msg) => {
                                    const isMe = msg.senderId === user.uid;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] p-3 rounded-2xl ${isMe
                                                ? 'bg-love-500 text-white rounded-tr-sm'
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                                                }`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-[10px] mt-1 ${isMe ? 'text-love-100' : 'text-gray-400'}`}>
                                                    {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a sweet message..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-love-500 outline-none bg-gray-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-love-500 text-white rounded-xl hover:bg-love-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600">No Chat Selected</h3>
                            <p>Search for a username regarding sidebar to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
