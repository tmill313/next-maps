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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true)
      const { loading: userLoading, data } = await supabase.auth.getUser()
      setUser(data.user);
    };

    getUser();
  }, [supabase]);

  useEffect(() => {
    const getUser = async () => {
      const { loading, data: profileData } = await supabase
      .from("profiles")
      .select(`*, 
      salesforce_auth!inner (
        *
      )`)
      .eq("id", user?.id)
      .single();
      setProfile(profileData)
      setIsLoading(false)
    };
if(user) {
    getUser();
}
  }, [user]);

  const options = {
    headers: {
      Authorization: `Bearer ${profile?.salesforce_auth?.access_token}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Headers': '*',
    },
  };

  const getStuff = async () => {
    try {
      
      const res = await axios.post('https://taylormiller-dev-ed.develop.my.salesforce.com/services/data/v59.0/sobjects/Opportunity', {}, options);
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }


  const salesforceLoginURL = `https://login.salesforce.com/services/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SALESFORCE_CONSUMER_KEY}&redirect_uri=http://localhost:3000/api/salesforce&response_type=code`
  
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
        !profile?.salesforce_auth?.access_token ? 
          <div>
          <Link href={salesforceLoginURL}>
            <ButtonGradient title='Connect Salesforce'/>
          </Link>
        <GoogleMap />
        </div>
      :
      <div>
        <ButtonGradient title='get stuff' onClick={() => getStuff()}/>
      </div>
        }
      </section>
    </main>
  );
}
