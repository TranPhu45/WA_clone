import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";
import { MessageType } from "../../convex/types";

export type Conversation = {
	_id: Id<"conversations">;
	image?: string;
	participants: Id<"users">[];
	isGroup: boolean;
	isAIAgent?: boolean;
	name?: string;
	groupImage?: string;
	groupName?: string;
	admin?: Id<"users">;
	isOnline?: boolean;
	lastMessage?: {
		_id: Id<"messages">;
		conversation: Id<"conversations">;
		content: string;
		sender: Id<"users">;
	};
};

type ConversationStore = {
	selectedConversation: Conversation | null;
	conversations: Conversation[];
	setSelectedConversation: (conversation: Conversation | null) => void;
	pinAIContact: () => void;
};

export const useConversationStore = create<ConversationStore>((set, get) => ({
	selectedConversation: null,
	conversations: [],
	setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
	pinAIContact: () => {
		const aiContact = get().conversations.find(convo => convo.isAIAgent);
		if (aiContact) {
			set({ selectedConversation: aiContact });
		}
	},
}));

export interface IMessage {
	_id: string;
	_creationTime: number;
	content: string;
	sender: any;
	conversation: string;
	messageType: MessageType;
	fileName?: string;
}
