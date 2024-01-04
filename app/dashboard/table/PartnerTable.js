
'use client'
import {useEffect, useState} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getPartnerData from './getPartnerData';
import Spinner from '@/components/Spinner';



const PartnerTable = () => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClientComponentClient();
 
    useEffect(() => {
        setIsLoading(true)
        getPartnerData(setData, setIsLoading)

    }, [supabase])

    return (
    <div>
        <Spinner isLoading={isLoading} />
        <DataTable columns={columns} data={data} />
    </div>
      )
    }


export default PartnerTable