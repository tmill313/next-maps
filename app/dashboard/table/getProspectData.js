import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

const getProspectData = async (setData, setIsLoading) => {
    const supabase = createClientComponentClient();

    console.log('here')

          const { loading: userLoading, data } = await supabase.auth.getUser()
          let user = data?.user
    
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

        const PROSPECT_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,Industry,BillingAddress,NumberOfEmployees,AnnualRevenue,LastActivityDate,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Title,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities),+(Select+Id+FROM+Notes)+FROM+Account+WHERE+ownerId='005Hs00000ER1uBIAT'+AND+Id+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=false)+AND+Id+NOT+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=true)`
  
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
              console.log(error)
          }
          const newData = records?.map(item => {
            const contact = item?.Contacts.records[0]
            return ({
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
                Owner: item?.Owner
            }
        )})
        console.log(newData)
await setData(newData)
setIsLoading(false)

}

export default getProspectData