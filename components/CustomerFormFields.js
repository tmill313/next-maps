
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

// owner: ownerid, industry: Industry, address: BillingAddress, employees: NumberOfEmployees, locations: NumberOfLocations__c, revenue: AnnualRevenue, contact name, contact phone, contact email

const CustomerFormFields = () => {
    return(
        <div>
            {/* <FormField
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
            /> */}
        </div>
    )
}
export default CustomerFormFields