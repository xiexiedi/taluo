import React from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { DrawCards } from './pages/DrawCards';
import { Journal } from './pages/Journal';
import { Profile } from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  // Render the current page based on navigation
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'favorites':
        return <Favorites />;
      case 'draw':
        return <DrawCards />;
      case 'journal':
        return <Journal />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;