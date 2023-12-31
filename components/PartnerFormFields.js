
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

// owner: OwnerId (need to look up owner), channel manager, address: BillingAddress, contact name: find contact with account id, contact phone, contact email

const PartnerFormFields = () => {
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
export default PartnerFormFields