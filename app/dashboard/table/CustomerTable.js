
'use client'
import {useEffect, useState, useContext} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getCustomerData from './getCustomerData';
import Spinner from '@/components/Spinner';
import CurrentUserContext from '@/app/contexts/CurrentUserContext';
import getColumns from './getColumns';




const CustomerTable = ({isOpen, setIsOpen, filters, setFilters}) => {

    const [data, setData] = useState([])
    const [customColumns, setCustomColumns] = useState([])
    const [ testColumns, setTestColumns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshTrigger, setIsRefreshTrigger] = useState(false)
    const supabase = createClientComponentClient();
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setIsLoading(true)
        if(!currentUser?.fields) return
        console.log(currentUser)
        const newColumns = getColumns(currentUser, currentUser?.fields)
        setTestColumns(newColumns)
        getCustomerData(setData, setIsLoading, setCustomColumns, setIsRefreshTrigger, filters, currentUser)
        console.log(data)
    }, [supabase, isRefreshTrigger, filters])
    const newColumns = [...columns, ...customColumns]

    return (
        <div>
            <Spinner isLoading={isLoading} />
            <DataTable filters={filters} setFilters={setFilters} setIsRefreshTrigger={setIsRefreshTrigger} isOpen={isOpen} setIsOpen={setIsOpen} columns={testColumns} data={data} />
        </div>
      )
    }


export default CustomerTable