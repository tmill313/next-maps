'use client'
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import Link from "next/link"
import ButtonAccount from "@/components/ButtonAccount";
import ButtonCheckout from "@/components/ButtonCheckout";
import ButtonGradient from "@/components/ButtonGradient";
import config from "@/config";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GoogleMap from "@/components/GoogleMap";
import CurrentUserContext from "../contexts/CurrentUserContext";


export const dynamic = "force-dynamic";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
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

      setUser(user)
      setProfile(profileData)
      setSalesforceAuth(salesforceData)
      setIsLoading(false)
    };

    getUser();
  }, [supabase]);

console.log(profile)
  
  
if(isLoading) return

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">👋 Hey {user?.user_metadata?.name.split(' ')[0]}!</h1>
        <h1 className="text-xl md:text-2xl font-bold">It looks like you are all caught up! 🥳</h1>


      {!profile && <div>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Subscribe to get access:
        <ButtonCheckout
          mode="subscription"
          priceId={config.stripe.plans[0].priceId}
        />
        </h1>
        </div>
        }
      </section>
    </main>
  );
}

