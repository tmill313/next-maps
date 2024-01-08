import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner"
import { Trash2, AlertTriangle} from "lucide-react"
import { set } from "mongoose"






const DeleteColumnModal = ({header, columnId, setIsRefreshTrigger}) => {
    const [isOpen, setIsOpen] = useState(false)
    const supabase = createClientComponentClient();
    const handleDeleteClick = async () => {  
        const { error } = await supabase
        .from('custom_column_defs')
        .delete()
        .eq('id', columnId)
        if(!error) {
        setIsOpen(false)
            toast("You deleted the following column:",
            {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{header}</code>
                </pre>
              ),
            })
            setIsRefreshTrigger(prevState => !prevState)
        }
    }
    return (
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
           <Button
                 variant="ghost"
                >
                {header}
                 <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className='flex items-center'><AlertTriangle size={36} color="#eed202" /><div className="ml-2">Warning!</div></DialogTitle>
            </DialogHeader>
              <DialogDescription>
                All fields associated with this column will be deleted. Are you sure you want to delete this column and all associated fields?
              </DialogDescription>

            <DialogFooter>
                <Button onClick={() => setIsOpen(false)} variant='secondary'>Cancel</Button>
              <Button onClick={handleDeleteClick} variant='destructive'>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

}

export default DeleteColumnModal