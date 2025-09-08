import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setActiveTab } from '../store/slices/uiSlice';
import { Bell, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state: RootState) => state.ui);
  const [open, setOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: 'command-centre' | 'reporting-compliance') => {
    dispatch(setActiveTab(tab));
    setMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#0B1623] border-b border-gray-700 fixed w-full z-40">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/alfred.png" 
                alt="Alfred" 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
              <span className="text-lg sm:text-xl font-bold text-white">
                Alfred
              </span>
            </div>
            <nav className="hidden md:flex items-center ml-8">
            <div className="flex bg-[#111827] rounded-lg overflow-hidden">
              <button
                onClick={() => handleTabClick("command-centre")}
                className={`px-4 lg:px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === "command-centre"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Command Centre
              </button>
              <button
                onClick={() => handleTabClick("reporting-compliance")}
                className={`px-4 lg:px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === "reporting-compliance"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Reporting & Compliance
              </button>
            </div>
          </nav>
          </div>

          {/* Right Section - Notifications, User Menu, Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notification Bell */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
              <Bell size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* User Avatar */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden rounded-full border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-500"
              >
                <img
                  src="/avatar.jpg"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* User Dropdown */}
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
                        className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden border-t border-gray-700 bg-[#0B1623]"
          >
            <nav className="py-4 space-y-2">
              <button
                onClick={() => handleTabClick("command-centre")}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "command-centre"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Command Centre
              </button>
              <button
                onClick={() => handleTabClick("reporting-compliance")}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "reporting-compliance"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Reporting & Compliance
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
