"use client";

import { Drawer } from "vaul";

export default function DrawerRight({children, isOpen, setIsOpen, title }: {children: React.ReactNode, isOpen: boolean, setIsOpen: (isOpen: boolean) => void, title?: string}) {
  return (
    <Drawer.Root direction="right" open={isOpen}>
      {/* <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger> */}
      <Drawer.Portal>
        <Drawer.Overlay onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
          <div className="p-4 bg-white flex-1 h-full">
            <div className="max-w-md mx-auto">
              { title ? <Drawer.Title className="font-medium mb-4">
                {title}
              </Drawer.Title>
              : null }
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}