import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { custom } from "zod";
import getCustomFieldInput from "./components/CustomFieldInput";
import CustomFieldInput from "./components/CustomFieldInput";

const getCustomerData = async (setData, setIsLoading, setCustomColumns, setIsRefreshTrigger) => {
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

          const options = {
              headers: {
                Authorization: `Bearer ${salesforceAuth?.access_token}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
              },
            };

        const CUSTOMER_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,BillingAddress,Industry,NumberOfEmployees,AnnualRevenue,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities)+FROM+Account+WHERE+ownerId='${salesforceData?.user_id}'+AND+Id+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=true)`
  
        let records
        let pickList
          try {
            const industryUrl = `${salesforceAuth?.instance_url}/services/data/v59.0/sobjects/Account/describe`
              const res = await axios.get(CUSTOMER_URL, options);
              let industryRes = await axios.get(industryUrl, options);
              let industryPick = industryRes?.data?.fields.filter(ind => ind.name === 'Industry')[0]?.picklistValues.filter(item => item.active === true)
              pickList = industryPick
              records = res?.data?.records

          } catch (error) {
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
                MobilePhone: contact?.MobilePhone,
                ContactTitle: contact?.Title,
                ContactEmail: contact?.Email,
                ContactId: contact?.Id,
                ContactName: {
                  firstName: contact?.FirstName,
                  lastName: contact?.LastName
                },
                Owner: item?.Owner
            }
            tempHeaders.map(header => {
              tempObj[header] = tempFields[`${item?.Id}-${header}`]?.fieldValue
            })
            return tempObj
        })

await setData(newData)
setIsLoading(false)

}

export default getCustomerData