'use client'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    } from "@/components/ui/navigation-menu"
    import Link from "next/link"
import ProfileDrowdown from "./ProfileDrowdown"
import SmallNav from "./SmallNav"
  
  const Navigation = () => {
    return (

              <div className="flex-col flex">
              <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <div className="hidden md:block">
<NavigationMenu>
  <NavigationMenuList>
  <NavigationMenuItem>
          <Link href="/dashboard/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/map" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Map
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/table" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Table
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
</div>
<div className="md:hidden">
  <SmallNav />
</div>
<div className="ml-auto flex items-center space-x-4">
<ProfileDrowdown />
</div>
</div>
        </div>
        </div>
    )
  }
  export default Navigation