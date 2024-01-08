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
            <div className="h-3 w-3 bg-[#87986a] rounded-full mr-1"/>
            Partners
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={customers}
            onCheckedChange={setCustomers}
            onSelect={e => e.preventDefault()}
          >
            <div className="h-3 w-3 bg-[#2196f3] rounded-full mr-1"/>
            Customers
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={prospects}
            onCheckedChange={setProspects}
            onSelect={e => e.preventDefault()}
          >
            <div className="h-3 w-3 bg-[#EA4335] rounded-full mr-1"/>
            Prospects
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  export default MapMenu