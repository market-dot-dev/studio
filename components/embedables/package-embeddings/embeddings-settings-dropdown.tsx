"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/common/dropdown";
import { Button, Switch, Title } from "@tremor/react";
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

  const header = <Title>Select packages to embed</Title>;
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
        <Button className="hover:bg-marketing-primary-hover bg-marketing-primary text-white">
          <Settings size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={showPublishedPackagesSelectionModal}>
            <span className="flex items-center gap-x-2 text-gray-700">
              <Package className="size-4 text-gray-700" />
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
            <div className="flex w-full items-center justify-between text-gray-700">
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
                      <Moon className="size-4 text-gray-700" />
                    ) : (
                      <Sun className="size-4 text-gray-700" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
              </div>
              <Switch
                checked={darkMode}
                color="black"
                onChange={darkModeCallback}
                disabled={!atleastOneTierSelected}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setUseSVG(!useSVG)}
            disabled={!atleastOneTierSelected}
          >
            <div className="flex w-full items-center justify-between text-gray-700">
              <div className="flex items-center gap-x-2">
                <PenLine className="size-4 text-gray-700" />
                <span>SVG</span>
              </div>
              <Switch
                checked={useSVG}
                color="black"
                onChange={() => setUseSVG(!useSVG)}
                disabled={!atleastOneTierSelected}
              />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
