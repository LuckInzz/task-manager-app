import React, { use, useState } from "react";
import type { UserResponse } from "../types/Auth.tsx";
import { login, register, getMe } from "../services/AuthService.ts"
import { Spinner } from "../components/Spinner.tsx";
import toast from 'react-hot-toast'; // <-- Importe o toast
import axios from "axios";
//import { Mail, Lock, User, ArrowRight } from "lucide-react";

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);


const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

interface AuthFormProps {
  /*onRegister: (user: UserResponse) => void;*/
  onAuth: (token:string) => void;
}

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

interface LoginFormProps {
  onLogin: (user: UserResponse, token: string) => void;
}

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, placeholder, icon, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        name={id}
        className="block w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm 
        text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

// --- Componente do Formulário de Login ---

const LoginForm = ( { onAuth }:AuthFormProps ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError({});
    try {
      const { token } = await login({ email, password });
      localStorage.setItem('authToken', token);
      onAuth(token);
      toast.success('Successfully logged in');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const data = err.response.data;
        if(status === 400) {
          toast.error('Invalid email or password');
          setError(data)
        }
      }
      else {
        toast.error('An unexpected error occurred. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in animation-duration: 3s space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-600">Enter your credentials to access your tasks</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            icon={<MailIcon className="h-5 w-5 text-gray-400" />} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />
          {error.email && <p className="text-xs text-red-600 mt-1">{error.email}</p>}
        </div>
        <div>  
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<LockIcon className="h-5 w-5 text-gray-400" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            />
          {error.password && <p className="text-xs text-red-600 mt-1">{error.password}</p>}
        </div>
        <div>
          {isLoading ? 
          <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r 
              from-indigo-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm 
              transition-transform hover:scale-105 hover:cursor-pointer
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              {Spinner(5, "text-white", "fill-green-500")}
              Loading...
              </button>         : 
          <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r 
              from-indigo-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm 
              transition-transform hover:scale-105 hover:cursor-pointer
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              Sign in
              <ArrowRightIcon className="h-4 w-4" />
          </button>}
        </div>
      </form>
    </div>
  );
};

// --- Componente do Formulário de Cadastro ---

const RegisterForm = ( { onRegisterSuccess }:RegisterFormProps ) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState (false);
  const [error, setError] = useState<{ [key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError({});
    try {
      await register({username, email, password });
      onRegisterSuccess();
      toast.success('Account created successfully')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if(status === 409) {
          toast.error(err.message);
          setError({ email: data.message || 'Email already in use' });
        }
        else if(status === 400) {
          toast.error('Check the registration form');
          setError(data)
        }
        else {
          toast.error('An unexpected error occurred. Please try again later.');
        }
      }
      else {
        toast.error('An unexpected error occurred. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create account</h2>
          <p className="mt-1 text-sm text-gray-600">Get started with your productivity journey</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <InputField
            id="fullName"
            label="Full Name"
            type="text"
            placeholder="Your Name"
            icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            />
          {error.username && <p className="text-xs text-red-600 mt-1">{error.username}</p>}
        </div>
        <div>
          <InputField
            id="email-register"
            label="Email"
            type="email"
            placeholder="your@email.com"
            icon={<MailIcon className="h-5 w-5 text-gray-400" />}
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />
          {error.email && <p className="text-xs text-red-600 mt-1">{error.email}</p>}
        </div>
        <div>
          <InputField
            id="password-register"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<LockIcon className="h-5 w-5 text-gray-400" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          {error.password && <p className="text-xs text-red-600 mt-1">{error.password}</p>}
        </div>
        <div>
          {isLoading ? 
          <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r 
              from-indigo-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm 
              transition-transform hover:scale-105 hover:cursor-pointer
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              {Spinner(5, "text-white", "fill-green-500")}
              Loading...
              </button>         : 
          <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r 
              from-indigo-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-sm 
              transition-transform hover:scale-105 hover:cursor-pointer
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              Create Account
              <ArrowRightIcon className="h-4 w-4" />
          </button>}
        </div>
      </form>
    </div>
  );
}

const AuthForm = ( { onAuth }:AuthFormProps ) => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    const handleRegisterSuccess = () => {
        // Após o registo, muda a vista de volta para o login.
        // Poderíamos também mostrar uma mensagem de sucesso aqui.
        setAuthMode('login');
    };

    return(
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md">
            {/* Cabeçalho */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl mb-2">Task Manager</h1>
                <div className="mx-auto h-2 w-full max-w-xs rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <p className="mt-4 text-sm text-gray-600">Organize your tasks with style</p>
            </div>

        {/* Abas de Navegação */}
        <div className="mb-6 flex items-center justify-center rounded-xl bg-gray-200 p-1">
          <button
            onClick={() => setAuthMode('login')}
            className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              authMode === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:bg-gray-300 cursor-pointer'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              authMode === 'register'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:bg-gray-300 cursor-pointer'
            }`}
          >
            Register
          </button>
        </div>

        {/* Container do Formulário */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {authMode === 'login' ? (
            <LoginForm onAuth={onAuth} />
          ) : (
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          )}
        </div>
      </div>
    </div>
    )
}

export default AuthForm;