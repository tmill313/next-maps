'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link"
import ButtonAccount from "@/components/ButtonAccount";
import ButtonCheckout from "@/components/ButtonCheckout";
import ButtonGradient from "@/components/ButtonGradient";
import config from "@/config";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GoogleMap from "@/components/GoogleMap";


export const dynamic = "force-dynamic";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState(null);
  const [salesforceAuth, setSalesforceAuth] =useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [points, setPoints] = useState([])


  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true)
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

      setProfile(profileData)
      setSalesforceAuth(salesforceData)
      setIsLoading(false)
    };

    getUser();
  }, [supabase]);


  


 
const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query?q=SELECT+id,name,billingAddress+FROM+Account`


  const salesforceLoginURL = `https://login.salesforce.com/services/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SALESFORCE_CONSUMER_KEY}&redirect_uri=${config.baseURL}/api/salesforce&response_type=code`
  
if(isLoading) return

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
      {!profile?.has_access ? <div>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Subscribe to get access:
        </h1>

        <ButtonCheckout
          mode="subscription"
          priceId={config.stripe.plans[0].priceId}
        />
        </div>
        :
        !salesforceAuth?.access_token ? 
          <div>
          <Link href={salesforceLoginURL}>
            <ButtonGradient title='Connect Salesforce'/>
          </Link>
        </div>
      :
      <div>
        <GoogleMap points={points} setPoints={setPoints} salesforceAuth={salesforceAuth}/>
      </div>
        }
      </section>
    </main>
  );
}

