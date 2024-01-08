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


const ContactNameInput = ({form, onSubmit, name}) => {
    const [currentName, setCurrentName] = useState(name)
    const [isOpen, setIsOpen] = useState(false)
    let areFieldsDirty = form.formState?.defaultValues.ContactName?.firstName !== parseInt(form.getValues('firstName')) ||
    form.formState?.defaultValues.ContactName?.lastName !== parseInt(form.getValues('lastName'))
return (
<Popover open={isOpen} onOpenChange={setIsOpen} >
<PopoverTrigger asChild>
<div className='max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden'>{currentName}</div>
</PopoverTrigger>
<PopoverContent>
<Form {...form}>
              <form onSubmit={form.handleSubmit((data) => onSubmit(data, setCurrentName, setIsOpen))} className="w-3/3 h-84 space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                            
                                  <div className='flex justify-between'>
                <Button variant='secondary'>Cancel</Button>
                <Button disabled={!areFieldsDirty} type="submit">Save</Button>
              </div>
              </form>
            </Form></PopoverContent>
</Popover>
)
}

export default ContactNameInput