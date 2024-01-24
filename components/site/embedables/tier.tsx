'use client'

import { Button } from "@tremor/react";
const protocol = process.env.NEXT_PUBLIC_VERCEL_ENV ? 'https' : 'http';

export default function Tier({tier, subdomain, darkmode}: { tier : any, subdomain: string, darkmode: boolean | undefined }) : JSX.Element {
    const url = `${protocol}://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

    // Define classes based on darkmode prop
    const containerClasses = darkmode 
        ? "text-center rounded-lg border shadow xl:p-8 text-white bg-gray-800 border-gray-600"
        : "text-center rounded-lg border shadow xl:p-8 text-gray-900 bg-white border-gray-100";

    const textClasses = darkmode ? "text-gray-400" : "text-gray-500";
    const featureIconClasses = darkmode ? "text-green-400" : "text-green-500";

    return (
        <div className={containerClasses}>
            <h3 className="mb-2 text-2xl font-semibold">{tier.name}</h3>
            <p className={`font-light sm:text-lg ${textClasses}`}>{tier.description}</p>
            <div className="flex justify-center items-baseline my-4">
                <span className="mr-2 text-5xl font-extrabold">{tier.price}</span>
                <span className={textClasses}>{tier.frequency}</span>
            </div>
            <ul role="list" className="mb-8 space-y-0 text-left flex-grow">
                {tier?.versions?.[0]?.features.map((feature: any, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                        <svg className={`flex-shrink-0 w-5 h-5 ${featureIconClasses}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        <span className="text-sm">{feature.content}</span>
                    </li>
                ))}
            </ul>
            <a href={url} target="_blank" className="block w-full">
                <Button>Get Started</Button>
            </a>
        </div>
    )
}
