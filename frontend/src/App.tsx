import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import TasksPage from './pages/TasksPage';
import ListsPage from './pages/ListsPage';
import DashboardPage from './pages/DashboardPage'
import AuthForm from './pages/AuthForm';
import { useStore } from './stores/useStore'
import { Spinner } from './components/Spinner';

function App() {
  const [page, setPage] = useState('Tasks');
  const {user, isLoading, checkAuth, logout} = useStore();

  const handleChangePage = (page: string) => {
    setPage(page);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const renderActivePage = () => {
    switch (page) {
      case 'Tasks':
          return <TasksPage/>;
      case 'Lists':
          return <ListsPage/>;
      case 'Dashboard':
          return <DashboardPage />;
      //case 'Analytics':
          //return <PlaceholderPage title="Analytics" />;
      default:
          return <TasksPage/>;
    }
  };

  if(isLoading) {
    <Spinner h={8} bg={"text-white"} color={"fill-purple-500"}/> 
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {!user ? (
        <AuthForm /*onAuth={handleAuth}*/ />
      ) : (
        <div className="bg-slate-100 h-full">
          <Navbar onLogout={logout} onChangePage={handleChangePage} />
          <main className="pt-2 pb-16 md:pb-0 md:pt-20">
            <div className=''>
              {renderActivePage()}
            </div>
          </main>
        </div>
      )}
    </>
  )
}

export default App;
