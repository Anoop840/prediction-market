import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Markets from './pages/Markets';
import CreateMarket from './pages/CreateMarket';
import MarketDetail from './pages/MarketDetail';
import Profile from './pages/Profile';
import { WalletProvider } from './contexts/WalletContext';
import { ToastProvider } from './contexts/ToastContext';
import { MarketProvider } from './contexts/MarketContext';

function App() {
  return (
    <ToastProvider>{/* NEW: ToastProvider is now the outer layer */}
      <WalletProvider>
        <MarketProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/create" element={<CreateMarket />} />
                  <Route path="/market/:id" element={<MarketDetail />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </Router>
        </MarketProvider>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;