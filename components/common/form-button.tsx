
import { Button } from "@tremor/react";

export default function FormButton(props: any) {
    return (
        <Button className={props.className ?? ""} size={props.size ?? ""} onClick={props.onClick ?? null}>
            {props.label ?? ""}
        </Button>
    )
}