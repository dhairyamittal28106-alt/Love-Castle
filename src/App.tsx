import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './Layout';
import { LandingPage } from './pages/LandingPage';
import { SecretLetter } from './pages/SecretLetter';
import { Dashboard } from './pages/Dashboard';
import { Games } from './pages/Games';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';

import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="letter" element={<SecretLetter />} />
              <Route path="games" element={<Games />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="chat" element={<Chat />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
