export default function SiteDescription({site, page}: { site : any, page : any}) {
    const lines = site.user.projectDescription.split('\n');
    const html = lines.join('<br />');
    // console.log('lines', lines)
    // const paragraphs = lines.map((line : string, index : number) => <p key={index}>{line}</p>);
    return (
        <span dangerouslySetInnerHTML={{__html: html}} />
    )
    
}