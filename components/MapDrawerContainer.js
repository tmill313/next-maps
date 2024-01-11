'use client'
import {useEffect, useState} from 'react'
import MapDrawer from "./MapDrawer";
import axios from "axios";
import checkError from '@/app/utils/checkError';


const MapDrawerContainer = ({setIsOpen, setCurrentPoint, isOpen, id, salesforceAuth}) => {
    console.log(id)
    const [currentAccount, setCurrentAccount] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const options = {
        headers: {
          Authorization: `Bearer ${salesforceAuth?.access_token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Headers': '*',
        },
      };
      const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,Phone,Industry,BillingAddress,NumberOfEmployees,AnnualRevenue,LastActivityDate,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Title,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities),+(Select+Id+FROM+Notes)+FROM+Account+WHERE+Id='${id}'`

    // const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${id}`

    useEffect(() => {
        if(id) {
        setIsLoading(true)
        getAccount()
        }
    }, [id])

    const getAccount = async () => {
        try {
        const res = await axios.get(salesforceURL, options);
        await setCurrentAccount(res?.data?.records[0])
        setIsLoading(false)
        console.log(res)
        } catch(error) {
            checkError(Error)
            console.log(error)
        }
    }
if(isLoading) return null
    return(
        <MapDrawer setCurrentPoint={setCurrentPoint} salesforceAuth={salesforceAuth} setIsOpen={setIsOpen} currentAccount={currentAccount} isOpen={isOpen} />
    )
}

export default MapDrawerContainer