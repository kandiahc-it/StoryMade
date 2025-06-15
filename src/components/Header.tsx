import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { BookOpen, PenTool, Compass, Vault, User } from 'lucide-react';
import { WalletInfo } from './WalletInfo';

export function Header() {
  const location = useLocation();
  const { connected } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
              <BookOpen className="h-8 w-8" />
              <span className="text-xl font-bold">ChainStory</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 transition-colors ${
                  isActive('/') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Explore</span>
              </Link>
              
              <Link 
                to="/create" 
                className={`flex items-center space-x-1 transition-colors ${
                  isActive('/create') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                <PenTool className="h-4 w-4" />
                <span>Create</span>
              </Link>
              
              {connected && (
                <>
                  <Link 
                    to="/vault" 
                    className={`flex items-center space-x-1 transition-colors ${
                      isActive('/vault') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Vault className="h-4 w-4" />
                    <span>My Vault</span>
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-1 transition-colors ${
                      isActive('/profile') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {connected && <WalletInfo />}
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg" />
          </div>
        </div>
      </div>
    </header>
  );
}
