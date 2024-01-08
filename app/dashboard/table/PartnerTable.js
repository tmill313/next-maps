
'use client'
import {useEffect, useState} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getPartnerData from './getPartnerData';
import Spinner from '@/components/Spinner';



const PartnerTable = ({isOpen, setIsOpen}) => {

    const [data, setData] = useState([])
    const [customColumns, setCustomColumns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshTrigger, setIsRefreshTrigger] = useState(false)
    const supabase = createClientComponentClient();
 
    useEffect(() => {
        setIsLoading(true)
        getPartnerData(setData, setIsLoading, customColumns, setCustomColumns, setIsRefreshTrigger)

    }, [supabase, isRefreshTrigger])
    const newColumns = [...columns, ...customColumns]


    return (
    <div>
        <Spinner isLoading={isLoading} />
        <DataTable setIsRefreshTrigger={setIsRefreshTrigger} isOpen={isOpen} setIsOpen={setIsOpen} columns={newColumns} data={data} />
    </div>
      )
    }


export default PartnerTable