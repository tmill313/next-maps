
'use client'
import {useEffect, useState, useContext} from 'react'
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getPartnerData from './getPartnerData';
import Spinner from '@/components/Spinner';
import CurrentUserContext from '@/app/contexts/CurrentUserContext';
import getColumns from './getColumns';



const PartnerTable = ({isOpen, setIsOpen, filters, setFilters}) => {

    const [data, setData] = useState([])
    const [customColumns, setCustomColumns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [columns, setColumns] = useState([])
    const [isRefreshTrigger, setIsRefreshTrigger] = useState(false)
    const supabase = createClientComponentClient();
    const currentUser = useContext(CurrentUserContext);
 
    useEffect(() => {
        setIsLoading(true)
        if(!currentUser?.fields) return
        const newColumns = getColumns(currentUser, currentUser?.fields)
        setColumns(newColumns)
        getPartnerData(setData, setIsLoading, customColumns, setCustomColumns, setIsRefreshTrigger, filters, currentUser)

    }, [supabase, isRefreshTrigger, filters])
    const newColumns = [...columns, ...customColumns]


    return (
    <div>
        <Spinner isLoading={isLoading} />
        <DataTable setFilters={setFilters} filters={filters} setIsRefreshTrigger={setIsRefreshTrigger} isOpen={isOpen} setIsOpen={setIsOpen} columns={newColumns} data={data} />
    </div>
      )
    }


export default PartnerTable