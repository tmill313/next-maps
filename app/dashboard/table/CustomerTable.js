
'use client'
import {useEffect, useState} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getCustomerData from './getCustomerData';
import Spinner from '@/components/Spinner';




const CustomerTable = () => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClientComponentClient();
 
    console.log('here')
    useEffect(() => {
        setIsLoading(true)
        getCustomerData(setData, setIsLoading)

    }, [supabase])
    return (
        <div>
            <Spinner isLoading={isLoading} />
            <DataTable columns={columns} data={data} />
        </div>
      )
    }


export default CustomerTable