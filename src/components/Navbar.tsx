import { useState } from 'react';
import {   Search, Clapperboard, Home } from 'lucide-react';
import { useManga } from '../context/MangaContext';
import ToggleButton from './ui/ToggleButton';
import { Sling as Hamburger } from 'hamburger-react';

const navlinks = [
  { type: 'Home', link: '/', icon: Home},
  { type: 'Search', link: '/search', icon: Search },
  { type: 'Genres', link: '/genres', icon: Clapperboard },
];

const Navbar = () => {
  const { toggleNsfw, nsfwEnabled } = useManga();
  const [isOpen, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);  
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center" onClick={handleLinkClick}>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#fff9eb] select-none">
                ReviewRōmaji
              </h2>
            </a>
          </div>

        
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navlinks.map(({ type, link, icon: Icon }) => (
                <a
                  key={link}
                  href={link}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {type}
                </a>
              ))}
              
              {/* Desktop NSFW Toggle */}
              <div className="ml-4">
                <ToggleButton
                  checked={nsfwEnabled}
                  onChange={toggleNsfw}
                  labelTrue="Family"
                  labelFalse="NSFW"
      />
              </div>
            </div>
          </div>

        
          <div className="md:hidden">
            <Hamburger 
              toggled={isOpen} 
              toggle={setOpen} 
              size={20}
              color="#fff9eb"
              duration={0.8}
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black-600 rounded-lg mt-2 mb-4">
            {navlinks.map(({ type, link, icon: Icon }) => (
              <a
                key={link}
                href={link}
                onClick={handleLinkClick}
                className="flex items-center px-3 py-2  hover:text-gray-900 hover:bg-white rounded-md text-base font-medium transition-colors duration-200"
              >
                {Icon && <Icon className="h-5 w-5 mr-3" />}
                {type}
              </a>
            ))}

            {/* Mobile NSFW Toggle */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Content Filter:</span>
                 <ToggleButton
                  checked={nsfwEnabled}
                  onChange={toggleNsfw}
                  labelTrue="Family"
                  labelFalse="NSFW"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
