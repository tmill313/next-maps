'use client'
import { useState, useEffect } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import ButtonCheckout from "@/components/ButtonCheckout";
import config from "@/config";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GoogleMap from "@/components/GoogleMap";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);



  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user);
    };

    getUser();
  }, [supabase]);

  useEffect(() => {
    const getUser = async () => {
      console.log(user)
      const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
      setProfile(profileData)
    };
if(user) {
    getUser();
}
  }, [user]);


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
        <GoogleMap />
        }
      </section>
    </main>
  );
}
