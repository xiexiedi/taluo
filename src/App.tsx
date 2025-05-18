import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { DrawCards } from './pages/DrawCards';
import { Journal } from './pages/Journal';
import { Profile } from './pages/Profile';
import { ReadingDetail } from './pages/ReadingDetail';

function AppContent() {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/draw" element={<DrawCards />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reading/:id" element={<ReadingDetail />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;