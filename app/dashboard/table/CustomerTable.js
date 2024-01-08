
'use client'
import {useEffect, useState} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getCustomerData from './getCustomerData';
import Spinner from '@/components/Spinner';




const CustomerTable = ({isOpen, setIsOpen}) => {

    const [data, setData] = useState([])
    const [customColumns, setCustomColumns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshTrigger, setIsRefreshTrigger] = useState(false)
    const supabase = createClientComponentClient();
 
    console.log('here')
    useEffect(() => {
        setIsLoading(true)
        getCustomerData(setData, setIsLoading, setCustomColumns, setIsRefreshTrigger)

    }, [supabase, isRefreshTrigger])
    const newColumns = [...columns, ...customColumns]

    return (
        <div>
            <Spinner isLoading={isLoading} />
            <DataTable setIsRefreshTrigger={setIsRefreshTrigger} isOpen={isOpen} setIsOpen={setIsOpen} columns={newColumns} data={data} />
        </div>
      )
    }


export default CustomerTable