"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetClose
  } from "@/components/ui/sheet"
  import {
    Form,
  } from "@/components/ui/form"
import ColorFilterDropdown from "./ColorFilterDropdown"
import IndustryDropdown from "./IndustryDropdown"



const FilterDrawer = ({isOpen, setIsOpen, filters, setFilters}) => {
  const [color, setColor] = useState(null)
  const [isPopOpen, setIsPopOpen] = useState(false)
  const [isIndustryOpen, setIsIndustryOpen] = useState(false)

  const onSubmit = (data) => {
    console.log(data)
    const clone = structuredClone(data);
    setFilters(clone)
}


    const FormSchema = z.object({
        color: z.string().optional(),
        industry: z.string().optional(),
      })
    
    
    const form = useForm({
      resolver: zodResolver(FormSchema),
      defaultValues: {
          color: color ?? ''
      }
    })

    
return(
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent className='p-4'>
    <SheetHeader className='mb-8'>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <ColorFilterDropdown setIsPopOpen={setIsPopOpen} isPopOpen={isPopOpen} form={form} />
    <IndustryDropdown form={form} isIndustryOpen={isIndustryOpen} setIsIndustryOpen={setIsIndustryOpen} />
    <SheetFooter>
      <SheetClose asChild>
        <Button type="submit">Save</Button>
      </SheetClose>
    </SheetFooter>
</form>
</Form>
  </SheetContent>
</Sheet>
)
}

export default FilterDrawer