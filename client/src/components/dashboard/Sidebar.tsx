import React from 'react';
import { Link } from 'wouter';
import {
    DashboardIcon,
    CreateIcon,
    CalendarIcon,
    MindIcon,
    SettingsIcon
} from './IconComponents';
import markPng from '../../assets/mark.png'; // Added import for mark.png

interface SidebarProps {
    currentRoute?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute = 'create' }) => {
    const sidebarBg = 'bg-[#0E2D60]'; // Custom color matching Figma

    return (
        <aside className={`w-[90px] ${sidebarBg} text-white flex flex-col items-center py-5 space-y-7 fixed left-0 top-0 bottom-0 h-screen z-10`}>
            {/* Logo placeholder - Replace with actual logo if available */}
            <img 
                src={markPng} 
                alt="Mark AI Logo"
                className="w-20 h-20 rounded-full flex-shrink-0 object-cover"
            />

            {/* Navigation Icons */}
            <nav className="flex flex-col items-center space-y-7 flex-grow w-full">
                {/* Dashboard Item */}
                <Link href="/dashboard">
                    <div className={`flex flex-col items-center text-center group ${currentRoute === 'dashboard' ? 'text-white' : 'text-gray-300 hover:text-white'} w-full py-1 relative cursor-pointer`}>

                        <div className={`p-3 mb-1 rounded-lg ${currentRoute === 'dashboard' ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
                            <DashboardIcon className={currentRoute === 'dashboard' ? 'text-white' : ''} />
                        </div>
                        <span className="text-xs font-medium">Dashboard</span>
                    </div>
                </Link>

                {/* Create Item */}
                <Link href="/create">
                    <div className={`flex flex-col items-center text-center group ${currentRoute === 'create' ? 'text-white' : 'text-gray-300 hover:text-white'} w-full py-1 relative cursor-pointer`}>

                        <div className={`p-3 mb-1 rounded-lg ${currentRoute === 'create' ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
                            <CreateIcon className={currentRoute === 'create' ? 'text-white' : ''} />
                        </div>
                        <span className="text-xs font-medium">Create</span>
                    </div>
                </Link>
                
                {/* Calendar Item */}
                <Link href="/calendar">
                    <div className={`flex flex-col items-center text-center group ${currentRoute === 'calendar' ? 'text-white' : 'text-gray-300 hover:text-white'} w-full py-1 relative cursor-pointer`}>

                        <div className={`p-3 mb-1 rounded-lg ${currentRoute === 'calendar' ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
                            <CalendarIcon className={currentRoute === 'calendar' ? 'text-white' : ''} />
                        </div>
                        <span className="text-xs font-medium">Calendar</span>
                    </div>
                </Link>
                
                {/* Mind Item */}
                <Link href="/mind">
                    <div className={`flex flex-col items-center text-center group ${currentRoute === 'mind' ? 'text-white' : 'text-gray-300 hover:text-white'} w-full py-1 relative cursor-pointer`}>

                        <div className={`p-3 mb-1 rounded-lg ${currentRoute === 'mind' ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
                            <MindIcon className={currentRoute === 'mind' ? 'text-white' : ''} />
                        </div>
                        <span className="text-xs font-medium">Mind</span>
                    </div>
                </Link>
            </nav>

            {/* Settings Icon at bottom */}
            <Link href="#">
                <div className="mt-auto group text-gray-300 hover:text-white flex-shrink-0 pb-4 cursor-pointer">
                    <div className="p-3 rounded-lg group-hover:bg-white/5">
                        <SettingsIcon />
                    </div>
                </div>
            </Link>
        </aside>
    );
};

export default Sidebar;