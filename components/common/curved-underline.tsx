// components/CurvedUnderline.tsx
"use client";
import React, { ReactNode, useRef, useEffect, useState } from 'react';

interface CurvedUnderlineProps {
  children: ReactNode;
  borderColor?: string;
}

const CurvedUnderline: React.FC<CurvedUnderlineProps> = ({ children, borderColor = '#000' }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [pathD, setPathD] = useState('');

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const controlPoint = textWidth / 2;
      setPathD(`M0 15 Q${controlPoint} 5 ${textWidth} 15`);
    }
  }, [textRef.current]);

  return (
    <span
      ref={textRef}
      style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }} // Prevent line breaks
    >
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          textShadow: `
            -2px -2px 0 ${borderColor},
             2px -2px 0 ${borderColor},
            -2px  2px 0 ${borderColor},
             2px  2px 0 ${borderColor}
          `, // Create a solid border effect
        }}
      >
        {children}
      </span>
      <svg
        viewBox={`0 0 ${textRef.current ? textRef.current.offsetWidth : 200} 20`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: -10, // Adjusted to be a few pixels lower
          left: 0,
          width: '101%', // weird bug where 100% width causes the svg to be cut off
          height: '20px',
          pointerEvents: 'none',
        }}
      >
        <path
          d={pathD}
          stroke="#fff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round" // Ensure rounded edges
        />
      </svg>
    </span>
  );
};

export default CurvedUnderline;
