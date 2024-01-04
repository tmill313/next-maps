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
  import { Input } from '@/components/ui/input'

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const AddressForm = ({form, onSubmit, name}) => {
    const [currentName, setCurrentName] = useState(name)
    const [isOpen, setIsOpen] = useState(false)
    let areFieldsDirty = Object.keys(form.formState?.dirtyFields).length > 0

return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
      <span className='max-w-[400px] whitespace-nowrap text-ellipsis overflow-hidden'>{currentName}</span>
  
    </PopoverTrigger>
    <PopoverContent>
    <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) =>onSubmit(data, setCurrentName, setIsOpen))} className="w-3/3 h-84 space-y-6">
                    <FormField
                      control={form.control}
                      name="billingStreet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Street"
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
                      name="billingCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex'>
                      <FormField
                      
                      control={form.control}
                      name="billingState"
                      render={({ field }) => (
                        <FormItem className='mx-2'>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="State"
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
                      name="billingPostalCode"
                      render={({ field }) => (
                        <FormItem className='mx-2'>
                          <FormLabel>Zip code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Zip code"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                                      <div className='flex justify-between'>
                    <Button variant='secondary'>Cancel</Button>
                    <Button disabled={!areFieldsDirty} type="submit">Save</Button>
                  </div>
                  </form>
                </Form>    </PopoverContent>
  </Popover>
)
}

export default AddressForm