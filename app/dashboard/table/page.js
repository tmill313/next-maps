'use client'
import {useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomerTable from './CustomerTable';
import PartnerTable from './PartnerTable';
import ProspectTable from './ProspectTable';
import FilterDrawer from './filterDrawer/FilterDrawer';



const DemoPage = () => {
  const [isOpen, setIsOpen] = useState(false)


  return (
    <div className="container w-100% mx-auto py-10">
    <Tabs defaultValue="prospect" className="w-100%">
  <TabsList>
    <TabsTrigger value="prospect">Prospects</TabsTrigger>
    <TabsTrigger value="customer">Customers</TabsTrigger>
    <TabsTrigger value="partners">Partners</TabsTrigger>
  </TabsList>
  <TabsContent value="prospect"><ProspectTable isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
  <TabsContent value="customer"><CustomerTable isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
  <TabsContent value="partners"><PartnerTable  isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
</Tabs>
      <FilterDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default DemoPage
