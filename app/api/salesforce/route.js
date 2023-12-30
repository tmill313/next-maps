import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import config from "@/config";
import qs from 'qs';
import axios from "axios";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function GET(req) {
    const thisConfig = config
    try {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        const requestUrl = new URL(req.url);
        const tempCode = requestUrl.searchParams.get("code");
        const code = decodeURIComponent(tempCode)
        if(!code) {
            return NextResponse.json(
                {
                  error:
                    "Auth code is missing",
                },
                { status: 400 }
              );
        }
    
        const {
          data: { session },
        } = await supabase.auth.getSession();

            // Search for a profile with unique ID equals to the user session ID (in table called 'profiles')
    const { data } = await supabase
    .from("salesforce_auth")
    .select("*")
    .eq("id", session?.user?.id)
    .single();

    if (!data) {
        await supabase.from("salesforce_auth").insert([
          {
            id: session.user.id,
            auth_code: code
          },
        ]);
      }

let thisData = qs.stringify({
  'code': code,
  'grant_type': 'authorization_code',
  'Content_type': 'application/x-www-form-urlencoded',
  'client_id': process.env.NEXT_PUBLIC_SALESFORCE_CONSUMER_KEY,
  'client_secret': process.env.NEXT_PUBLIC_SALESFORCE_CONSUMER_SECRET,
  'redirect_uri': `${thisConfig.baseURL}/api/salesforce`
});


let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://login.salesforce.com/services/oauth2/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'Cookie': 'BrowserId=wGR2SqIbEe6HWqd8LP5WFA; CookieConsentPolicy=0:0; LSKey-c$CookieConsentPolicy=0:0'
  },
  data : thisData
};
console.log(config)

axios.post('https://login.salesforce.com/services/oauth2/token', thisData, {  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'Cookie': 'BrowserId=wGR2SqIbEe6HWqd8LP5WFA; CookieConsentPolicy=0:0; LSKey-c$CookieConsentPolicy=0:0'
  }})
.then( async (response) => {
    const data = response.data
  console.log(data);
  const {error} = await supabase
  .from("salesforce_auth")
  .update({
    access_token: data.access_token,
    instance_url: data.instance_url
  })
  .eq("id", session?.user?.id);
  console.log(error)
})
.catch((error) => {
  console.log(error);
});

return NextResponse.redirect(requestUrl.origin + thisConfig.auth.callbackUrl);
} catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
}

}