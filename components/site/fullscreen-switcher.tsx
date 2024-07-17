'use client'
import FullScreen from './fullscreen.module.css'
import { useFullscreen } from '../dashboard/dashboard-context';
export default function FullScreenSwitcher({ children }: { children: React.ReactNode }) {	
	const { fullscreen } = useFullscreen();
	return (
		<div className={'relative ' + (fullscreen ? FullScreen.fullscreen : '')}>
			{children}
		</div>
	)
}