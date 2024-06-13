'use client'
import { useModal } from "@/components/modal/provider";
import { Feature } from "@prisma/client";
import styles from './features.module.css';
import { Button, Title } from "@tremor/react";
import { CopyBlock, a11yLight } from "react-code-blocks";

export default function CustomerPackageFeatures({ features, maintainerEmail }: { features: Feature[], maintainerEmail: string | null }) {
    const { show, hide } = useModal();

    const isEmail = (uri: string) => uri.includes('@');
    const isPhoneNumber = (uri: string) => /^\+?[1-9]\d{1,14}$/.test(uri);

    const showFeatures = () => {
        show(
            <div className="flex flex-col gap-4 bg-white p-6 border shadow-2xl w-full md:w-2/3 lg:w-1/2 rounded-md">
                {[{id: 0, name: 'Contact Maintainers', uri: maintainerEmail}, ...features].map((feature) => (
					feature.uri ?
						<div key={feature.id} className={styles.feature_item + ' flex flex-col gap-2'}>
							<Title>{feature.name}</Title>
							<div className="text-sm border rounded-sm p-2 flex justify-between items-center gap-4">
								<div className="flex flex-col items-stretch grow">
									<CopyBlock
										text={feature.uri ?? ''}
										language='html'
										theme={a11yLight}
										/>
								</div>
								{!isPhoneNumber(feature.uri!) ?
									<Button
										variant="light"
										onClick={() => window.open(isEmail(feature.uri!) ? `mailto:${feature.uri!}` : feature.uri!, '_blank')}
										className="text-blue-500 hover:underline focus:outline-none mr-2"
									>
										{isEmail(feature.uri!) ? 
											<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black hover:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> : 
											<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black hover:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>}
									</Button>		
								:  <div className="w-4 h-4 mr-2"></div>
								}
							</div>
						</div>
						: null
                ))}
            </div>,
            hide,
            true // ignoreFocusTrap
        );
    }

    return (
        <>
            <button onClick={showFeatures} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Contact Maintainers</button>
        </>
    );
}
