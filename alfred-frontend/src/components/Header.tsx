import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setActiveTab } from '../store/slices/uiSlice';
import { Bell } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state: RootState) => state.ui);
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: 'command-centre' | 'reporting-compliance') => {
    dispatch(setActiveTab(tab));
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#0B1623] border-b border-gray-700 fixed w-full">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 pr-5">
              <img src="/alfred.png" alt="Alfred" className="w-10 h-10" />
              <span className="text-xl font-bold text-white">Alfred</span>
            </div>

            <nav className="flex mb-1 bg-[#111827] rounded-lg overflow-hidden">
              <button
                onClick={() => handleTabClick("command-centre")}
                className={`px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === "command-centre"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Command Centre
              </button>
              <button
                onClick={() => handleTabClick("reporting-compliance")}
                className={`px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === "reporting-compliance"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Reporting & Compliance
              </button>
            </nav>

          </div>
          <div className="flex items-center space-x-4">
            
            <Bell size={20} />

            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full border-2 border-gray-600 focus:outline-none"
            >
              <img
                src="/avatar.jpg"
                alt="User"
                className="w-full h-full object-cover"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-600 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-600">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">john@example.com</p>
                </div>
                <ul className="py-2 text-sm text-gray-300">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
