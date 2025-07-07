import { DarkBgHeader } from '../common/Logo';

export interface MainHeaderProps {

}

export function MainHeader(_props: MainHeaderProps) {

  return (
    <header className="bg-text-primary relative">
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary via-accent to-error"></div>
        
        <div className="hidden md:block">
            <div className="max-w-full mx-auto px-3 py-5">
                <div className="flex justify-between items-center gap-12">
                    <DarkBgHeader />
                    
                    <nav className="flex">
                        <button className="minimal-tab-active">Dashboard</button>
                        <button className="minimal-tab-inactive">Manuals</button>
                        <button className="minimal-tab-inactive">Maintenance</button>
                        <button className="minimal-tab-inactive">Analytics</button>
                        <button className="minimal-tab-inactive">Settings</button>
                    </nav>
                    
                    <div className="flex items-center gap-4">
                        <input 
                            type="text" 
                            placeholder="SEARCH MANUALS..." 
                            className="w-64 px-4 py-3 bg-text-primary text-white border-4 border-white font-bold placeholder-text-secondary focus:outline-none focus:bg-background focus:text-text-primary"
                        />
                        
                        <div className="w-12 h-12 bg-primary border-4 border-white brutal-rotate-right flex items-center justify-center text-lg font-black text-white">
                            A
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="md:hidden">
            <div className="px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary border-3 border-white brutal-rotate-left brutal-shadow-secondary flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 128 128" className="text-white">
                                <polygon points="20,70 60,35 100,70" fill="currentColor"/>
                                <line x1="21" y1="70" x2="99" y2="70" stroke="currentColor" strokeWidth="1"/>
                                <rect x="20" y="70" width="80" height="36" fill="currentColor"/>
                                <rect x="76" y="40" width="18" height="26" fill="currentColor"/>
                                <rect x="60" y="74" width="36" height="28" fill="#e67e22"/>
                                <line x1="64" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="2"/>
                                <line x1="64" y1="85" x2="87" y2="85" stroke="currentColor" strokeWidth="2"/>
                                <line x1="64" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2"/>
                                <line x1="64" y1="95" x2="82" y2="95" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                            HomeKeeper
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary border-3 border-white brutal-rotate-right flex items-center justify-center text-sm font-black text-white">
                            A
                        </div>
                        
                        <button 
                            id="mobileMenuToggle"
                            className="w-12 h-12 bg-secondary border-3 border-white flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300"
                        >
                            <div className="hamburger-line"></div>
                            <div className="hamburger-line"></div>
                            <div className="hamburger-line"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>

  );
}