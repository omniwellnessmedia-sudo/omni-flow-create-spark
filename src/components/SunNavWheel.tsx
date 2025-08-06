import React from 'react';
import { Link } from 'react-router-dom';

const SunNavWheel = () => {
  const navItems = [
    { label: "Deals", href: "/wellness-deals", angle: 0, color: "hsl(var(--omni-red))" },
    { label: "Travel", href: "/tours-retreats", angle: 60, color: "hsl(var(--omni-orange))" },
    { label: "Store", href: "/travel-well-connected-store", angle: 120, color: "hsl(var(--omni-yellow))" },
    { label: "Services", href: "/services", angle: 180, color: "hsl(var(--omni-green))" },
    { label: "AI Tools", href: "/ai-tools", angle: 240, color: "hsl(var(--omni-blue))" },
    { label: "Impact", href: "/impact", angle: 300, color: "hsl(var(--omni-purple))" },
  ];

  return (
    <div className="nav-wheel-container relative">
      <Link to="/" className="block">
        <svg 
          viewBox="0 0 180 180" 
          className="nav-wheel w-20 h-20 transition-transform duration-300 hover:rotate-[30deg]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background gradient circle */}
          <defs>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--omni-purple))" stopOpacity="0.8" />
              <stop offset="30%" stopColor="hsl(var(--omni-blue))" stopOpacity="0.6" />
              <stop offset="60%" stopColor="hsl(var(--omni-green))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--omni-orange))" stopOpacity="0.2" />
            </radialGradient>
            
            {/* Glow filters for rays */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Central logo circle */}
          <circle 
            cx="90" 
            cy="90" 
            r="35" 
            fill="url(#centerGradient)"
            className="transition-all duration-300"
          />
          
          {/* Meditation figure silhouette */}
          <g transform="translate(90, 90)">
            {/* Lotus petals background */}
            <g opacity="0.6">
              {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                <g key={angle} transform={`rotate(${angle})`}>
                  <path
                    d="M0,-25 Q-8,-35 0,-45 Q8,-35 0,-25"
                    fill={navItems[index]?.color}
                    opacity="0.4"
                  />
                </g>
              ))}
            </g>
            
            {/* Meditation figure */}
            <g fill="hsl(var(--foreground))" opacity="0.8">
              {/* Head */}
              <circle cx="0" cy="-15" r="6" />
              
              {/* Body */}
              <ellipse cx="0" cy="-5" rx="8" ry="12" />
              
              {/* Arms in meditation pose */}
              <path d="M-8,-8 Q-15,-5 -15,0 Q-15,5 -8,2" />
              <path d="M8,-8 Q15,-5 15,0 Q15,5 8,2" />
              
              {/* Legs crossed */}
              <path d="M-6,7 Q-10,12 -5,15 Q0,12 5,15 Q10,12 6,7" />
            </g>
          </g>

          {/* Navigation rays - hidden by default, shown on hover */}
          <g className="rays opacity-0 transition-all duration-500 hover:opacity-100">
            {navItems.map(({ label, href, angle, color }) => (
              <g key={label} transform={`rotate(${angle} 90 90)`}>
                <Link to={href}>
                  <g className="ray-group cursor-pointer">
                    {/* Ray line */}
                    <path
                      d="M90 55 L90 25"
                      stroke={color}
                      strokeWidth="3"
                      className="ray transition-all duration-300 hover:stroke-[4] filter-[url(#glow)]"
                      strokeLinecap="round"
                    />
                    
                    {/* Ray tip */}
                    <circle
                      cx="90"
                      cy="25"
                      r="3"
                      fill={color}
                      className="transition-all duration-300 hover:r-4"
                    />
                    
                    {/* Label */}
                    <text
                      x="90"
                      y="15"
                      textAnchor="middle"
                      fill={color}
                      fontSize="8"
                      fontWeight="600"
                      className="transition-all duration-300 hover:font-bold"
                      transform={`rotate(${-angle} 90 15)`}
                    >
                      {label}
                    </text>
                  </g>
                </Link>
              </g>
            ))}
          </g>

          {/* Hover trigger invisible overlay */}
          <circle
            cx="90"
            cy="90"
            r="85"
            fill="transparent"
            className="hover-trigger cursor-pointer"
          />
        </svg>
      </Link>
      
      {/* Optional: Brand text below */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
          Omni Wellness
        </span>
      </div>
    </div>
  );
};

export default SunNavWheel;