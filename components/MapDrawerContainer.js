'use client'
import {useEffect, useState} from 'react'
import MapDrawer from "./MapDrawer";
import axios from "axios";


const MapDrawerContainer = ({setIsOpen, isOpen, id, salesforceAuth}) => {
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
    const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/${id}`

    useEffect(() => {
        if(id) {
        setIsLoading(true)
        getAccount()
        }
    }, [id])

    const getAccount = async () => {
        const res = await axios.get(salesforceURL, options);
        await setCurrentAccount(res?.data)
        setIsLoading(false)
        console.log(res)
    }
if(isLoading) return null
    return(
        <MapDrawer salesforceAuth={salesforceAuth} setIsOpen={setIsOpen} currentAccount={currentAccount} isOpen={isOpen} />
    )
}

export default MapDrawerContainer