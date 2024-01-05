'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios'
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"



const MapDrawerForm = ({account, setCurrentPoint, salesforceAuth, setIsOpen}) => {
    console.log(account)
    const FormSchema = z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        billingStreet: z.string().optional(),
        billingCity: z.string().optional(),
        billingState: z.string().optional(),
        lastActivityDate: z.string().optional(),
        billingPostalCode: z.string().optional(),
        ownerName: z.string().optional(),
        industry: z.string().optional(),
        annualRevenue: z.string().optional(),
        numberOfEmployees: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        mobilePhone: z.string().optional(),
      })

      const contact = account?.Contacts.records[0]

      const formatted = account?.AnnualRevenue ? parseInt(account?.AnnualRevenue).toLocaleString('en-US', {maximumFractionDigits:2}) : 0

      const employees = account?.NumberOfEmployees ? parseInt(account?.NumberOfEmployees).toLocaleString('en-US', {maximumFractionDigits:2}) : 0

        const form = useForm({
          resolver: zodResolver(FormSchema),
          defaultValues: {
            name: account?.Name ?? '',
            phone: account?.Phone ?? '',
            billingStreet: account?.BillingAddress?.street ?? '',
            billingCity: account?.BillingAddress?.city ?? '',
            billingState: account?.BillingAddress?.state ?? '',
            billingPostalCode: account?.BillingAddress?.postalCode ?? '',
            lastActivityDate: account?.LastActivityDate ?? '',
            ownerName: account?.Owner?.Name ?? '',
            industry: account?.Industry ?? '',
            annualRevenue: formatted ?? '',
            numberOfEmployees: employees ?? '',
            firstName: contact?.FirstName ?? '',
            lastName: contact?.LastName ?? '',
            email: contact?.Email ?? '',
            mobilePhone: contact?.MobilePhone ?? '',
          },
        })

        const options = {
            headers: {
              Authorization: `Bearer ${salesforceAuth?.access_token}`,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Headers': '*',
            },
          };

          const contactId = contact?.Id
        const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.Id}`
        const contactURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Contact/${contactId}`
    

        async function onSubmit(data) {
          let contactArray = ['firstName', 'lastName', 'email', 'mobilePhone']
            let contactBody ={}
            let body = {}
            console.log(Object.keys(data).length > 0)
            if(Object.keys(data).length > 0) {
                const dirtyFields = form.formState?.dirtyFields
            for(const thing in data) {
                if(dirtyFields[thing]) {
                  if(contactArray?.includes(thing)) {
                    contactBody[thing] = data[thing]
                  } else {
                    body[thing] = data[thing]
                  }
                }
            }

            const newContactBody = JSON.stringify(contactBody)
            const newBody = JSON.stringify(body);
            console.log(newBody)
            const res = await axios.patch(salesforceURL, newBody, options);
            console.log()
            let combinedObj = body
            if(Object.keys(contactBody).length > 0) {
              const contactRes = await axios.patch(contactURL, newContactBody, options);
              combinedObj = {...body, ...contactBody}
            }
            setIsOpen(false)
            setCurrentPoint(null)
            console.log(res)
            toast("You changed the following values:",
            {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(combinedObj, null, 2)}</code>
                </pre>
              ),
            })
          }
        }


          if(!account) return null
return (
 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between items-start h-full w-full space-y-6">
        <div className="flex w-full">
        <div className="*:my-3 flex-1 mr-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                        <FormField
          control={form.control}
          name="annualRevenue"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Revenue</FormLabel>
              <FormControl>
                <Input type='number' placeholder="Revenue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                <FormField
          control={form.control}
          name="numberOfEmployees"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Employees</FormLabel>
              <FormControl>
                <Input type='number' placeholder="Employees" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="Industry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="flex-1 ml-5">
                        <FormField
                        
          control={form.control}
          name="billingStreet"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Street address</FormLabel>
              <FormControl>
                <Input placeholder="Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                <FormField
          control={form.control}
          name="billingCity"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
                                        <FormField
          control={form.control}
          name="billingState"
          render={({ field }) => (
            <FormItem className='mx-3'>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                                <FormField
          control={form.control}
          name="billingPostalCode"
          render={({ field }) => (
            <FormItem className='mx-3'>
              <FormLabel>Zip</FormLabel>
              <FormControl>
                <Input placeholder="Zip" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
                                                <FormField
          control={form.control}
          name="lastActivityDate"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Last activity date</FormLabel>
              <FormControl>
                <Input placeholder="Last activity date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                                        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input placeholder="owner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        </div>
        </div>
        <div className="w-1/2 pr-10">
        <h1 className="font-bold">Contact info</h1>
                                                <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                                <FormField
          control={form.control}
          name="mobilePhone"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Contact phone</FormLabel>
              <FormControl>
                <Input placeholder="Contact Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className='my-5 mx-3'>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        </div>
        <div className="flex justify-end fixed bottom-0 right-0 px-16 py-4 w-1/2">
        <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
    
)
}

export default MapDrawerForm