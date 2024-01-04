'use client'
import {useEffect, useState} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios";
import getPartnerData from './getPartnerData';
import CustomerTable from './CustomerTable';
import PartnerTable from './PartnerTable';
import ProspectTable from './ProspectTable';



const DemoPage = () => {

  return (
    <div className="container w-100% mx-auto py-10">
        <Tabs defaultValue="customer" className="w-100%">
  <TabsList>
    <TabsTrigger value="customer">Customers</TabsTrigger>
    <TabsTrigger value="prospect">Prospects</TabsTrigger>
    <TabsTrigger value="partners">Partners</TabsTrigger>
  </TabsList>
  <TabsContent value="customer"><CustomerTable /></TabsContent>
  <TabsContent value="prospect"><ProspectTable /></TabsContent>
  <TabsContent value="partners"><PartnerTable /></TabsContent>
</Tabs>
      
    </div>
  )
}

export default DemoPage
