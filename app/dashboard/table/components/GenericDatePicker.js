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
  import { Calendar } from "@/components/ui/calendar"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Button } from "@/components/ui/button"
  import {formatISO} from 'date-fns'


const GenericDatePicker = ({form, onSubmit, value, currentField}) => {
    const [currentValue, setCurrentValue] = useState(value)
    const [isOpen, setIsOpen] = useState(false)
    let areFieldsDirty = Object.keys(form.formState?.dirtyFields).length > 0

return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
      <span className='max-w-[170px] whitespace-nowrap text-ellipsis overflow-hidden'>{new Date(currentValue).toLocaleDateString('en-US')}</span>
  
    </PopoverTrigger>
    <PopoverContent>
    <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, setCurrentValue, setIsOpen))} className="w-3/3 h-30 space-y-6">
                    <FormField
                      control={form.control}
                      name={currentField?.name}
                      render={({ field }) => { 
                        console.log(field)
                        let formatted = new Date(field.value)
                        console.log(formatted)
                        return (
                        <FormItem>
                          <FormLabel>{currentField?.label}</FormLabel>
                          <FormControl>
                            
                          <Calendar
                    mode="single"
                    selected={formatted}
                    onSelect={field.onChange}
                    initialFocus
                  />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}}
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

export default GenericDatePicker