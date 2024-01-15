"use client"
import { useState, useContext, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import {
    Sheet,
    SheetContent,
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
import CurrentUserContext from "@/app/contexts/CurrentUserContext"
import FilterPicklist from "./FilterPicklist"




const FilterDrawer = ({isOpen, setIsOpen, filters, setFilters}) => {
  const [color, setColor] = useState(null)
  const [isPopOpen, setIsPopOpen] = useState(false)
  const [isIndustryOpen, setIsIndustryOpen] = useState(false)
  const currentUser = useContext(CurrentUserContext);
  const fields = currentUser?.fields?.filter(item => item.is_active === true && item.type === 'picklist')
  const [filteredFields, setFilteredFields] = useState(fields)



  useEffect(() => {
    if(currentUser.fields < 1) return 
    setFilteredFields(fields)
  }, [currentUser])


  const onSubmit = (data) => {
    let tempObj = {}
    for( const key in data) {
      const dirtyFields = form.formState?.defaultValues[key] !== data[key]
      if(dirtyFields) {
        tempObj[key] = data[key]
      }
    }
    const clone = structuredClone(tempObj);
    setFilters(clone)
}




  const getTempValues = () => {
    
  let tempValues = {
    color: '',
    industry: ''
  }
  filteredFields?.map(item => {
        tempValues[item?.name] = ''
  })

  return tempValues
  }

  const getTempSchema = () => {
    
    let tempSchema = {
      color: z.string().optional(),
      industry: z.string().optional(),
    }
    filteredFields?.map(item => {
      tempSchema[item?.name] = z.string().optional()
    })
  
    return tempSchema
    }


    const FormSchema = z.object({...getTempSchema()})
    
    const form = useForm({
      resolver: zodResolver(FormSchema),
      defaultValues: {
          ...getTempValues()
      }
    })

    if(!filteredFields) return null

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
    {filteredFields?.map(field => (
      <FilterPicklist key={field?.name} label={field?.label} name={field?.name} form={form} picklist={field?.picklist_values} />
    ))}
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