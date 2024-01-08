import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

const FilterDrawer = ({isOpen, setIsOpen}) => {
return(
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>
    <SheetHeader >
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>
        Edit account info, then click save.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
)
}

export default FilterDrawer