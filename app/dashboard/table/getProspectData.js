'use client'
import checkError from "@/app/utils/checkError";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import getCustomFieldInput from "./components/CustomFieldInput";


const getProspectData = async (setData, setIsLoading, customColumns, setCustomColumns, setIsRefreshTrigger, filters) => {
    const supabase = createClientComponentClient();


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
          
          let PROSPECT_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,Industry,BillingAddress,NumberOfEmployees,AnnualRevenue,LastActivityDate,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Title,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities),+(Select+Id+FROM+Notes)+FROM+Account+WHERE+ownerId='${salesforceAuth?.user_id}'+AND+Id+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=false)+AND+Id+NOT+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=true)`

          if(filters.color) {
            const { data: colorRows } = await supabase
            .from("row_colors")
            .select(`account_id`)
            .eq("color_hex", filters?.color)
            console.log(colorRows)
            if(colorRows) {
              let accountString = colorRows.map(account => `'${account?.account_id}'`).join(', ')
              console.log(accountString)
              let stringAddition = `+AND+Id+IN(${accountString})`
              PROSPECT_URL = `${PROSPECT_URL}${stringAddition}`

            }
          }
          if(filters.industry) {
            PROSPECT_URL = `${PROSPECT_URL}+AND+Industry='${filters.industry}'`
          }

          const options = {
              headers: {
                Authorization: `Bearer ${salesforceAuth?.access_token}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
              },
            };

  
        let records
        let pickList
          try {
            const industryUrl = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/describe`
              const res = await axios.get(PROSPECT_URL, options);
              console.log(res.data)
              let industryRes = await axios.get(industryUrl, options);
              let industryPick = industryRes?.data?.fields.filter(ind => ind.name === 'Industry')[0]?.picklistValues.filter(item => item.active === true)
              pickList = industryPick
              records = res?.data?.records

          } catch (error) {
            checkError(error)
              console.log(error)
          }

          let tempHeaders = []
          let tempFields = {}
          try {
            const { data: columnData } = await supabase
            .from("custom_column_defs")
            .select(`*, custom_column_fields(*)`)
            .eq("profile_id", profileData?.id)
            const newColumns = columnData?.map(column => {
              let fields = column?.custom_column_fields?.map(field => {
                tempFields[`${field?.account_id}-${column?.column_name}`] = {
                  columnName: column?.column_name,
                  fieldValue: field?.value,
                  fieldId: field?.id,
                  accountId: field?.account_id
                }
              })              
              tempHeaders.push(column?.column_name)
              return getCustomFieldInput(column?.column_name, column?.id, setIsRefreshTrigger)
            })
             setCustomColumns(newColumns)


          } catch (error) {
              console.log(error)
          }

          const colorInfo = {}
          try {
            const { data: colorData } = await supabase
            .from("row_colors")
            .select(`*`)
            .eq("profile_id", profileData?.id)
            const newColumns = colorData?.map(color => {
              console.log(color)
                colorInfo[`${color?.account_id}`] = {
                  rowColor: color?.color_hex,
                  accountId: color?.account_id
                }           
            })


          } catch (error) {
              console.log(error)
          }


          const newData = records?.map(item => {
            const contact = item?.Contacts.records[0]
            let tempObj = {
                Name: item.Name,
                id: item.Id,
                amount: 100,
                status: 'pending', 
                salesforceAuth,
                BillingAddress: item?.BillingAddress,
                pickList: pickList,
                Industry: item?.Industry,
                NumberOfEmployees: item?.NumberOfEmployees,
                AnnualRevenue: item?.AnnualRevenue,
                LastActivityDate: item?.LastActivityDate,
                Notes: item?.Notes,
                ContactName: {
                  firstName: contact?.FirstName,
                  lastName: contact?.LastName
                },
                MobilePhone: contact?.MobilePhone,
                ContactTitle: contact?.Title,
                ContactEmail: contact?.Email,
                ContactId: contact?.Id,
                Owner: item?.Owner,
                rowColor: colorInfo[item?.Id]
            }
            tempHeaders.map(header => {
              tempObj[header] = tempFields[`${item?.Id}-${header}`]?.fieldValue
            })
            return tempObj
        })
        console.log(newData)
await setData(newData)
setIsLoading(false)

}

export default getProspectData