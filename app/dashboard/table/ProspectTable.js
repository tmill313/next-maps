
'use client'
import {useEffect, useState} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getProspectData from './getProspectData';
import Spinner from '@/components/Spinner';




const ProspectTable = () => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClientComponentClient();
 
    console.log('here')
    useEffect(() => {
        setIsLoading(true)
        getProspectData(setData, setIsLoading)

    }, [supabase])

    return (
        <div>
            <Spinner isLoading={isLoading} />
            <DataTable columns={columns} data={data} />
        </div>
      )
    }


export default ProspectTable