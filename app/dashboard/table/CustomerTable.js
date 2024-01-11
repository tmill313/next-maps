
'use client'
import {useEffect, useState, useContext} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getCustomerData from './getCustomerData';
import Spinner from '@/components/Spinner';
import CurrentUserContext from '@/app/contexts/CurrentUserContext';




const CustomerTable = ({isOpen, setIsOpen, filters, setFilters}) => {

    const [data, setData] = useState([])
    const [customColumns, setCustomColumns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshTrigger, setIsRefreshTrigger] = useState(false)
    const supabase = createClientComponentClient();
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setIsLoading(true)
        getCustomerData(setData, setIsLoading, setCustomColumns, setIsRefreshTrigger, filters)
        console.log(data)
    }, [supabase, isRefreshTrigger, filters])
    const newColumns = [...columns, ...customColumns]

    return (
        <div>
            <Spinner isLoading={isLoading} />
            <DataTable filters={filters} setFilters={setFilters} setIsRefreshTrigger={setIsRefreshTrigger} isOpen={isOpen} setIsOpen={setIsOpen} columns={newColumns} data={data} />
        </div>
      )
    }


export default CustomerTable