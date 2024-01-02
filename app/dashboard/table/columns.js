'use client'
import {useState, useEffect} from 'react'
import { MoreHorizontal, ArrowUpDown} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input'
import PickList from '@/components/PickList'


export const columns = [
    {
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
      },


      {
        accessorKey: "Name",
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
              

            const SetForm = () => {
  
                const options = {
                  headers: {
                    Authorization: `Bearer ${salesforceAuth?.access_token}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                  },
                };
              const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.id}`
                
              const onSubmit = async (data) => {
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
                  let areFieldsDirty = Object.keys(form.formState?.dirtyFields).length > 0
              return(
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/3 h-80 space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit about yourself"
                              className="resize-none h-56"
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
                </Form>
              )
            }
  
  
  
  
     
          return (
  <Popover>
    <PopoverTrigger asChild>
      <span>{name}</span>
  
    </PopoverTrigger>
    <PopoverContent>
  <SetForm />
    </PopoverContent>
  </Popover>
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
          const SetForm = () => {
              

              const options = {
                headers: {
                  Authorization: `Bearer ${salesforceAuth?.access_token}`,
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  'Access-Control-Allow-Headers': '*',
                },
              };
            const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.id}`
              
            const onSubmit = async (data) => {
              let body = {}
              const dirtyFields = form.formState?.defaultValues.industry !== data?.industry
              if(dirtyFields) {
              body = data
              const newBody = JSON.stringify(body);
              const res = await axios.patch(salesforceURL, newBody, options);
              name = data?.industry
            
          }
              if(dirtyFields) {
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

            return (<PickList 
              areFieldsDirty={areFieldsDirty}  
              salesforceURL={salesforceURL}
              options={options}
              onSubmit={onSubmit}
              pickList={pickList}
              form={form}
              />)
          }




   
        return (
<Popover>
  <PopoverTrigger asChild>
    <span>{name}</span>

  </PopoverTrigger>
  <PopoverContent>
<SetForm />
  </PopoverContent>
</Popover>
        )
      }
    },



    {
        accessorKey: "BillingAddress",
        header: ({ column }) => {
          return (
            <div>Address</div>
          )
        },
        cell: ({ row }) => {
          const salesforceAuth = row?.original?.salesforceAuth


          const account = row?.original
            const billingAddress = row.getValue("BillingAddress")
            const SetForm = () => {
              const FormSchema = z.object({
                  billingStreet: z
                    .string()
                    .max(160, {
                      message: "name must not be longer than 30 characters.",
                    }),
                    billingState: z
                    .string()
                    .max(160, {
                      message: "name must not be longer than 30 characters.",
                    }),
                    billingCity: z
                    .string()
                    .max(160, {
                      message: "name must not be longer than 30 characters.",
                    }),
                })
                
                  const form = useForm({
                    resolver: zodResolver(FormSchema),
                    defaultValues: {
                        billingStreet: billingAddress?.street,
                        billingCity: billingAddress?.city,
                        billingState: billingAddress?.state
                    }
                })
  
                const options = {
                  headers: {
                    Authorization: `Bearer ${salesforceAuth?.access_token}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                  },
                };
              const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.id}`
                
                  const onSubmit = async (data) => {
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
                let areFieldsDirty = Object.keys(form.formState?.dirtyFields).length > 0
              return(
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/3 h-84 space-y-6">
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
                      <FormField
                      control={form.control}
                      name="billingState"
                      render={({ field }) => (
                        <FormItem>
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
                                      <div className='flex justify-between'>
                    <Button variant='secondary'>Cancel</Button>
                    <Button disabled={!areFieldsDirty} type="submit">Save</Button>
                  </div>
                  </form>
                </Form>
              )
            }
  
  
  
  
     
          return (
  <Popover>
    <PopoverTrigger asChild>
      <span className='text-ellipsis overflow-hidden'>{`${billingAddress?.street ?? ''}, ${billingAddress?.city ?? ''}, ${billingAddress?.state ?? ''} `}</span>
  
    </PopoverTrigger>
    <PopoverContent>
  <SetForm />
    </PopoverContent>
  </Popover>
          )
        }
      },


    {
      accessorKey: "AnnualRevenue",
          header: () => <div className="text-right">Revenue</div>,
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
        
 
        const SetForm = () => {

            const options = {
              headers: {
                Authorization: `Bearer ${salesforceAuth?.access_token}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
              },
            };
          const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.id}`
            
          const onSubmit = async (data) => {
            let body = {}
            const dirtyFields = form.formState?.defaultValues.annualRevenue !== parseInt(data?.annualRevenue)
            console.log(form.formState?.defaultValues.annualRevenue)
            console.log(data?.annualRevenue)
            if(dirtyFields) {
            body = data
            const newBody = JSON.stringify(body);
            const res = await axios.patch(salesforceURL, newBody, options);
            name = data?.industry
          
        }
            if(dirtyFields) {
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
            let areFieldsDirty = form.formState?.defaultValues.annualRevenue !== parseInt(form.getValues('annualRevenue'))
          return(
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/3 h-84 space-y-6">
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
            </Form>
          )
        }




 
      return (
<Popover>
<PopoverTrigger asChild>
<div className="text-right font-medium">{!!amount ? formatted : 'N/A'}</div>
</PopoverTrigger>
<PopoverContent>
<SetForm />
</PopoverContent>
</Popover>
      )
 
    },
    },





    {
      accessorKey: "NumberOfEmployees",
          header: () => <div className="text-right">Employees</div>,
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
        

        const SetForm = () => {

            const options = {
              headers: {
                Authorization: `Bearer ${salesforceAuth?.access_token}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
              },
            };
          const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.id}`
            
          const onSubmit = async (data) => {
            let body = {}
            const dirtyFields = form.formState?.defaultValues.numberOfEmployees !== parseInt(data?.numberOfEmployees)
            if(dirtyFields) {
            body = data
            const newBody = JSON.stringify(body);
            const res = await axios.patch(salesforceURL, newBody, options);
            name = data?.industry
          
        }
            if(dirtyFields) {
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
            let areFieldsDirty = form.formState?.defaultValues.numberOfEmployees !== parseInt(form.getValues('numberOfEmployees'))
          return(
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/3 h-84 space-y-6">
                <FormField
                  control={form.control}
                  name="numberOfEmployees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employees</FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                          placeholder="Employees"
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
            </Form>
          )
        }




 
      return (
<Popover>
<PopoverTrigger asChild>
<div className="text-right font-medium">{!!employees ? employees : 'N/A'}</div>
</PopoverTrigger>
<PopoverContent>
<SetForm />
</PopoverContent>
</Popover>
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