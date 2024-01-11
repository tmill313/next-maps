'use client'
import {useState, useEffect} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomerTable from './CustomerTable';
import PartnerTable from './PartnerTable';
import ProspectTable from './ProspectTable';
import FilterDrawer from './filterDrawer/FilterDrawer';



const DemoPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({})
  const [reloadTrigger, setReloadTrigger] = useState(false)
useEffect(() => {
  console.log(filters)
}, [filters])


  return (
    <div className="container w-100% mx-auto py-10">
    <Tabs defaultValue="prospect" className="w-100%">
  <TabsList>
    <TabsTrigger value="prospect">Prospects</TabsTrigger>
    <TabsTrigger value="customer">Customers</TabsTrigger>
    <TabsTrigger value="partners">Partners</TabsTrigger>
  </TabsList>
  <TabsContent value="prospect"><ProspectTable filters={filters} setFilters={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
  <TabsContent value="customer"><CustomerTable filters={filters} setFilters={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
  <TabsContent value="partners"><PartnerTable filters={filters} setFilters={setFilters}  isOpen={isOpen} setIsOpen={setIsOpen} /></TabsContent>
</Tabs>
      <FilterDrawer setReloadTrigger={setReloadTrigger} filters={filters} setFilters={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default DemoPage
