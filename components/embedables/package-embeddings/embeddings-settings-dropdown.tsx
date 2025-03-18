"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, Moon, Sun, PenLine, PackagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import PublishedPackagesSelectionModal from "./published-packages-selection-modal";
import { TierWithFeatures } from "@/app/services/TierService";

export default function EmbeddingsSettingsDropdown({
  darkMode,
  darkModeCallback,
  selectedTiers,
  setSelectedTiers,
  useSVG,
  setUseSVG,
}: {
  darkMode: boolean;
  darkModeCallback: () => void;
  selectedTiers: TierWithFeatures[];
  setSelectedTiers: (tiers: TierWithFeatures[]) => void;
  useSVG: boolean;
  setUseSVG: (useSVG: boolean) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [temporarySelectedTiers, setTemporarySelectedTiers] = useState<TierWithFeatures[]>(selectedTiers);
  const atleastOneTierSelected = selectedTiers.length > 0;

  useEffect(() => {
    if (dialogOpen) {
      setTemporarySelectedTiers(selectedTiers);
    }
  }, [dialogOpen, selectedTiers]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-screen-lg rounded-lg w-[calc(100vw-32px)] lg:w-[80vw] max-h-[calc(100vh-32px)] lg:max-h-[80vh] overflow-y-auto gap-6 p-6 pt-5 md:p-9 md:pt-8 md:gap-9">
          <DialogHeader>
            <DialogTitle>Pick Packages</DialogTitle>
          </DialogHeader>
          <PublishedPackagesSelectionModal 
            initTiers={temporarySelectedTiers} 
            onSelectionChange={setTemporarySelectedTiers}
          />
          <DialogFooter>
            <Button 
              size="lg"
              disabled={temporarySelectedTiers.length === 0}
              onClick={() => {
                setSelectedTiers(temporarySelectedTiers);
                setDialogOpen(false);
              }}
            >
              Use Packages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Settings />
            Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              <span className="flex items-center gap-x-2">
                <PackagePlus className="size-4" />
                <span>
                  Pick Packages{" "}
                  {atleastOneTierSelected ? `(${selectedTiers.length})` : ""}
                </span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={darkModeCallback}
              disabled={!atleastOneTierSelected}
            >
              <div className="flex w-full items-center justify-between gap-4 ">
                <div className="flex items-center gap-x-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={darkMode ? "sun" : "moon"}
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      {darkMode ? (
                        <Moon className="size-4" />
                      ) : (
                        <Sun className="size-4" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={darkModeCallback}
                  disabled={!atleastOneTierSelected}
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setUseSVG(!useSVG)}
              disabled={!atleastOneTierSelected}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-x-2">
                  <PenLine className="size-4" />
                  <span>SVG</span>
                </div>
                <Switch
                  checked={useSVG}
                  onCheckedChange={() => setUseSVG(!useSVG)}
                  disabled={!atleastOneTierSelected}
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
