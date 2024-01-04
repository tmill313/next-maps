import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

const getPartnerData = async (setData, setIsLoading) => {
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

        const PARTNER_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,Owner.Name,Owner.Id,(Select+Id,MobilePhone,Name,Email+FROM+Contacts)+FROM+Account+WHERE+Id+IN(SELECT+AccountFromId+FROM+Partner)`
  
        let records
        let pickList
          try {
              const res = await axios.get(PARTNER_URL, options);
              console.log(res.data)
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
                ContactName: contact?.Name,
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

export default getPartnerData