import axios from "axios";
import getCustomFieldInput from "./components/CustomFieldInput";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import checkError from "@/app/utils/checkError";

const getData = async (setData, setIsLoading, setCustomColumns, setIsRefreshTrigger, salesforceRoute, salesforceAuth, profileData, pickList) => {
    const supabase = createClientComponentClient();

          const options = {
              headers: {
                Authorization: `Bearer ${salesforceAuth?.access_token}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
              },
            };

        const CUSTOMER_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,BillingAddress,Industry,NumberOfEmployees,AnnualRevenue,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities)+FROM+Account+WHERE+ownerId='${salesforceAuth?.user_id}'+AND+Id+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=true)`
  
        let records
          try {
              const res = await axios.get(salesforceRoute, options);
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
            console.log(colorInfo)
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
                Owner: item?.Owner,
                rowColor: colorInfo[item?.Id]
            }
            tempHeaders.map(header => {
              tempObj[header] = tempFields[`${item?.Id}-${header}`]?.fieldValue
            })
            console.log(tempObj)
            return tempObj
        })

await setData(newData)
setIsLoading(false)

}

export default getData