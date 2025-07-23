import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const AlertBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex  justify-between border items-center border-orange-200 bg-orange-50 rounded-md p-4">
        
    
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
          <div>
            <h3 className="text-orange-800 font-semibold">Please Note</h3>
            <p className="text-orange-700 mt-1 text-sm">
              Due to limited API requests, the site may take a minute to load or not work properly at times.
              Thank you for your patience!
            </p>
          </div>
        </div>

       
        <button
          onClick={() => setShowBanner(false)}
          className="text-orange-600 hover:text-orange-800 hover:bg-orange-100 p-1 rounded-md"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4 text-black" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;
