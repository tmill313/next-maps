import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import getCustomFieldInput from "./components/CustomFieldInput";
import axios from "axios";
import checkError from "@/app/utils/checkError";

const getPartnerData = async (setData, setIsLoading, customColumns, setCustomColumns, setIsRefreshTrigger, filters, currentUser) => {
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
          let PARTNER_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+${joinedString}(Select+Id,MobilePhone,FirstName,LastName,Email+FROM+Contacts)+FROM+Account+WHERE+Id+IN(SELECT+AccountFromId+FROM+Partner)`

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
              PARTNER_URL = `${PARTNER_URL}${stringAddition}`

            }
          }
          if(filters.industry) {
            PARTNER_URL = `${PARTNER_URL}+AND+Industry='${filters.industry}'`
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
              const res = await axios.get(PARTNER_URL, options);
              console.log(res.data)
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
                id: item.Id,
                salesforceAuth,
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
            fields?.map(field => {
              tempObj[field] = item[field]
            })
            return tempObj
        })
        console.log(newData)
await setData(newData)
setIsLoading(false)

}

export default getPartnerData