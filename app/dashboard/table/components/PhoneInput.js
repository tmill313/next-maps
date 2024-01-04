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
import { Input } from "@/components/ui/input"

const PhoneInput = ({form, onSubmit, name}) => {
    const [currentName, setCurrentName] = useState(name)
    const [isOpen, setIsOpen] = useState(false)
    let areFieldsDirty = form.formState?.defaultValues.phoneNumber !== parseInt(form.getValues('phoneNumber'))

return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
      <span className='max-w-[170px] whitespace-nowrap text-ellipsis overflow-hidden'>{currentName}</span>
  
    </PopoverTrigger>
    <PopoverContent>
    <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, setCurrentName, setIsOpen))} className="w-3/3 space-y-6">
                    <FormField
                      control={form.control}
                      name="mobilePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Phone"
                              className="resize-none"
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

export default PhoneInput