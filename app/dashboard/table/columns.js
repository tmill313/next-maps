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


export const columns = [

      {
        accessorKey: "Owner",
        header: ({ column }) => {
          return (
            <div>Owner</div>
          )
        },
        cell: ({ row }) => {
            const owner = row.getValue("Owner")?.Name
          return (
      <span className='max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden'>{owner}</span>
          )
        }
      },


      {
        accessorKey: "Name",
        size: 170,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const salesforceAuth = row?.original?.salesforceAuth
          const account = row?.original
            const name = row.getValue("Name")
            const FormSchema = z.object({
                name: z
                  .string()
                  .max(160, {
                    message: "name must not be longer than 30 characters.",
                  }),
              })
              const SetUseForm = () => {
                const form = useForm({
                  resolver: zodResolver(FormSchema),
                  defaultValues: {
                    name: name
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
                let body = {}
                const dirtyFields = form.formState?.dirtyFields
                if(Object.keys(data).length > 0) {
                    if(Object.keys(dirtyFields).length > 0) {
                for(const thing in data) {
                    if(dirtyFields[thing]) {
                        body[thing] = data[thing]
                    }
                }
                const newBody = JSON.stringify(body);
                const res = await axios.patch(salesforceURL, newBody, options);
              }
            }
                if(Object.keys(dirtyFields).length > 0) {
                  setter(data["name"])
                  setIsOpen(false)
                toast("You changed the following values:",
                {
                  description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                      <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                    </pre>
                  ),
                })
              }
        }
  return (
    <NameInput onSubmit={onSubmit} name={name} form={form}/>
          )
        }
      },



    {
      accessorKey: "Industry",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Industry
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const salesforceAuth = row?.original?.salesforceAuth
        const account = row?.original
        const pickList = row?.original?.pickList
          let industry = row.getValue("Industry")
          const FormSchema = z.object({
              industry: z
                .string()
                .max(160, {
                  message: "name must not be longer than 30 characters.",
                }),
            })


        const SetUseForm = () => {
          const form = useForm({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                industry: industry
            }
        })

          return form
        }
        const form = SetUseForm()
        let name = form.getValues('industry') 
              

              const options = {
                headers: {
                  Authorization: `Bearer ${salesforceAuth?.access_token}`,
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  'Access-Control-Allow-Headers': '*',
                },
              };
            const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.id}`
              
            const onSubmit = async (data, setIndustry, setOpen) => {
              let body = {}
              const dirtyFields = form.formState?.defaultValues.industry !== data?.industry
              if(dirtyFields) {
              body = data
              const newBody = JSON.stringify(body);
              const res = await axios.patch(salesforceURL, newBody, options);

            
          }
              if(dirtyFields) {
                setIndustry(data?.industry)
                setOpen(false)
              toast("You changed the following values:",
              {
                description: (
                  <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                  </pre>
                ),
              })
            }
        }
                let areFieldsDirty = true




   
        return (

          <PickList 
              areFieldsDirty={areFieldsDirty}  
              salesforceURL={salesforceURL}
              options={options}
              onSubmit={onSubmit}
              pickList={pickList}
              form={form}
              name={name}
              />

                )
      },
    },



    {
        accessorKey: "BillingAddress",
        size: 400,
          enableResizing: true,
        header: ({ column }) => {
          return (
            <div>Address</div>
          )
        },
        cell: ({ row }) => {
          const salesforceAuth = row?.original?.salesforceAuth


          const account = row?.original
            const billingAddress = row.getValue("BillingAddress")

                const SetUseForm = () => {
                  const FormSchema = z.object({
                    billingStreet: z.string().optional(),
                      billingState: z.string().optional(),
                      billingCity: z.string().optional(),
                      billingPostalCode: z.string().optional(),
                  })
                  const form = useForm({
                    resolver: zodResolver(FormSchema),
                    defaultValues: {
                        billingStreet: billingAddress?.street ?? '',
                        billingCity: billingAddress?.city ?? '',
                        billingState: billingAddress?.state ?? '',
                        billingPostalCode: billingAddress?.postalCode ?? ''
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
                          let body = {}
                          let defaultValues = form?.formState?.defaultValues
                          const dirtyFields = form.formState?.dirtyFields
                          if(Object.keys(data).length > 0) {
                              if(Object.keys(dirtyFields).length > 0) {
                          for(const thing in data) {
                              if(dirtyFields[thing]) {
                                  defaultValues[thing] = data[thing]
                                  body[thing] = data[thing]
                              }
                          }
                          const newBody = JSON.stringify(body);
                          const res = await axios.patch(salesforceURL, newBody, options);
                        }
                      }
                          if(Object.keys(dirtyFields).length > 0) {
                            console.log(defaultValues)
                            setter(`${defaultValues?.['billingStreet']}, ${defaultValues?.['billingCity']}, ${defaultValues?.['billingState']} ${defaultValues?.['billingPostalCode']}`)
                            setIsOpen(false)
                          toast("You changed the following values:",
                          {
                            description: (
                              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                              </pre>
                            ),
                          })
                        }
                  }
               

  const billingString = `${billingAddress?.street ?? ''}, ${billingAddress?.city ?? ''}, ${billingAddress?.state ?? ''} ${billingAddress?.billingPostalCode ?? ''} `
  
  
     
          return (
            <AddressForm form={form} onSubmit={onSubmit} name={billingString} />
          )
        }
      },


    {
      accessorKey: "AnnualRevenue",
          header: () => <div className="text-left">Revenue</div>,
    cell: ({ row }) => {
      const regularAmount = row?.getValue("AnnualRevenue") ?? ''
      const amount = parseFloat(row.getValue("AnnualRevenue"))
      const formatted = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0, 
        minimumFractionDigits: 0, 
        style: "currency",
        currency: "USD",
      }).format(amount)
      const salesforceAuth = row?.original?.salesforceAuth


      const account = row?.original

      const FormSchema = z.object({
          annualRevenue: z
          .string()
          .max(160),
        })

        const SetUseForm = () => {
          const form = useForm({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                annualRevenue: regularAmount,
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
            let body = {}
            const dirtyFields = form.formState?.defaultValues.annualRevenue !== parseInt(data?.annualRevenue)
            console.log(form.formState?.defaultValues.annualRevenue)
            console.log(data?.annualRevenue)
            if(dirtyFields) {
            body = data
            const newBody = JSON.stringify(body);
            const res = await axios.patch(salesforceURL, newBody, options);
          
        }
            if(dirtyFields) {
              setter(data['annualRevenue'])
              setIsOpen(false)
            toast("You changed the following values:",
            {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                </pre>
              ),
            })
          }
    }




 
      return (
        <RevenueInput name={formatted} onSubmit={onSubmit} form={form} />
      )
 
    },
    },





    {
      accessorKey: "NumberOfEmployees",
          header: () => <div className="text-left">Employees</div>,
    cell: ({ row }) => {
      let number = row?.getValue("NumberOfEmployees") ?? ''
      const employees = number ? parseInt(number).toLocaleString('en-US', {maximumFractionDigits:2}) : number
      const salesforceAuth = row?.original?.salesforceAuth


      const account = row?.original

      const FormSchema = z.object({
          numberOfEmployees: z
          .string()
          .max(160),
        })

        const SetUseForm = () => {
          const form = useForm({
            resolver: zodResolver(FormSchema),
            defaultValues: {
              numberOfEmployees: number,
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
            let body = {}
            const dirtyFields = form.formState?.defaultValues.numberOfEmployees !== parseInt(data?.numberOfEmployees)
            if(dirtyFields) {
            body = data
            const newBody = JSON.stringify(body);
            const res = await axios.patch(salesforceURL, newBody, options);
          
        }
            if(dirtyFields) {
              setter(data['numberOfEmployees'])
              setIsOpen(false)
            toast("You changed the following values:",
            {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                </pre>
              ),
            })
          }
    }




 
      return (
        <EmployeesInput form={form} onSubmit={onSubmit} name={employees} />
      )
 
 
    },
    },

    {
      accessorKey: "ContactName",
          header: () => <div className="text-left">Contact Name</div>,
    cell: ({ row }) => {
      const contactId = row?.original?.ContactId
      let firstName = row?.getValue("ContactName")?.firstName ?? ''
      let lastName = row?.getValue("ContactName")?.lastName ?? ''
      const salesforceAuth = row?.original?.salesforceAuth
      const FormSchema = z.object({
          firstName: z
          .string()
          .max(160),
          lastName: z
          .string()
          .max(160),
        })

        const SetUseForm = () => {
          const form = useForm({
            resolver: zodResolver(FormSchema),
            defaultValues: {
              firstName: firstName,
              lastName: lastName
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
          const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Contact/${contactId}`
            
          const onSubmit = async (data, setter, setIsOpen) => {
            let body = {}
            let defaultValues = form?.formState?.defaultValues
            const dirtyFields = form.formState?.dirtyFields
            if(Object.keys(data).length > 0) {
                if(Object.keys(dirtyFields).length > 0) {
            for(const thing in data) {
                if(dirtyFields[thing]) {
                    defaultValues[thing] = data[thing]
                    body[thing] = data[thing]
                }
            }
          }

        }
        if(dirtyFields) {
              const newBody = JSON.stringify(body);
              const res = await axios.patch(salesforceURL, newBody, options);
              setter(`${defaultValues?.firstName} ${defaultValues?.lastName}`)
              setIsOpen(false)
            toast("You changed the following values:",
            {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                </pre>
              ),
            })
          }
    }
      let contactName = `${firstName} ${lastName}`



 
      return (
        <ContactNameInput form={form} name={contactName} onSubmit={onSubmit} />

      )
 
 
    },
    },


    {
      accessorKey: "ContactEmail",
      size: 200,
          header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => {
      const contactId = row?.original?.ContactId
      let email = row?.getValue("ContactEmail") ?? ''
      const salesforceAuth = row?.original?.salesforceAuth


      const account = row?.original

      const FormSchema = z.object({
          email: z
          .string()
          .max(160),
        })

        const SetUseForm = () => {
          const form = useForm({
            resolver: zodResolver(FormSchema),
            defaultValues: {
              email: email,
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
          const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Contact/${contactId}`
            
          const onSubmit = async (data, setter, setIsOpen) => {
            let body = {}
            const dirtyFields = form.formState?.defaultValues.numberOfEmployees !== parseInt(data?.numberOfEmployees)
            if(dirtyFields) {
            body = data
            const newBody = JSON.stringify(body);
            const res = await axios.patch(salesforceURL, newBody, options);
          
        }
            if(dirtyFields) {
              setter(data["email"])
              setIsOpen(false)
            toast("You changed the following values:",
            {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                </pre>
              ),
            })
          }
    }





 
      return (
        <EmailInput form={form} onSubmit={onSubmit} name={email} />
      )
 
 
    },
    },



    {
      accessorKey: "MobilePhone",
          header: () => <div className="text-left">Phone</div>,
    cell: ({ row }) => {
      const contactId = row?.original?.ContactId
      let mobilePhone = row?.getValue("MobilePhone") ?? ''
      const salesforceAuth = row?.original?.salesforceAuth


      const account = row?.original

      const FormSchema = z.object({
          mobilePhone: z
          .string()
          .max(160),
        })

        const SetUseForm = () => {
          const form = useForm({
            resolver: zodResolver(FormSchema),
            defaultValues: {
              mobilePhone: mobilePhone,
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
          const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Contact/${contactId}`
            
          const onSubmit = async (data, setter, setIsOpen) => {
            let body = {}
            const dirtyFields = form.formState?.defaultValues.numberOfEmployees !== parseInt(data?.numberOfEmployees)
            if(dirtyFields) {
            body = data
            const newBody = JSON.stringify(body);
            const res = await axios.patch(salesforceURL, newBody, options);
          
        }
            if(dirtyFields) {
              setter(data['mobilePhone'])
              setIsOpen(false)
            toast("You changed the following values:",
            {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(body, null, 2)}</code>
                </pre>
              ),
            })
          }
    }


 
      return (
<PhoneInput form={form} onSubmit={onSubmit} name={mobilePhone}/>
      )
 
 
    },
    },
    
    {id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
},
  ]