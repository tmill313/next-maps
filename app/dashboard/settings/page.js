'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FieldSettings from "./FieldSettings";

export default function Settings() {

  return (
    <div className="container w-100% mx-auto py-10">
    <Tabs defaultValue="fields" className="w-100%">
  <TabsList>
    <TabsTrigger value="fields">Fields</TabsTrigger>
    {/* <TabsTrigger value="customer">Customers</TabsTrigger>
    <TabsTrigger value="partners">Partners</TabsTrigger> */}
  </TabsList>
  <TabsContent value="fields"><FieldSettings /></TabsContent>
  {/* <TabsContent value="customer"><CustomerTable filters={filters} setFilters={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
  <TabsContent value="partners"><PartnerTable filters={filters} setFilters={setFilters}  isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent> */}
</Tabs>
    </div>
  );
}