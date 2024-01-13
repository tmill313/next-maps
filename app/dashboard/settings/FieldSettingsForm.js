"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";




const FieldSettingsForm = ({fields, initialValues, validationSchema, profileId}) => {
    const supabase = createClientComponentClient()


    const form = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues: { ...initialValues }
	})

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
        }
    }
        const newBody = JSON.stringify(body);
        for (const key in body) {

            const {error} = await supabase
            .from("salesforce_fields")
            .update({
              is_active: body[key]
            })
            .eq("profile_id", profileId)
            .eq("name", key)
            console.log(error)
        }
        toast("You changed the following values:",
        {
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(body, null, 2)}</code>
            </pre>
          ),
        })
      }

    return (
        <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">Fields</h3>
              <div className="space-y-4">
                <div className="space-y-4 pb-16">
                {fields.map(accountField => {
                    return (
                        <FormField
                        key={accountField.name}
                        control={form.control}
                        name={accountField.name}
                        render={({ field }) => { 
                            return (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>{accountField.label}</FormLabel>
                              <FormDescription>
                                {accountField.type}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}}
                      />
                    )
                })}
                </div>
              </div>
            </div>
            <div className="flex justify-end fixed bottom-0 right-0 py-4 px-8 bg-white w-full border-y">
            <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
        </div>
      )
}

export default FieldSettingsForm