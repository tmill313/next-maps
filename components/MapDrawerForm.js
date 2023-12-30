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
import { useToast } from "@/components/ui/use-toast"


const MapDrawerForm = ({account, salesforceAuth, setIsOpen}) => {
    console.log(account)
    const { toast } = useToast()
    const FormSchema = z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        billingStreet: z.string().optional(),
        billingCity: z.string().optional(),
        billingState: z.string().optional(),
        lastModifiedDate: z.string().optional(),
      })

        const form = useForm({
          resolver: zodResolver(FormSchema),
          defaultValues: {
            name: account?.Name ?? '',
            phone: account?.Phone ?? '',
            billingStreet: account?.BillingStreet ?? '',
            billingCity: account?.BillingCity ?? '',
            billingState: account?.BillingState ?? '',
            lastModifiedDate: account?.LastModifiedDate ?? ''
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
        const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${account?.Id}`
    

        async function onSubmit(data) {
            let body = {}
            console.log(Object.keys(data).length > 0)
            if(Object.keys(data).length > 0) {
                const dirtyFields = form.formState?.dirtyFields
            for(const thing in data) {
                if(dirtyFields[thing]) {
                    body[thing] = data[thing]
                }
            }
            const newBody = JSON.stringify(body);
            console.log(newBody)
            const res = await axios.patch(salesforceURL, newBody, options);
            setIsOpen(false)
            console.log(res)
        }
            console.log()
            toast({
              title: "You submitted the following values:",
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
              ),
            })
          }

          if(!account) return null
return (
 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                        <FormField
          control={form.control}
          name="billingStreet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street address</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                                                <FormField
          control={form.control}
          name="lastModifiedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last modified</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
    
)
}

export default MapDrawerForm