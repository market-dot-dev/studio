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
								
								{
								isEmail(feature.uri) ? 
									<a href={`mailto:${feature.uri}`} className="flex gap-2 items-center"><span>{feature.uri}</span></a> : 
									isPhoneNumber(feature.uri) ? 
										<a href={`tel:${feature.uri}`} className="flex gap-2 items-center"><span>{feature.uri}</span></a> : 
										<a href={feature.uri} target="_blank" className="flex gap-2 items-center"><span>{feature.uri}</span></a>}

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
