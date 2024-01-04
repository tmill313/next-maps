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

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
]

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
})

 const PickList = ({     
   areFieldsDirty, 
   salesforceURL,
   options,
   onSubmit,
   pickList,
   form,
   name
  }) => {
  const [open, setOpen] = useState(false)
  const [industry, setIndustry] = useState(name)


  return (
    <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <span>{industry}</span>

    </PopoverTrigger>
    <PopoverContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, setIndustry, setOpen))} className="space-y-6">
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Industry</FormLabel>
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
                        ? pickList.find(
                            (industry) => industry.value === field.value
                          )?.label
                        : "Select industry"}
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
                    <CommandEmpty>No industry found.</CommandEmpty>
                    <CommandGroup>
                    <ScrollArea className="h-[200px] w-[350px]">
                      {pickList.map((industry) => (
                        <CommandItem
                          value={industry.label}
                          key={industry.value}
                          onSelect={() => {
                            form.setValue("industry", industry.value)
                          }}
                        >
                          {industry.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              industry.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
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
                    <Button disabled={!areFieldsDirty} type="submit">Save</Button>
                  </div>
      </form>
    </Form>
    </PopoverContent>
        </Popover>
  )
}

export default PickList