"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type ComboboxItem = {
  value: string
  label: string
  [key: string]: any
}

interface ComboboxProps<T extends ComboboxItem | Record<string, any>> {
  items: T[]
  value: string
  onChange: (value: string) => void
  valueKey?: keyof T
  labelKey?: keyof T
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  popoverClassName?: string
  disabled?: boolean
}

export function Combobox<T extends ComboboxItem | Record<string, any>>({
  items = [],
  value,
  onChange,
  valueKey = "value" as keyof T,
  labelKey = "label" as keyof T,
  renderItem,
  placeholder = "Select an item...",
  searchPlaceholder = "Search items...",
  emptyMessage = "No item found.",
  className,
  popoverClassName,
  disabled = false,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)

  // Safely get the label for the selected value
  const getSelectedLabel = React.useCallback(() => {
    if (!value) return placeholder

    const selectedItem = items.find((item) => String(item[valueKey]) === String(value))

    return selectedItem ? String(selectedItem[labelKey]) : placeholder
  }, [items, value, valueKey, labelKey, placeholder])

  // Default item renderer if none provided
  const defaultRenderItem = React.useCallback(
    (item: T, isSelected: boolean) => (
      <>
        {String(item[labelKey])}
        <Check className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")} />
      </>
    ),
    [labelKey],
  )

  // Handle safe item selection
  const handleSelect = React.useCallback(
    (currentValue: string) => {
      onChange(currentValue === value ? "" : currentValue)
      setOpen(false)
    },
    [onChange, value],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          {getSelectedLabel()}
          <ChevronsUpDown className="ml-2 -mr-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item, index) => {
                // Skip null or undefined items
                if (item == null) return null

                const itemValue = String(item[valueKey] || "")
                const isSelected = itemValue === value

                return (
                  <CommandItem key={`${itemValue}-${index}`} value={itemValue} onSelect={handleSelect}>
                    {renderItem ? renderItem(item, isSelected) : defaultRenderItem(item, isSelected)}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

