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
import { toast } from "@/components/ui/use-toast"


const colorArray = [
    {label: 'Green', value: 'green', hex: '#A5D39C'},
    {label: 'Blue', value: 'blue', hex: '#B0D1E8'},
    {label: 'Red', value: 'red', hex: '#FF6C5C'},
    {label: 'Yellow', value: 'yellow', hex: '#FFE699'},
    {label: 'Grey', value: 'grey', hex: '#D09FB8'},]

 const ColorFilterDropdown = ({     
    form,
    isPopOpen,
    setIsPopOpen
  }) => {

  return (
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => {
            return (
            <FormItem className="flex flex-col">
              <FormLabel>Color</FormLabel>
              <Popover open={isPopOpen} onOpenChange={setIsPopOpen}>
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
                        ? colorArray.find(
                            (color) => color.value === field.value
                          )?.label
                        : "Select Color"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search for color..."
                      className="h-9"
                    />
                    <CommandEmpty>No color found.</CommandEmpty>
                    <CommandGroup>
                    <ScrollArea className="h-[165px] w-[190px]">
                      {colorArray.map((color) => {
                        return (
                        <CommandItem
                          value={color.label}
                          key={color.value}
                          onSelect={() => {
                            form.setValue("color", color.value)
                          }}
                        >
                          <div className={`h-3 w-3 bg-[${color.hex}] rounded-full mr-1`}/>
                          {color.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              color.value === field.value
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

export default ColorFilterDropdown