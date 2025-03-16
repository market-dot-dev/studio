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
import { Package, Settings, Moon, Sun, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/components/modal/provider";
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
  const { show, hide } = useModal();

  const header = (
    <h2 className="text-xl font-bold">Select packages to embed</h2>
  );
  const atleastOneTierSelected = selectedTiers.length > 0;

  const showPublishedPackagesSelectionModal = () => {
    show(
      <PublishedPackagesSelectionModal
        hide={hide}
        initTiers={selectedTiers}
        onDoneCallback={(tiers: TierWithFeatures[]) => {
          setSelectedTiers(tiers);
        }}
      />,
      undefined,
      undefined,
      header,
      "w-full md:w-5/6 max-h-[80vh]",
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings />
          Embed Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={showPublishedPackagesSelectionModal}>
            <span className="flex items-center gap-x-2">
              <Package className="size-4" />
              <span>
                Packages{" "}
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
  );
}
