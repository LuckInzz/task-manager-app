import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Navbar';
import TasksPage from './pages/TasksPage';
import AuthForm from './pages/AuthForm';
import type { UserResponse } from './types/Auth';
import { getMe } from './services/AuthService';
import api from './services/api';

function App() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [hasToken, setHasToken] = useState(false)

  const handleAuth = (token: string) => {
    localStorage.setItem('authToken', token);
    setHasToken(true)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
      localStorage.removeItem('authToken');
      setUser(null);
      setHasToken(false)
  }

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Se houver um token, tentamos buscar os dados do utilizador
          const userData = await getMe();
          console.log(userData);
          setUser(userData); // Se for bem-sucedido, o utilizador está logado
          setHasToken(true)
        } catch (error) {
          // Se o token for inválido, limpa-o
          localStorage.removeItem('authToken');
          console.error("Token inválido ou expirado.", error);
          setHasToken(false)
        }
      }
    };
    validateToken();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {!hasToken ? (
        <AuthForm onAuth={handleAuth} />
      ) : (
        <div className="flex h-screen bg-white p-8">
          <Sidebar onLogout={handleLogout} user={user} />
          <main className="flex-1 overflow-y-auto">
            <TasksPage />
          </main>
        </div>
      )}
    </>
  )
}

export default App;
