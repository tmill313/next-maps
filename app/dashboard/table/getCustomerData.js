import checkError from "@/app/utils/checkError";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import getCustomFieldInput from "./components/CustomFieldInput";

const getCustomerData = async (setData, setIsLoading, setCustomColumns, setIsRefreshTrigger, filters, currentUser) => {
    const supabase = createClientComponentClient();

          let profileData = currentUser?.profile
          let salesforceAuth = currentUser?.salesforceAuth
          const fields = currentUser?.fields?.filter(field => field.is_active === true)?.map(item => item.name)
          let fieldString = fields?.join(',') ?? ''
          let idString = `Id`
          let joinedString = `${idString},${fieldString},`
          if(fields.length < 1) {
            joinedString = `${idString},`
          }
    

          let CUSTOMER_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+${joinedString}(Select+Id,MobilePhone,FirstName,LastName,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities)+FROM+Account+WHERE+ownerId='${salesforceAuth?.user_id}'+AND+Id+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=true)`

          for(const key in filters) {
            if(filters[key] !== undefined) {
            if(key === 'color') {
              const { data: colorRows } = await supabase
              .from("row_colors")
              .select(`account_id`)
              .eq("color_hex", filters?.color)
              console.log(colorRows)
              if(colorRows) {
                let accountString = colorRows.map(account => `'${account?.account_id}'`).join(', ')
                console.log(accountString)
                let stringAddition = `+AND+Id+IN(${accountString})`
                CUSTOMER_URL = `${CUSTOMER_URL}${stringAddition}`
                console.log(CUSTOMER_URL)
  
              }
            } else if(key === 'industry') {
              CUSTOMER_URL = `${CUSTOMER_URL}+AND+Industry='${filters.industry}'`
            } else {
              const newString = `+AND+${key}='${filters[key]}'`
              CUSTOMER_URL = `${CUSTOMER_URL}${newString}`
            }}
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
        let pickList = currentUser?.industryPicklist
          try {
              const res = await axios.get(CUSTOMER_URL, options);
              console.log(res)
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
                id: item.Id,
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
            fields?.map(field => {
              tempObj[field] = item[field]
            })
            return tempObj
        })
console.log(newData)
await setData(newData)
setIsLoading(false)

}

export default getCustomerData