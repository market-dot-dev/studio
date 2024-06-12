'use client'
import { useModal } from "@/components/modal/provider";
import { Feature } from "@prisma/client";
import styles from './features.module.css';
import { CopyBlock, a11yLight } from 'react-code-blocks';
import { Title } from "@tremor/react";

export default function CustomerPackageFeatuers({features} : {features: Feature[]}) {
	const { show, hide } = useModal();

	const showFeatures = () => {
		show(
			<div className="flex flex-col gap-4 bg-white p-6 border shadow-2xl w-full md:w-2/3 lg:w-1/2 rounded-md">
				{features.map((feature) => (
					<div key={feature.id} className={styles.feature_item + ' flex flex-col gap-2'}>
						<Title>{feature.name}</Title>
						<div className="text-sm border rounded-sm">
							<CopyBlock
								text={feature.uri ?? ''}
								language='html'
								theme={a11yLight}
								/>
						</div>
					</div>
				))}
			</div>,
			hide,
			true // ignoreFocusTrap
		)
	}

	return (
		<>
			<button onClick={showFeatures} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Service Contacts</button>
		</>
	)
}