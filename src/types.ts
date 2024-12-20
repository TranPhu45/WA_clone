export interface User {
    _id: string;
    _creationTime: number;
    email?: string;
    name: string;
    image: string;
    tokenIdentifier: string;
    isOnline: boolean;
    isAIAgent?: boolean;
} 