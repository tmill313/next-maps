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

const RevenueInput = ({form, onSubmit, name}) => {
    const [currentName, setCurrentName] = useState(name)
    const [isOpen, setIsOpen] = useState(false)
    let areFieldsDirty = form.formState?.defaultValues.annualRevenue !== parseInt(form.getValues('annualRevenue'))

return (
<Popover open={isOpen} onOpenChange={setIsOpen}>
<PopoverTrigger asChild>
<div className="text-left">{form.formState?.defaultValues.annualRevenue ? currentName : 'N/A'}</div>
</PopoverTrigger>
<PopoverContent>
<Form {...form}>
              <form onSubmit={form.handleSubmit((data) => onSubmit(data, setCurrentName, setIsOpen))} className="w-3/3 h-84 space-y-6">
                <FormField
                  control={form.control}
                  name="annualRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenue</FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                          placeholder="Revenue"
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

export default RevenueInput