'use client'
import Input from "./Input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios'
import { toast } from "sonner"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { set } from "mongoose"
import DeleteColumnModal from "./DeleteColumnModal"


const getCustomFieldInput = (fieldValue, columnId, setIsRefreshTrigger) => (
        {
            accessorKey: fieldValue,
            size: 170,
            header: ({ column }) => {

                console.log(column)
              return (
                <DeleteColumnModal header={fieldValue} columnId={columnId} setIsRefreshTrigger={setIsRefreshTrigger} />

              )
            },
            cell: ({ row }) => {
                const fieldId = row?.original?.fieldId ?? null
                const supabase = createClientComponentClient();
                const accountId = row?.original?.id
              const salesforceAuth = row?.original?.salesforceAuth
              const account = row?.original
                const value = row?.getValue(fieldValue) ?? ''
                const FormSchema = z.object({
                    [fieldValue]: z
                    .string()
                    .max(160, {
                      message: "name must not be longer than 30 characters.",
                    })})


                const SetUseForm = () => {
  
                    const form = useForm({
                      resolver: zodResolver(FormSchema),
                      defaultValues: {[fieldValue]: value}
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
                    const dirtyFields = form.formState?.dirtyFields
                    if(Object.keys(data).length > 0) {
                        if(Object.keys(dirtyFields).length > 0) {
                    for(const thing in data) {
                        if(dirtyFields[thing]) {
                            body[thing] = data[thing]
                        }
                    }
                    // const newBody = JSON.stringify(body);
                    // const res = await axios.patch(salesforceURL, newBody, options);
            

                    if(fieldId) {
                        const {error} = await supabase
                        .from("custom_column_fields")
                        .update({
                          value: body[fieldValue]
                        })
                        .eq("id", fieldId);
                        console.log(error)
                      } else {
                        const {error} = await supabase.from("custom_column_fields").insert([
                            {
                              column_def_id: columnId,
                              account_id: accountId,
                              value: body[fieldValue]
                            },
                          ]);
                          console.log(error)
                      }
                    

               
                  }
                }
                    if(Object.keys(dirtyFields).length > 0) {
                      setter(data[fieldValue])
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
        <Input onSubmit={onSubmit} name={fieldValue} value={value} form={form}/>
              )
            }
          }
    )

export default getCustomFieldInput