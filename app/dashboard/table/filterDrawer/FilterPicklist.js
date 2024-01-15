"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { ScrollArea } from "@/components/ui/scroll-area"

import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const FilterPicklist = ({picklist, label, name, form}) => {
    return (
        <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? picklist.find(
                          (item) => item.value === field.value
                        )?.label
                      : `Select ${label}`}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder={`Search for ${label}...`}
                    className="h-9"
                  />
                  <CommandEmpty>{`No ${label} found.`}</CommandEmpty>
                  <CommandGroup>
                  <ScrollArea className="h-[165px] w-[190px]">
                    {picklist.map((item) => {
                      return (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          form.setValue(name, item.value)
                        }}
                      >
                        {item.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )})}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}}
      />
    )
}

export default FilterPicklist