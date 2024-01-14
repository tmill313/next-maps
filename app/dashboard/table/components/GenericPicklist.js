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

 const GenericPicklist = ({     
   form,
   onSubmit,
   value,
   currentField
  }) => {
    const [currentValue, setCurrentValue] = useState(value)
    const [isOpen, setIsOpen] = useState(false)
    let areFieldsDirty = Object.keys(form.formState?.dirtyFields).length > 0


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
      <span>{currentValue ?? '-'}</span>

    </PopoverTrigger>
    <PopoverContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, setCurrentValue, setIsOpen))} className="space-y-6">
        <FormField
          control={form.control}
          name={currentField?.name}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{currentField?.label}</FormLabel>
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
                        ? currentField?.picklist_values?.find(
                            (value) => value.value === field.value
                          )?.label
                        : `Select ${currentField?.label}`}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search for industry..."
                      className="h-9"
                    />
                    <CommandEmpty>{`No ${currentField?.label} found.`}</CommandEmpty>
                    <CommandGroup>
                    <ScrollArea className="h-[200px] w-[350px]">
                      {currentField?.picklist_values?.map((item) => {
                        return (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue(currentField?.name, item.value)
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
          )}
        />
                        <div className='flex justify-between'>
                    <Button variant='secondary'>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
      </form>
    </Form>
    </PopoverContent>
        </Popover>
  )
}

export default GenericPicklist