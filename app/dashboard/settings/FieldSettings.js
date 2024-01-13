"use client"
import {useState, useEffect, useContext} from 'react'
import { Button } from "@/components/ui/button"
import CurrentUserContext from '@/app/contexts/CurrentUserContext';
import axios from 'axios'
import FieldSettingsForm from './FieldSettingsForm'
import { Input } from '@/components/ui/input'
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";




const getInputs = (array, profileId) => {

    let dbValues = []

    let initialValues = {};

    let validationsFields = {};

    array.map(field => {
    
        initialValues[field.name] = field.is_active !== undefined && field.is_active !== null ? field.is_active : false

        validationsFields[field.name] = z.boolean()

        dbValues.push({
            profile_id: profileId,
            is_active: false,
            type: field.type,
            name: field.name,
            label: field.label,
            picklist_values: field.picklistValues
        })
    }
    )
    return {
        validationSchema: z.object({ ...validationsFields }),
        initialValues: initialValues,
        dbValues: dbValues
    };
}



const FieldSettings = () => {
    const [fields, setFields] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('')
    const currentUser = useContext(CurrentUserContext);
    const salesforceAuth = currentUser?.salesforceAuth
    const profile = currentUser?.profile
    const supabase = createClientComponentClient()
    console.log(currentUser)

    
    const options = {
        headers: {
          Authorization: `Bearer ${salesforceAuth?.access_token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Headers': '*',
        },
      };
      const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/describe`

      const getFields = async () => {
        let res = await axios.get(salesforceURL, options);
        let accountFields = res?.data?.fields
        await setFields(accountFields)
      }


    useEffect(() => {
        setIsLoading(true)
        if(!currentUser.salesforceAuth) return
        if(currentUser?.fields.length > 0) {
            setFields(currentUser?.fields)
        } else {
        getFields()
        }
        setIsLoading(false)
    }, [currentUser])
    
    console.log(fields)
    const formVals = getInputs(fields, profile?.id)

    const syncFields = async () => {
        setIsLoading(true)
        getFields()
        setIsLoading(false)
        const { data: fieldData, error: supabaseError } = await supabase
        .from('salesforce_fields')
        .select('name')
        .eq('profile_id', profile?.id)
        console.log(fieldData)
        if(fieldData?.length < 1) {
            const { data, error } = await supabase
            .from('salesforce_fields')
            .insert(formVals['dbValues'])
            .select()
        } else {
            console.log('yoooo')
            let names = fieldData.map(field => field.name)
            console.log(names)

            let newArray = fields.filter(field => names.indexOf(field.name) === -1)
            console.log(newArray)
        }
    }


  if(isLoading) return null

  return (
    <div className='flex flex-col'>
        <div className='flex justify-between my-6'>
            <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder='Filter fields' className='w-4/12'/>
            <Button onClick={syncFields}>Sync</Button>
        </div>
    <FieldSettingsForm 
    {...formVals}
    profileId={profile?.id}
    fields={fields.filter(d => filter === '' || d.label.toLowerCase().includes(filter.toLowerCase()))}
    />
    </div>
  )
}


export default FieldSettings