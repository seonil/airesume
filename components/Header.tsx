
import React from 'react';
import { APP_TITLE } from '../constants.ts';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{APP_TITLE}</h1>
      </div>
    </header>
  );
};

export default Header;
