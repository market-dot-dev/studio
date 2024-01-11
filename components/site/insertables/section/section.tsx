import { Section } from '@radix-ui/themes';

export default function SectionInsertable({ bg, ...props }: any) {
    return (
        <Section {...props} style={{ backgroundColor: bg }} />
    )
}