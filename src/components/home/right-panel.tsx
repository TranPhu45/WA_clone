"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X, Phone } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";
import { useConvexAuth } from "convex/react";
import ElevenLabsConversation from "./elevenlabs-conversation";
import { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { useConversation } from "@11labs/react";
import CallWindow from "./call-window";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { User } from "../../../convex/types";

const RightPanel = () => {
    const { selectedConversation, setSelectedConversation, conversations } = useConversationStore();
    const { isLoading, isAuthenticated } = useConvexAuth();
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);

    const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? undefined : "skip");
    const aiAgent = useQuery(api.users.getUserByEmail, { email: "aiagenttest@gmail.com" });

    const conversation = useConversation({
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log("Disconnected"),
        onMessage: (message) => console.log("Message:", message),
        onError: (error) => console.error("Error:", error),
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            Modal.setAppElement(document.getElementById("__next") || "body");
        }

        if (aiAgent && conversations) {
            const aiAgentConversation = {
                _id: aiAgent._id as any, // Map AI Agent user ID to conversation ID (or adjust schema)
                participants: [],
                isGroup: false,
                isAIAgent: true,
                name: aiAgent.name,
                email: aiAgent.email,
                image: aiAgent.image,
                isOnline: aiAgent.isOnline,
            };

            const updatedConversations = [
                aiAgentConversation,
                ...conversations.filter(convo => !convo.isAIAgent)
            ];
            useConversationStore.setState({ conversations: updatedConversations });
        }
    }, [aiAgent, conversations]);

    const canCallAI = useCallback((user: User | null | undefined) => {
        return user && user.email !== "aiagenttest@gmail.com" && selectedConversation?.name === "AI Agent";
    }, [selectedConversation]);

    const startConversation = useCallback(async () => {
        if (!currentUser || !canCallAI(currentUser)) {
            alert("Bạn chỉ có thể gọi với AI Agent.");
            return;
        }

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            await conversation.startSession({
                agentId: "P3y7LUMNmwBqvLW0p4SD",
            });
            setIsCallModalOpen(true);
        } catch (error) {
            console.error("Failed to start conversation:", error);
        }
    }, [conversation, currentUser, canCallAI]);

    const endConversation = useCallback(async () => {
        try {
            await conversation.endSession();
        } catch (error) {
            console.error("Failed to end conversation:", error);
        } finally {
            setIsCallModalOpen(false);
        }
    }, [conversation]);

    if (isLoading) return null;

    if (!isAuthenticated || !currentUser) {
        console.warn("Not authenticated or currentUser is null.");
        return <div>Vui lòng đăng nhập để truy cập tính năng này.</div>;
    }

    if (!selectedConversation) return <ChatPlaceHolder />;

    const conversationName = selectedConversation.groupName || selectedConversation.name;
    const conversationImage = selectedConversation.groupImage || selectedConversation.image;

    return (
        <div className="w-3/4 flex flex-col">
            <div className="w-full sticky top-0 z-50">
                {/* Header */}
                <div className="flex justify-between bg-gray-primary p-3">
                    <div className="flex gap-3 items-center">
                        <Avatar>
                            <AvatarImage src={conversationImage || "/placeholder.png"} className="object-cover" />
                            <AvatarFallback>
                                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p>{conversationName}</p>
                            {selectedConversation.isGroup && (
                                <GroupMembersDialog selectedConversation={selectedConversation} />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-7 mr-5">
                        <a href="/video-call" target="_blank">
                            <Video size={23} />
                        </a>
                        <button onClick={startConversation}>
                            <Phone size={25} />
                        </button>
                        <X size={16} className="cursor-pointer" onClick={() => setSelectedConversation(null)} />
                    </div>
                </div>
            </div>

            {/* ElevenLabs Conversation */}
            <Modal
                isOpen={isCallModalOpen}
                onRequestClose={endConversation}
                contentLabel="Cuộc gọi"
                className="modal"
                overlayClassName="overlay"
            >
                <ElevenLabsConversation />
            </Modal>

            {/* Call Window */}
            {isCallModalOpen && <CallWindow onEndCall={endConversation} />}

            {/* Chat Messages */}
            <MessageContainer />

            {/* Input */}
            <MessageInput />
        </div>
    );
};

export default RightPanel;
