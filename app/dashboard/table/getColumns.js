'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios'
import { toast } from "sonner"
import checkError from "@/app/utils/checkError"
import GenericTextArea from "./components/GenericTextArea"
import GenericPicklist from "./components/GenericPicklist"
import GenericBoolean from "./components/GenericBoolean"
import GenericReadonly from "./components/GenericReadonly"
import GenericCurrencyInput from "./components/GenericCurrencyInput"
import GenericInt from "./components/GenericInt"
import GenericDatePicker from "./components/GenericDatePicker"
import {formatISO} from 'date-fns'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowDownIcon, ArrowUpIcon} from "lucide-react"



const getColumns = (currentUser, fields) => {

    const columns = fields?.filter(field => field.is_active === true)?.map(field => {
        return {
          accessorKey: field.name,
          size: 170,
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {field.label}
                {column.getIsSorted() === "asc" && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                {column.getIsSorted() === "desc" && <ArrowDownIcon className="ml-2 h-4 w-4" />}
                {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            )
          },
          cell: ({ row }) => {
            const salesforceAuth = currentUser?.salesforceAuth
            const account = row?.original
              const value = row.getValue(field.name)

              const BoolSchema = z.object({
                [field.name]: z
                  .boolean()
                  .optional()
              })
              const StringSchema = z.object({
                  [field.name]: z
                    .string()
                    .optional()
                })

                const IntSchema = z.object({
                  [field.name]: z
                    .number()
                    .int()
                    .nonnegative()
                    .optional()
                })
                const DoubleSchema = z.object({
                    [field.name]: z
                      .number()
                      .nonnegative()
                      .optional()
                  })
                  const PhoneSchema = z.object({
                    [field.name]: z
                      .number()
                      .nonnegative()
                      .optional()
                  })
                  const DateSchema = z.object({
                    [field.name]: z
                      .date()
                      .optional()
                  })
                  const DateTimeSchema = z.object({
                    [field.name]: z
                      .string()
                      .datetime()
                      .optional()
                  })
                  const EmailSchema = z.object({
                    [field.name]: z
                      .string()
                      .email({ message: "Invalid email address" })
                      .optional()
                  })

                  const getSchema = () => {
                    switch (field?.type) {
                      case 'boolean':
                        return BoolSchema
                      case 'double':
                        return DoubleSchema
                        case 'email':
                        return EmailSchema
                        case 'datetime':
                        return DateTimeSchema
                        case 'date':
                        return DateSchema
                        case 'int':
                        return IntSchema
              
                      default:
                        return StringSchema
                    }
                  }

                  let ThisSchema = getSchema()

                const SetUseForm = () => {
                  const form = useForm({
                    resolver: zodResolver(ThisSchema),
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
                        if(field?.type === 'date') {
                          let current = data[field.name]
                          data[field.name] = formatISO(current, { representation: 'date' })
                        }
                  const newBody = JSON.stringify(data);
                  let res
                  try {
                    
                    res = await axios.patch(salesforceURL, newBody, options);
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
                    console.log(res)
                  } catch (error) {
                    checkError(error)
                    console.log(error)
                    toast("The following error occurred",
                    {
                      description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                          <code className="text-white">{error?.response?.data[0]?.message}</code>
                        </pre>
                      ),
                    })
                  }
                }
              
          }
          if(field?.updateable === false) {
            return <GenericReadonly isDate={field?.type === 'date' || field?.type === 'datetime'} value={value} />
          } else if(field?.type === 'picklist') {
            return (<GenericPicklist onSubmit={onSubmit} currentField={field} value={value} form={form}/>)
          } else if(field?.type === 'boolean') {
            return <GenericBoolean onSubmit={onSubmit} currentField={field} value={value} form={form}/>
          } else if(field?.type === 'currency') {
            return <GenericCurrencyInput onSubmit={onSubmit} currentField={field} value={value} form={form}/>
          } else if(field?.type === 'double' || field?.type === 'int' || field.type === 'phone') {
            return <GenericInt onSubmit={onSubmit} currentField={field} value={value} form={form}/>
          } else if(field?.type === 'date') {
            return <GenericDatePicker onSubmit={onSubmit} currentField={field} value={value} form={form}/>
          } else {
            return <GenericTextArea onSubmit={onSubmit} currentField={field} value={value} form={form}/>  
          }
          }
        }
    
    })

    // add color checkbox
    columns.unshift(  {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },)


    console.log(columns)
    return columns
}

export default getColumns