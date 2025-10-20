import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Demo Liveblocks configuration for stakeholder presentation
// Note: This uses a public key for demo purposes only
// In production, you would use proper authentication and room security
const client = createClient({
  publicApiKey: "pk_dev_demo_key", // Demo key - not functional without actual Liveblocks account
  throttle: 16, // Throttle updates for smooth real-time experience
});

// Define the room state type for type safety
type Presence = {
  cursor: { x: number; y: number } | null;
  user?: {
    name: string;
    avatar?: string;
    role: "provider" | "admin" | "consumer";
  };
  viewing?: {
    page: string;
    section?: string;
  };
};

type Storage = {
  // Real-time collaborative features for the demo
  annotations: Record<string, {
    id: string;
    x: number;
    y: number;
    content: string;
    author: string;
    timestamp: number;
    resolved: boolean;
  }>;
  sharedNotes: Record<string, {
    id: string;
    content: string;
    lastModified: number;
    author: string;
  }>;
};

type UserMeta = {
  id: string;
  info: {
    name: string;
    email: string;
    role: "provider" | "admin" | "consumer";
    avatar?: string;
  };
};

// Create the room context with proper typing
export const {
  suspense: {
    RoomProvider,
    useMyPresence,
    useOthers,
    useStorage,
    useMutation,
    useRoom,
  },
} = createRoomContext<Presence, Storage, UserMeta>(client);

// Demo users for stakeholder presentation
export const DEMO_USERS = {
  sandy: {
    id: "sandy-mitchell",
    info: {
      name: "Sandy Mitchell",
      email: "sandy@sandymitchell.co.za",
      role: "provider" as const,
      avatar: "/images/sandy/Sandy_August_shoot_omni-2.png"
    }
  },
  helen: {
    id: "helen-admin",
    info: {
      name: "Helen Thompson",
      email: "helen@omniwellness.co.za", 
      role: "admin" as const,
      avatar: "/images/logos/omni logo.png"
    }
  },
  demo_consumer: {
    id: "demo-consumer",
    info: {
      name: "Emma Thompson",
      email: "emma.t@email.com",
      role: "consumer" as const,
    }
  }
};

// Utility functions for the demo
export const getRandomDemoUser = () => {
  const users = Object.values(DEMO_USERS);
  return users[Math.floor(Math.random() * users.length)];
};

export const createDemoRoom = (roomId: string) => {
  return {
    roomId,
    initialPresence: {
      cursor: null,
      user: DEMO_USERS.sandy.info,
      viewing: { page: "dashboard" }
    },
    initialStorage: {
      annotations: {},
      sharedNotes: {
        "demo-note-1": {
          id: "demo-note-1",
          content: "Great stakeholder feedback session! Sandy's provider dashboard is looking excellent.",
          lastModified: Date.now(),
          author: "Helen Thompson"
        }
      }
    }
  };
};

// Real-time presence indicators for different sections
export const PRESENCE_SECTIONS = {
  PROVIDER_DASHBOARD: "provider-dashboard",
  ADMIN_DASHBOARD: "admin-dashboard", 
  WELLNESS_MARKETPLACE: "wellness-marketplace",
  BOOKING_SYSTEM: "booking-system",
  WELLCOIN_EXCHANGE: "wellcoin-exchange",
  COMMUNITY: "community"
} as const;

// Demo collaboration features that would be showcased
export const DEMO_FEATURES = [
  {
    name: "Real-time Presence",
    description: "See who's viewing the same dashboard sections",
    icon: "👥"
  },
  {
    name: "Collaborative Annotations", 
    description: "Add notes and feedback directly on dashboard elements",
    icon: "📝"
  },
  {
    name: "Live Cursor Tracking",
    description: "Track stakeholder cursors during demo sessions",
    icon: "👆"
  },
  {
    name: "Shared Notes",
    description: "Real-time shared notes during stakeholder reviews",
    icon: "🗒️"
  },
  {
    name: "Session Recording",
    description: "Record stakeholder interactions for later review",
    icon: "🎥"
  }
];