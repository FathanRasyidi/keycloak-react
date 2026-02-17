import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
import PrivateRoute from './auth/PrivateRoute.tsx';
import Sidebar from './components/layout/Sidebar.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="flex w-full min-h-screen bg-[#f8f9fa] text-gray-800 font-sans antialiased">
        <Sidebar />
        <main className="flex-1 flex flex-col p-6 pt-10 pb-0 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
