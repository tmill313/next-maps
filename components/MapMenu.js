"use client"

import {useState, useEffect} from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const obj = {
    "/dashboard": "Dashboard",
    "/dashboard/map": "Map",
    "/dashboard/table": "Table"
}
  

  const MapMenu = ({partners, setPartners, customers, setCustomers, prospects, setProspects}) => {
    const [open, setOpen] = useState(false)
   
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="relative" variant="outline">Views</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={e => e.preventDefault()} align="start" forceMount className="w-56">
          <DropdownMenuCheckboxItem
            checked={partners}
            onSelect={e => e.preventDefault()}
            onCheckedChange={setPartners}
          >
            Partners
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={customers}
            onCheckedChange={setCustomers}
            onSelect={e => e.preventDefault()}
          >
            Customers
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={prospects}
            onCheckedChange={setProspects}
            onSelect={e => e.preventDefault()}
          >
            Prospects
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  export default MapMenu