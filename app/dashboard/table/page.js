'use client'
import {useEffect, useState} from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

const ALL_ACCOUNTS = 'accounts'
const CUSTOMERS = 'customers'
const PROSPECTS = 'prospects'


const DemoPage = () => {
    const [data, setData] = useState([])
    const [pointType, setPointType] = useState(ALL_ACCOUNTS)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClientComponentClient();

    const getData = async () => {
        console.log('here')
    
              const { loading: userLoading, data } = await supabase.auth.getUser()
              let user = data?.user
        
              const { data: profileData } = await supabase
              .from("profiles")
              .select(`*`)
              .eq("id", user?.id)
              .single();
        
              const { data: salesforceData } = await supabase
              .from("salesforce_auth")
              .select(`*`)
              .eq("id", user?.id)
              .single();
        
              let salesforceAuth = salesforceData
              console.log(data)
    
              const options = {
                  headers: {
                    Authorization: `Bearer ${salesforceAuth?.access_token}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                  },
                };
            const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query?q=SELECT+id,name,billingAddress+FROM+Account`
            const customerURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,accountid+FROM+Opportunity+WHERE+isWon=true`
            const prospectsURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,accountid+FROM+Opportunity+WHERE+isWon=true`
      
            let records
              try {
                  if(pointType === ALL_ACCOUNTS) {
                  const res = await axios.get(salesforceURL, options);
                  records = res?.data?.records
                  }
      
                  if( pointType === CUSTOMERS) {
                  const res = await axios.get(customerURL, options);
                  const newSet = new Set()
                  res?.data?.records?.map(opp => {
                      if(opp?.AccountId) {
                      newSet.add(opp.AccountId)
                      }
                  })
                  let newArr = [...newSet]
                  let joined = newArr.join(',')
                  console.log(joined)
                  const collectionURL = `${salesforceAuth?.instance_url}/services/data/v59.0/composite/sobjects/Account?ids=${joined}&fields=id,name,billingAddress`
                  const collectionRes = await axios.get(collectionURL, options);
                  records = collectionRes.data
                  }
      
                  if(pointType === PROSPECTS) {
                      const accountRes = await axios.get(salesforceURL, options);
                      const res = await axios.get(prospectsURL, options);
                      console.log(res)
                      let newArr = []
                      const newSet = new Set()
                      res?.data?.records?.map(opp => {
                          if(opp?.AccountId) {
                          newSet.add(opp.AccountId)
                          }
                      })
                      accountRes?.data?.records?.map(account => {
                          if(!newSet.has(account?.Id)) {
                          newArr.push(account.Id)
                          }
                      })
                      let joined = newArr.join(',')
                      console.log(newSet)
                      console.log(newArr)
                      console.log(joined)
                      const collectionURL = `${salesforceAuth?.instance_url}/services/data/v59.0/composite/sobjects/Account?ids=${joined}&fields=id,name,billingAddress`
                      const collectionRes = await axios.get(collectionURL, options);
                      records = collectionRes.data
                  }
                  console.log(records)
    
              } catch (error) {
                  console.log(error)
              }
              const newData = records?.map(item => (
                {
                    Name: item.Name,
                    id: item.Id,
                    amount: 100,
                    status: 'pending'
                }
            ))
    await setData(newData)
    setIsLoading(false)
      
    //   return [
    //     {
    //       id: "728ed52f",
    //       amount: 100,
    //       status: "pending",
    //       email: "m@example.com",
    //     },
    //     {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "b@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "x@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "s@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "m@example.com",
    //       },
    //       {
    //         id: "728ed52f",
    //         amount: 100,
    //         status: "pending",
    //         email: "a@example.com",
    //       },
    //     // ...
    //   ]
    }

    console.log('here')
    useEffect(() => {
        setIsLoading(true)
        getData()

    }, [supabase])
if(isLoading) return null
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default DemoPage
