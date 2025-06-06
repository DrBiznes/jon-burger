import React, { useState, useEffect } from 'react';

// ==================================================
// EASY CONFIGURATION FOR NON-TECHNICAL USERS
// ==================================================

// Change this message to update what shows
const POPUP_MESSAGE = "Next Pop-Up Soon";

// Set the next popup date here (Year, Month-1, Day, Hour, Minute)
// Note: Month is 0-indexed (January = 0, February = 1, etc.)
// Example: new Date(2025, 5, 15, 12, 0) = June 15, 2025 at 12:00 PM
const NEXT_POPUP_DATE = new Date(2025, 5, 15, 12, 0);

// ==================================================

const NextPopup: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = NEXT_POPUP_DATE.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mt-6">
      {/* Simple message */}
      <p className="font-['Cherry_Bomb_One'] text-sm text-gray-700 dark:text-gray-300 mb-2">
        {POPUP_MESSAGE}
      </p>
      
      {/* Minimal countdown */}
      <div className="flex justify-center space-x-2">
        <span className="font-mono text-xs bg-black text-white px-2 py-1">
          {timeLeft.days}d
        </span>
        <span className="font-mono text-xs bg-black text-white px-2 py-1">
          {timeLeft.hours}h
        </span>
        <span className="font-mono text-xs bg-black text-white px-2 py-1">
          {timeLeft.minutes}m
        </span>
        <span className="font-mono text-xs bg-black text-white px-2 py-1">
          {timeLeft.seconds}s
        </span>
      </div>
    </div>
  );
};

export default NextPopup;