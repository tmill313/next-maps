
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

//   Owner: OwnerId, tier: AccountTier? if setup?, stage: stage of account or opportunity on account?, industry: Industry, amount: amount of what?, close date: close date on opp?, address: BillingAddress, employees: NumberOfEmployees, location: NumberOfLocations, revenue: AnnualRevenue, contact name, contact phone, contact email
// last activity date: LastActivityDate - read only, next step date: custom? read only?, next step: NextStep, ae notes, sdr notes, manager notes

const ProspectFormFields = () => {
    return(
        <div>
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
        </div>
    )
}
export default ProspectFormFields