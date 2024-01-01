import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { Button } from "@/components/ui/button"
import MapDrawerForm from "./MapDrawerForm"

const MapDrawer = ({isOpen, currentAccount, setIsOpen, isLoading, salesforceAuth}) => {

return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>{currentAccount?.Name}</SheetTitle>
      <SheetDescription>
        Edit account info, then click save.
      </SheetDescription>
    </SheetHeader>
    {!isLoading && <MapDrawerForm salesforceAuth={salesforceAuth} setIsOpen={setIsOpen}  account={currentAccount}/>}
  </SheetContent>
</Sheet>
)

}

export default MapDrawer