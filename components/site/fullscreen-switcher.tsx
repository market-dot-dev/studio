'use client'
import FullScreen from './fullscreen.module.css'
import { useFullscreen } from '../dashboard/dashboard-context';
import React from 'react';

export default function FullScreenSwitcher({ 
  children,
  className
}: { 
  children: React.ReactNode;
  className?: string;
}) {	
	const { fullscreen, setFullscreen } = useFullscreen();
	
	// We can't directly pass props to arbitrary children
	// so we'll apply a class to the container and let the children
	// access the fullscreen context directly
	return (
		<div className={`relative ${fullscreen ? FullScreen.fullscreen : ''} ${className || ''}`}>
			{children}
		</div>
	)
}