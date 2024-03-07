'use client'
import { OTPInput, SlotProps } from 'input-otp'
import { cn } from "@/lib/utils";

function Spinner() {
	return (
		<div role="status">
			<svg aria-hidden="true" className="inline w-6 h-6 mx-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
				<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
			</svg>
			<span className="sr-only">Loading...</span>
		</div>
	)
}

export default function OTPInputElement({onComplete, onPaste, onInput, verifying}: any) {
	
	return (
		<OTPInput
			disabled={verifying}
			maxLength={6}
			
			containerClassName="group flex items-center has-[:disabled]:opacity-30"
			style={{ outline: 'none' }}
			
			onComplete={onComplete}
			onPaste={onPaste}
			onInput={onInput}
			
			render={({ slots }) => (
				<div className='flex w-full justify-center items-center'>
					<div className="flex">
						{slots.slice(0, 3).map((slot, idx) => (
							<Slot key={idx} {...slot} />
						))}
					</div>
					{ verifying ?
					<Spinner /> :
					<FakeDash /> }

					<div className="flex">
						{slots.slice(3).map((slot, idx) => (
							<Slot key={idx} {...slot} />
						))}
					</div>
				</div>
			)}
		/>
	)
}

// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps) {
	return (
		<div
			className={cn(
				'relative w-10 h-14 text-[2rem]',
				'flex items-center justify-center',
				'transition-all duration-300',
				'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
				'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
				'outline outline-0 outline-accent-foreground/20',
				{ 'outline-1 outline-accent-foreground': props.isActive },
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <FakeCaret />}
		</div>
	)
}

// You can emulate a fake textbox caret!
function FakeCaret() {
	return (
		<div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
			<div className="w-px h-8 bg-white" />
		</div>
	)
}

// Inspired by Stripe's MFA input.
function FakeDash() {
	return (
		<div className="flex w-10 justify-center items-center">
			<div className="w-3 h-1 rounded-full border" />
		</div>
	)
}

// tailwind.config.ts for the blinking caret animation.
const config = {
	theme: {
		extend: {
			keyframes: {
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' },
				},
			},
			animation: {
				'caret-blink': 'caret-blink 1.2s ease-out infinite',
			},
		},
	},
}


