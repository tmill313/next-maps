'use client'
import { useContext, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FieldSettings from "./FieldSettings";
import CurrentUserContext from '@/app/contexts/CurrentUserContext';

export default function Settings() {
  const currentUser = useContext(CurrentUserContext);
console.log(currentUser)
if(!currentUser) return null
return (
    <div className="container w-100% mx-auto py-10">
    <Tabs defaultValue="fields" className="w-100%">
  <TabsList>
    <TabsTrigger value="fields">Fields</TabsTrigger>
    {/* <TabsTrigger value="customer">Customers</TabsTrigger>
    <TabsTrigger value="partners">Partners</TabsTrigger> */}
  </TabsList>
  <TabsContent value="fields"><FieldSettings currentUser={currentUser} /></TabsContent>
  {/* <TabsContent value="customer"><CustomerTable filters={filters} setFilters={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
  <TabsContent value="partners"><PartnerTable filters={filters} setFilters={setFilters}  isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent> */}
</Tabs>
    </div>
  );
}