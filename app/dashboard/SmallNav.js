"use client"

import {useState, useEffect} from "react"

import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const obj = {
    "/dashboard": "Dashboard",
    "/dashboard/map": "Map",
    "/dashboard/table": "Table"
}

export default function SmallNav() {
  const [path, setPath] = useState()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  console.log(path)
useEffect(() => {
    setPath(pathname)
    setOpen(false)
}, [pathname])
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="outline">{obj[path]}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={path}>
            <Link href="/dashboard" legacyBehavior passHref>
                <DropdownMenuRadioItem value="/dashboard">Dashboard</DropdownMenuRadioItem>
            </Link>
            <Link href="/dashboard/map" legacyBehavior passHref>
                <DropdownMenuRadioItem value="/dashboard/map">Map</DropdownMenuRadioItem>
            </Link>
            <Link href="/dashboard/table" legacyBehavior passHref>
                <DropdownMenuRadioItem value="/dashboard/table">Table</DropdownMenuRadioItem>
             </Link>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
