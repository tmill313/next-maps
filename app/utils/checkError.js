'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import config from "@/config";
const INVALID_SESSION_ID = 401
const NOT_FOUND = 404

const salesforceLoginURL = `https://login.salesforce.com/services/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SALESFORCE_CONSUMER_KEY}&redirect_uri=${config.baseURL}/api/salesforce&response_type=code`
const checkError = async (error) => {

    console.log(error.response.status)
    const errorCode = error?.response?.status
    if(errorCode === NOT_FOUND) {
        console.log('404')
        const accessToken = error?.config?.headers?.Authorization.split(' ')[1]
        console.log(typeof accessToken)
        if(accessToken === 'undefined') {
            window.location.assign(salesforceLoginURL)
        } else {
            console.error('there is a token, but it is a 401')
        }
    }
    if(errorCode === INVALID_SESSION_ID) {
        const supabase = createClientComponentClient();
        // try to refresh
        const accessToken = error?.config?.headers?.Authorization.split(' ')[1]
        console.log(accessToken)
        
const { error: supabaseError } = await supabase
.from('salesforce_auth')
.delete()
.eq('access_token', accessToken)
if(!supabaseError) {
    window.location.assign(salesforceLoginURL)
}
        
    }
}

export default checkError