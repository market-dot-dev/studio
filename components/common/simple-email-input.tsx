
import { TextInput } from "@tremor/react";

export default function SimpleEmailInputForm(props: any) {
    const { children } = props;

    return (
        <TextInput className={props.className ?? ""} placeholder={props.placeholder ?? ""}>
            {children}
        </TextInput>
    )
}