import React, { useState, useEffect } from 'react';

// ==================================================
// EASY CONFIGURATION FOR NON-TECHNICAL USERS
// ==================================================

// Change this message to update the announcement
const ANNOUNCEMENT_MESSAGE = "Next Pop-Up Location Announced Soon!";

// Set the next popup date here (Year, Month-1, Day, Hour, Minute)
// Note: Month is 0-indexed (January = 0, February = 1, etc.)
// Example: new Date(2025, 5, 15, 12, 0) = June 15, 2025 at 12:00 PM
const NEXT_POPUP_DATE = new Date(2025, 5, 15, 12, 0);

// ==================================================

const AnnouncementsCountdown: React.FC = () => {
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
    <div className="mt-8 mb-12 mx-auto max-w-md px-4">
      {/* Minimalist announcement card */}
      <div className="bg-white border-3 border-black shadow-[4px_4px_0px_#000000] p-4">
        {/* Announcement */}
        <p className="font-['Cherry_Bomb_One'] text-sm text-center text-black mb-3">
          {ANNOUNCEMENT_MESSAGE}
        </p>
        
        {/* Countdown */}
        <div className="flex justify-center space-x-3">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HRS', value: timeLeft.hours },
            { label: 'MIN', value: timeLeft.minutes },
            { label: 'SEC', value: timeLeft.seconds }
          ].map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="bg-black text-white px-2 py-1 min-w-[40px] border-2 border-black">
                <span className="font-mono text-lg font-bold">
                  {unit.value.toString().padStart(2, '0')}
                </span>
              </div>
              <p className="font-['Cherry_Bomb_One'] text-[10px] text-black mt-1">
                {unit.label}
              </p>
            </div>
          ))}
        </div>

        {/* Small accent line */}
        <div className="bg-red-500 h-1 w-full mt-3"></div>
      </div>
    </div>
  );
};

export default AnnouncementsCountdown;