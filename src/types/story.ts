export interface Story {
  id: string;
  parentId?: string;
  title: string;
  content: string;
  ipfsHash: string;
  author: string;
  coAuthors?: string[];
  timestamp: number;
  votes: number;
  genre: string;
  isNftMinted?: boolean;
  nftMintAddress?: string;
  xpEarned?: number;
  collaborationRequests?: CollaborationRequest[];
}

export interface CollaborationRequest {
  requester: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CreateStoryRequest {
  title: string;
  content: string;
  genre: string;
  parentId?: string;
}

export interface StoryFilter {
  sortBy: 'recent' | 'votes' | 'trending';
  genre?: string;
}

export interface UserProfile {
  publicKey: string;
  xp: number;
  level: number;
  storiesCreated: number;
  storiesForked: number;
  totalVotes: number;
  nfts: StoryNFT[];
}

export interface StoryNFT {
  mintAddress: string;
  storyId: string;
  title: string;
  image: string;
  metadata: any;
}

export interface StoryNode {
  id: string;
  data: {
    story: Story;
    isHighlighted: boolean;
  };
  position: { x: number; y: number };
  type: 'storyNode';
}

export interface StoryEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  animated: boolean;
}
