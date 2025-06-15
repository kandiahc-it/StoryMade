import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletContextProvider } from './contexts/WalletContext';
import { StoryProvider } from './contexts/StoryContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { StoryView } from './pages/StoryView';
import { CreateStory } from './pages/CreateStory';

function App() {
  return (
    <WalletContextProvider>
      <StoryProvider>
        <Router>
          <div className="min-h-screen bg-gray-900">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/story/:id" element={<StoryView />} />
                <Route path="/create" element={<CreateStory />} />
              </Routes>
            </main>
          </div>
        </Router>
      </StoryProvider>
    </WalletContextProvider>
  );
}

export default App;
