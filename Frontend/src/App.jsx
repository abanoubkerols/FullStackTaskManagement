import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route
            path="/login"
            element={
        
                <h1>login</h1>
            
            }
          />
          <Route
            path="/register"
            element={
              <h1>register</h1>
            }
          />
          <Route
            path="/"
            element={
              
                <h1>Dashboard</h1>
     
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
