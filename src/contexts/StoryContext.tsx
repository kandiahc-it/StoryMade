import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Story, CreateStoryRequest, UserProfile, CollaborationRequest } from '../types/story';
import { v4 as uuidv4 } from 'uuid';

interface StoryContextType {
  stories: Story[];
  userProfiles: Map<string, UserProfile>;
  createStory: (request: CreateStoryRequest) => Promise<string>;
  forkStory: (parentId: string, request: CreateStoryRequest) => Promise<string>;
  upvoteStory: (storyId: string) => Promise<void>;
  getStory: (id: string) => Story | undefined;
  getStoryTree: (id: string) => Story[];
  mintStoryNFT: (storyId: string) => Promise<string>;
  requestCollaboration: (storyId: string) => Promise<void>;
  acceptCollaboration: (storyId: string, requesterAddress: string) => Promise<void>;
  getUserProfile: (publicKey: string) => UserProfile;
  getVotingPower: (publicKey: string) => number;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

// Mock data for development
const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Digital Frontier',
    content: 'In a world where blockchain technology has revolutionized storytelling, writers from across the globe collaborate to create epic tales...',
    ipfsHash: 'QmExample1',
    author: '7xKXtg2CW87d97TXJSDpbD5jBSK6KMkB2wHZrTNuSQiS',
    timestamp: Date.now() - 86400000,
    votes: 42,
    genre: 'Sci-Fi',
    xpEarned: 150,
    isNftMinted: true,
    nftMintAddress: 'NFT1234567890',
  },
  {
    id: '2',
    title: 'The Last Library',
    content: 'When all books became digital and stored on the blockchain, one librarian discovered a hidden physical library...',
    ipfsHash: 'QmExample2',
    author: '9yHpvwDa3XE8kL2mN4oP6qR7sT8uV9wX0yZ1aB2cD3eF',
    timestamp: Date.now() - 172800000,
    votes: 28,
    genre: 'Fantasy',
    xpEarned: 120,
  },
  {
    id: '3',
    title: 'The Digital Frontier - Chapter 2',
    content: 'The protagonist discovers that the blockchain stories are actually alive, each one containing the consciousness of its authors...',
    ipfsHash: 'QmExample3',
    author: '5aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4aB5c',
    parentId: '1',
    timestamp: Date.now() - 43200000,
    votes: 18,
    genre: 'Sci-Fi',
    xpEarned: 80,
  },
];

const mockUserProfiles = new Map<string, UserProfile>([
  ['7xKXtg2CW87d97TXJSDpbD5jBSK6KMkB2wHZrTNuSQiS', {
    publicKey: '7xKXtg2CW87d97TXJSDpbD5jBSK6KMkB2wHZrTNuSQiS',
    xp: 1250,
    level: 3,
    storiesCreated: 5,
    storiesForked: 2,
    totalVotes: 89,
    nfts: [],
  }],
]);

export function StoryProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet();
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(mockUserProfiles);

  const uploadToIPFS = async (content: string): Promise<string> => {
    // Mock IPFS upload - in production, use web3.storage or Pinata
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Qm${Math.random().toString(36).substring(2, 15)}`;
  };

  const updateUserXP = (userAddress: string, xpGain: number) => {
    setUserProfiles(prev => {
      const newProfiles = new Map(prev);
      const profile = newProfiles.get(userAddress) || {
        publicKey: userAddress,
        xp: 0,
        level: 1,
        storiesCreated: 0,
        storiesForked: 0,
        totalVotes: 0,
        nfts: [],
      };
      
      const newXP = profile.xp + xpGain;
      const newLevel = Math.floor(newXP / 500) + 1; // Level up every 500 XP
      
      newProfiles.set(userAddress, {
        ...profile,
        xp: newXP,
        level: newLevel,
      });
      
      return newProfiles;
    });
  };

  const createStory = async (request: CreateStoryRequest): Promise<string> => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    const ipfsHash = await uploadToIPFS(request.content);
    const newStory: Story = {
      id: uuidv4(),
      parentId: request.parentId,
      title: request.title,
      content: request.content,
      ipfsHash,
      author: publicKey.toString(),
      timestamp: Date.now(),
      votes: 0,
      genre: request.genre,
      xpEarned: 50, // Base XP for creating a story
    };

    setStories(prev => [...prev, newStory]);
    updateUserXP(publicKey.toString(), 50);
    
    return newStory.id;
  };

  const forkStory = async (parentId: string, request: CreateStoryRequest): Promise<string> => {
    const storyId = await createStory({ ...request, parentId });
    
    // Give XP to parent story author
    const parentStory = stories.find(s => s.id === parentId);
    if (parentStory) {
      updateUserXP(parentStory.author, 25);
    }
    
    return storyId;
  };

  const upvoteStory = async (storyId: string): Promise<void> => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    const votingPower = getVotingPower(publicKey.toString());
    
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, votes: story.votes + votingPower }
        : story
    ));
    
    // Give XP to story author
    const story = stories.find(s => s.id === storyId);
    if (story) {
      updateUserXP(story.author, 10 * votingPower);
    }
  };

  const getStory = (id: string): Story | undefined => {
    return stories.find(story => story.id === id);
  };

  const getStoryTree = (id: string): Story[] => {
    const story = getStory(id);
    if (!story) return [];
    
    const children = stories.filter(s => s.parentId === id);
    return [story, ...children];
  };

  const mintStoryNFT = async (storyId: string): Promise<string> => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    // Mock NFT minting - in production, use Metaplex
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mintAddress = `NFT${Math.random().toString(36).substring(2, 15)}`;
    
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isNftMinted: true, nftMintAddress: mintAddress }
        : story
    ));
    
    return mintAddress;
  };

  const requestCollaboration = async (storyId: string): Promise<void> => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    const request: CollaborationRequest = {
      requester: publicKey.toString(),
      timestamp: Date.now(),
      status: 'pending',
    };
    
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            collaborationRequests: [...(story.collaborationRequests || []), request]
          }
        : story
    ));
  };

  const acceptCollaboration = async (storyId: string, requesterAddress: string): Promise<void> => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story,
            coAuthors: [...(story.coAuthors || []), requesterAddress],
            collaborationRequests: story.collaborationRequests?.map(req => 
              req.requester === requesterAddress 
                ? { ...req, status: 'accepted' as const }
                : req
            )
          }
        : story
    ));
  };

  const getUserProfile = (publicKey: string): UserProfile => {
    return userProfiles.get(publicKey) || {
      publicKey,
      xp: 0,
      level: 1,
      storiesCreated: 0,
      storiesForked: 0,
      totalVotes: 0,
      nfts: [],
    };
  };

  const getVotingPower = (publicKey: string): number => {
    const profile = getUserProfile(publicKey);
    return Math.min(3, Math.floor(profile.level / 2) + 1); // 1x to 3x voting power
  };

  return (
    <StoryContext.Provider value={{
      stories,
      userProfiles,
      createStory,
      forkStory,
      upvoteStory,
      getStory,
      getStoryTree,
      mintStoryNFT,
      requestCollaboration,
      acceptCollaboration,
      getUserProfile,
      getVotingPower,
    }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}
