import React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  onNavigate 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950">
      <Header />
      <main className="flex-1 overflow-auto pb-20 px-4 w-full">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
      <BottomNavigation currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};