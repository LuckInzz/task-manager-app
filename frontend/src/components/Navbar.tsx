import React, { useState, useEffect, type JSX } from "react";
import { getMe } from '../services/AuthService';
import type { UserResponse } from "../types/Auth";

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ListsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>;
const NotificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6"/></svg>;

const NavItem: React.FC<NavItemProps> = ({ name, href, icon, isActive, onClick }) => {
    return (
        <a 
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer
                ${isActive 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`
            }
        >
            {icon}
            <span className="hidden md:inline">{name}</span>
        </a>
    );
};

const navItemsData = [
    { name: 'Tasks', href: '#', icon: <TasksIcon />, isActive: true },
    { name: 'Lists', href: '#', icon: <ListsIcon />, isActive: false },
    { name: 'Dashboard', href: '#', icon: <DashboardIcon />, isActive: false },
    //{ name: 'Analytics', href: '#', icon: <AnalyticsIcon />, isActive: false },
];

interface NavItemProps {
    name: string;
    href: string;
    icon: JSX.Element;
    isActive: boolean;
    onClick: () => void;
}

interface NavbarProps {
    onLogout: () => void;
    onChangePage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ( { onLogout, onChangePage } ) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [activeItem, setActiveItem] = useState('Tasks');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserData();
    }, [])

    return (
        <header className="fixed items-center bottom-0 left-0 right-0 h-16 md:h-20 md:top-0 md:bottom-auto
        bg-white text-slate-500 z-50 rounded-b-2xl shadow-lg px-4 md:px-8">

            <div className="flex justify-between items-center h-full">
                <div>
                    <h1 className="text-[20px] md:text-[24px] font-bold">TaskManager</h1>
                </div>

                <nav className="flex items-center gap-2">
                    {navItemsData.map((item) => (
                        <NavItem 
                            key={item.name}
                            name={item.name}
                            href={item.href}
                            icon={item.icon}
                            isActive={activeItem === item.name}
                            onClick={() => {    
                                setActiveItem(item.name); 
                                onChangePage(item.name);
                            }}
                        />
                    ))}
                </nav>
            

                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex rounded-lg items-center cursor-pointer">
                    <img 
                            src={`https://placehold.co/32x32/E2E8F0/475569?text=${user ? user.username.charAt(0).toUpperCase() : '?'}`}
                            alt="Avatar do utilizador" 
                            className="w-8 h-8 rounded-full"
                        />
                </button>

                {isProfileOpen && user && (
                    <div className="absolute top-[-130px] md:top-22 right-4 w-60 p-2 space-y-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 animate-fade-in-down">
                        <div className="px-2">
                            <p className="text-black">{user.username}</p>
                            <p className="text-sm">{user.email}</p>
                        </div>

        
                        <button onClick={onLogout} className="flex items-center text-sm rounded-lg hover:bg-slate-100 p-2 cursor-pointer gap-2 w-full">
                            <LogoutIcon />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar;