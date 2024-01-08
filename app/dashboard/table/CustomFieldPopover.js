'use client'
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Trash2, AlertTriangle} from "lucide-react"




const CustomFieldPopover = ({setIsRefreshTrigger}) => {
    const supabase = createClientComponentClient();

    const [name, setName] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    
        const handleSaveClick = async () => {
          const { loading: userLoading, data } = await supabase.auth.getUser()
          let user = data?.user
    
          const { data: profileData } = await supabase
          .from("profiles")
          .select(`*`)
          .eq("id", user?.id)
          .single();
    
          const { data: columnData } = await supabase
          .from("custom_column_defs")
          .select("*")
          .eq("column_name", name)
          .maybeSingle();
      
          if (!columnData) {
              const {error} = await supabase.from("custom_column_defs").insert([
                {
                  profile_id: profileData.id,
                  column_name: name
                },
              ]);
              if(!error) {
                setName('')
                toast("You added the following column:",
                {
                  description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                      <code className="text-white">{name}</code>
                    </pre>
                  ),
                })
                setIsOpen(false)
                setIsRefreshTrigger(prevState => !prevState)
              }
            } else {
                toast(<div className="flex items-center"><AlertTriangle color="#eed202" /><div className="ml-2">A column with the name "{name}" already exists.</div></div>)
                console.error(`A column with the name "${name}" already exists`)
            }
 

  
        };
        
return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
        <Button className='mr-4' variant='secondary'>
      Add custom column
      </Button>
  
    </PopoverTrigger>
    <PopoverContent className='h-40 flex flex-col justify-between'>
        <div>
                          <Label>Column name</Label>
                            <Input
                              placeholder="Column name"
                              className="resize-none mt-1"
                              onChange={(e) => setName(e.target.value)}
                              value={name}
                            />
                            </div>
                    <div className='flex justify-between'>
                      <Button onClick={() => setIsOpen(false)} variant='secondary'>Cancel</Button>
                      <Button onClick={handleSaveClick} disabled={name.length < 1}>Save</Button>
                    </div>
              
    </PopoverContent>
  </Popover>
)
}

export default CustomFieldPopover