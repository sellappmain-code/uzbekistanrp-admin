export interface Stats {
  onlinePlayers: number;
  registeredUsers: number;
  activeFactions: number;
  businesses: number;
  eventsThisMonth: number;
  totalRevenue: string;
  servers: number;
}

export interface ComplaintMessage {
  id: string;
  author: string;
  authorRole: "author" | "admin" | "ai";
  content: string;
  date: string;
}

export interface Complaint {
  id: number;
  type: string;
  author: string;
  target: string;
  server: string;
  category: string;
  description: string;
  evidence: string[];
  date: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  messages: ComplaintMessage[];
  aiReply?: string;
}

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  excerpt: string;
  content: string[];
  tags: string[];
  readingMinutes: number;
  views: number;
  comments: number;
  reactions: number;
  featured: boolean;
  status: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  avatarColor: string;
  role: string;
  level: number;
  xp: number;
  verified: boolean;
  joinedAt: string;
}

export interface GameEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  reward: string;
  organizer: string;
  participants: number;
  maxParticipants: number;
  status: string;
  description: string;
  winner?: string;
}

export interface WikiArticle {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  updatedAt: string;
  views: number;
}

export interface AiResult {
  success: boolean;
  message: string;
  preview?: string;
  data?: Record<string, unknown>;
}

export const COMPLAINT_STATUSES = ["Pending", "Under Review", "Approved", "Rejected", "Closed"];
export const NEWS_CATEGORIES = ["Server News", "Updates", "Events", "Announcements", "Community"];