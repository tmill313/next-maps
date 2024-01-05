import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import { Button } from "@/components/ui/button"
import MapDrawerForm from "./MapDrawerForm"
import { ScrollArea } from "@/components/ui/scroll-area"
import useMediaQuery from "./hooks/useMediaQuery"

const MapDrawer = ({isOpen, currentAccount, setIsOpen, isLoading, salesforceAuth}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

return (
  isDesktop ? 
   ( <Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>
      <ScrollArea className="h-screen pb-12 px-4 pt-4">
    <SheetHeader >
      <SheetTitle>{currentAccount?.Name}</SheetTitle>
      <SheetDescription>
        Edit account info, then click save.
      </SheetDescription>
    </SheetHeader>
    {!isLoading && <MapDrawerForm salesforceAuth={salesforceAuth} setIsOpen={setIsOpen}  account={currentAccount}/>}
  </ScrollArea>
  </SheetContent>
</Sheet>)
:
(
  <Drawer shouldScaleBackground open={isOpen} onOpenChange={setIsOpen}>
  <DrawerContent className='h-3/4'>
  <ScrollArea className="h-full pb-12 px-4 pt-4">
    <DrawerHeader className="text-left">
      <DrawerTitle>{currentAccount?.Name}</DrawerTitle>
      <DrawerDescription>
      Edit account info, then click save.
      </DrawerDescription>
    </DrawerHeader>
    {!isLoading && <MapDrawerForm salesforceAuth={salesforceAuth} setIsOpen={setIsOpen}  account={currentAccount}/>}
    </ScrollArea>
  </DrawerContent>
</Drawer>
)
)

}

export default MapDrawer