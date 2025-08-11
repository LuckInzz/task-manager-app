import React from "react";

const navItems = [
    { name : 'My Tasks', href: "#", active: true, btn:true },
    { name : 'Groups', href: "#", active: true, btn: true },
    { name : 'Dashboard', href: "#", active: false }
];

const Sidebar: React.FC = () => {
    return (
        <aside className="flex flex-col w-20 sm:w-50 md:w-70 bg-slate-900 text-slate-400 p-1 sm:p-2 shadow-[10px_0px_15px_-7px_rgba(0,0,0,0.4)]">
            <div className="flex-row sm:flex items-center mb-10 mt-5" >
                <div className="w-5 sm:w-8 md:w-12 ml-6 mb-2 sm:ml-4 sm:mb-0 flex-shrink-0">
                    <img src="src/assets/logo-no-bg.png" />
                </div>
                <h1 className="text-[10px] sm:text-[15px] md:text-[25px] font-bold ml-1 sm:ml-3 text-white">TaskManager</h1>
            </div>

            <nav className="flex-grow text-[8px] sm:text-[12px] md:text-[16px]">
                <ul className="space-y-5">
                    {navItems.map((item) => (
                        <li key={item.name} className="flex justify-between"> {/* React exige uma 'key' única para cada item de uma lista */}
                            <a href={item.href}
                                className={`flex-grow py-2 px-1 sm:px-2 md:px-4 rounded-lg transition-colors
                                ${item.active 
                                ? 'hover:text-white hover:bg-slate-800' // Estilo se estiver ativo
                                : 'text-slate-600 cursor-not-allowed' // Estilo se não estiver ativo
                                }`}>{item.name}
                            </a>
                            {item.btn ? 
                            <button //onClick={handleTaskModel}
                            className="py-0.5 px-1 sm:px-2 md:px-4 rounded-lg hover:bg-slate-800 hover:text-white 
                            cursor-pointer text-[8px] sm:text-[12px] md:text-[16px]">+</button> : ''}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto text-[8px] sm:text-[12px] md:text-[16px]">
                <div className="flex items-center p-2 bg-slate-800 rounded-lg">
                    <img src="profile-picture" className="h-3 w-3 sm:h-6 sm:w-6 rounded-full cursor-pointer"/>
                    <p className="ml-2">Username</p>
                </div>
            </div>

        </aside>
    )
}

export default Sidebar;