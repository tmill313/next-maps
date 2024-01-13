'use client'
import { MoreHorizontal, ArrowUpDown} from "lucide-react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios'
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import PickList from '@/components/PickList'
import NameInput from './components/NameInput'
import AddressForm from './components/AddressForm'
import RevenueInput from './components/RevenueInput'
import EmployeesInput from './components/EmployeesInput'
import ContactNameInput from './components/ContactNameInput'
import EmailInput from './components/EmailInput'
import PhoneInput from './components/PhoneInput'
import { Checkbox } from "@/components/ui/checkbox"
import checkError from "@/app/utils/checkError"
import GenericInput from "./components/GenericInput"
import GenericPicklist from "./components/GenericPicklist"

const getColumns = (currentUser, fields) => {

    const columns = fields?.filter(field => field.is_active === true)?.map(field => {
      return (
        {
          accessorKey: field.name,
          size: 170,
          header: ({ column }) => {
            return (
              <span>{field.label}</span>
            )
          },
          cell: ({ row }) => {
            const salesforceAuth = currentUser?.salesforceAuth
            const account = row?.original
              const value = row.getValue(field.name)
              const FormSchema = z.object({
                  [field.name]: z
                    .string()
                    .optional()
                })
                const SetUseForm = () => {
                  const form = useForm({
                    resolver: zodResolver(FormSchema),
                    defaultValues: {
                      [field.name]: value
                    }
                  })
  
                  return form
                }
                const form = SetUseForm()
                
    
                  const options = {
                    headers: {
                      Authorization: `Bearer ${salesforceAuth?.access_token}`,
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                      'Access-Control-Allow-Headers': '*',
                    },
                  };
                const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.id}`
                  
                const onSubmit = async (data, setter, setIsOpen) => {
                  console.log(data)
                  console.log(form.formState?.defaultValues[field.name])
                  console.log(data?.[field.name])
                  const dirtyFields = form.formState?.defaultValues[field.name] !== data?.[field.name]
                      if(dirtyFields) {
                  const newBody = JSON.stringify(data);
                  let res
                  try {
                    
                    res = await axios.patch(salesforceURL, newBody, options);
                    console.log(res)
                  } catch (error) {
                    checkError(error)
                    console.log(error)
                  }
                }
              
                  if(dirtyFields) {
                    setter(data[field.name])
                    setIsOpen(false)
                  toast("You changed the following values:",
                  {
                    description: (
                      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                      </pre>
                    ),
                  })
                }
          }
          if(field?.type === 'picklist') {
            return <GenericPicklist onSubmit={onSubmit} currentField={field} value={value} form={form}/>
          } else {
            return <GenericInput onSubmit={onSubmit} currentField={field} value={value} form={form}/>
    }
          }
        },
      )
    })

    console.log(columns)
    return columns
}

export default getColumns