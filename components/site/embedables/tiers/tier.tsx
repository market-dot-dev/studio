'use client'

import { Button } from "@tremor/react";
import { useState } from "react";

export default function Tier({tier}: { tier : any}) : JSX.Element {

    
    return (
        
        <div className="text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <h3 className="mb-2 text-2xl font-semibold">{tier.name}</h3>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{tier.description}</p>
            <div className="flex justify-center items-baseline my-4">
                <span className="mr-2 text-5xl font-extrabold">{tier.price}</span>
                <span className="text t-gray-500 dark:text-gray-400">{tier.frequency}</span>
            </div>
            <ul role="list" className="mb-8 space-y-0 text-left flex-grow">
                {tier?.versions?.[0]?.features.map((feature : any, featureIndex: number) => (
                <li key={featureIndex} className="flex items-center space-x-3">
                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span className="text-sm">{feature.content}</span>
                </li>
                ))}
            </ul>
            <Button>Get Started</Button>
        </div>
            
    )
}