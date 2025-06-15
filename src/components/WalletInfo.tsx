import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useStory } from '../contexts/StoryContext';
import { Wallet, Star, Zap } from 'lucide-react';

export function WalletInfo() {
  const { publicKey, wallet } = useWallet();
  const { getUserProfile, getVotingPower } = useStory();

  if (!publicKey || !wallet) return null;

  const profile = getUserProfile(publicKey.toString());
  const votingPower = getVotingPower(publicKey.toString());

  const getWalletIcon = () => {
    const walletName = wallet.adapter.name.toLowerCase();
    if (walletName.includes('phantom')) {
      return '👻';
    } else if (walletName.includes('brave')) {
      return '🦁';
    }
    return '💼';
  };

  return (
    <div className="flex items-center space-x-3 bg-gray-700 rounded-lg px-3 py-2">
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getWalletIcon()}</span>
        <div className="flex items-center space-x-1 text-xs text-gray-300">
          <Wallet className="h-3 w-3" />
          <span>{wallet.adapter.name}</span>
        </div>
      </div>
      
      <div className="h-4 w-px bg-gray-600"></div>
      
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-white font-medium">Lv.{profile.level}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-white">{votingPower}x</span>
        </div>
        
        <div className="text-gray-300">
          {profile.xp} XP
        </div>
      </div>
    </div>
  );
}
