import Sidebar from './components/Sidebar';
import TasksPage from './components/TasksPage';

function App() {

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <TasksPage />
      </main>
    </div>
  )
}

export default App
