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
  

  const MapMenu = ({accounts, setAccounts, customers, setCustomers, prospects, setProspects}) => {
    const [open, setOpen] = useState(false)

    const handleAccountClick = (e) => {
        if(!accounts) {
            setProspects(false)
            setCustomers(false)
            setAccounts(true)
        } else {
            setAccounts(false)
        }
    }
   
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="relative" variant="outline">Views</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={e => e.preventDefault()} align="start" forceMount className="w-56">
          <DropdownMenuCheckboxItem
            checked={accounts}
            onSelect={e => e.preventDefault()}
            onCheckedChange={(e) => handleAccountClick(e)}
          >
            All accounts
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={customers}
            onCheckedChange={setCustomers}
            onSelect={e => e.preventDefault()}
            disabled={accounts}
          >
            Customers
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={prospects}
            onCheckedChange={setProspects}
            onSelect={e => e.preventDefault()}
            disabled={accounts}
          >
            Prospects
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  export default MapMenu