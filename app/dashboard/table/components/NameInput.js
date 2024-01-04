'use client'
import { useState } from "react"
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
  import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const NameInput = ({form, onSubmit, name}) => {
    const [currentName, setCurrentName] = useState(name)
    const [isOpen, setIsOpen] = useState(false)
    let areFieldsDirty = Object.keys(form.formState?.dirtyFields).length > 0

return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
      <span className='max-w-[170px] whitespace-nowrap text-ellipsis overflow-hidden'>{currentName}</span>
  
    </PopoverTrigger>
    <PopoverContent>
    <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, setCurrentName, setIsOpen))} className="w-3/3 h-80 space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Name"
                              className="resize-none h-56"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex justify-between'>
                      <Button onClick={() => setIsOpen(false)} variant='secondary'>Cancel</Button>
                      <Button disabled={!areFieldsDirty} type="submit">Save</Button>
                    </div>
                  </form>
                </Form>
              
    </PopoverContent>
  </Popover>
)
}

export default NameInput