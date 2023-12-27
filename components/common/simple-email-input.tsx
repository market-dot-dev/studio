
import { TextInput } from "@tremor/react";

export default function SimpleEmailInputForm(props: any) {
    const { children } = props;

    return (
        <TextInput placeholder={props.placeholder ?? ""} className="mb-2">
            {children}
            <button className="bg-slate-500 hover:bg-slate-300 text-white font-bold py-2 px-4 rounded">
                Get Started
              </button>
        </TextInput>
    )
}