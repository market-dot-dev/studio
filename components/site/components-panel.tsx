import type { Insertable } from "../site/insertables";
import components from "../site/insertables";

export default function ComponentsPanel({ insertAtCursor }: {insertAtCursor: (prop: string) => void}) {
    return (
      <ComponentsBlock components={components} insertAtCursor={insertAtCursor} />
    )
}

function ComponentsBlock({components, insertAtCursor} : { components : Insertable[], insertAtCursor: (prop: string) => void} ) : JSX.Element {
    return (
      <div className="grid gap-2 w-full">
        {Object.values(components).filter((item: any) => !item.hidden).map(
          (component: Insertable, index: number) => {
            const buttonContent =  (
              <div className="flex flex-col items-center gap-2">
                <h4 className="text-sm font-bold">{component.name}</h4>
                <p className="text-xs">{component.description}</p>
              </div>
            )
            return (
              <div key={index}>
                  <div
                    className="cursor-pointer bg-gray-200 hover:bg-gray-600 hover:text-white rounded-md h-full text-xs align-middle text-center">
                      { component.insert ? <component.insert insertAtCursor={insertAtCursor}>{buttonContent}</component.insert> :
                        <div className="p-2 py-4" onClick={() => {
                          insertAtCursor(
                            `<${component.tag}${component.attributes ? ' ' + Object.keys(component.attributes).map((key) => `${key}="${component.attributes[key]}"`).join(' ') : ''}></${component.tag}>`,
                          )
                        }}>
                          {buttonContent}
                        </div>
                      }
                  </div>
              </div>
            );
          },
        )}
      </div>
    );
} 