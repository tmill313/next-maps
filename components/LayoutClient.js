"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Crisp } from "crisp-sdk-web";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner"
import { Tooltip } from "react-tooltip";
import config from "@/config";
import CurrentUserContext from "@/app/contexts/CurrentUserContext";
import axios from 'axios'
import checkError from "@/app/utils/checkError";

// Crisp customer chat support:
// This component is separated from ClientLayout because it needs to be wrapped with <SessionProvider> to use useSession() hook
const CrispChat = () => {
  const pathname = usePathname();

  const supabase = createClientComponentClient();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [salesforceAuth, setSalesforceAuth] = useState(null);

  // This is used to get the user data from Supabase Auth (if logged in) => user ID is used to identify users in Crisp
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setData(session.user);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (config?.crisp?.id) {
      // Set up Crisp
      Crisp.configure(config.crisp.id);

      // (Optional) If onlyShowOnRoutes array is not empty in config.js file, Crisp will be hidden on the routes in the array.
      // Use <AppButtonSupport> instead to show it (user clicks on the button to show Crisp—it cleans the UI)
      if (
        config.crisp.onlyShowOnRoutes &&
        !config.crisp.onlyShowOnRoutes?.includes(pathname)
      ) {
        Crisp.chat.hide();
        Crisp.chat.onChatClosed(() => {
          Crisp.chat.hide();
        });
      }
    }
  }, [pathname]);

  // Add User Unique ID to Crisp to easily identify users when reaching support (optional)
  useEffect(() => {
    if (data?.user && config?.crisp?.id) {
      Crisp.session.setData({ userId: data.user?.id });
    }
  }, [data]);

  return null;
};

// All the client wrappers are here (they can't be in server components)
// 1. NextTopLoader: Show a progress bar at the top when navigating between pages
// 2. Toaster: Show Success/Error messages anywhere from the app with toast()
// 3. Tooltip: Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content=""
// 4. CrispChat: Set Crisp customer chat support (see above)
const ClientLayout = ({ children }) => {
  const supabase = createClientComponentClient();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [fields, setFields] = useState(null)
  const [company, setCompany] = useState(null)
  const [salesforceAuth, setSalesforceAuth] = useState(null);
  const [industryPicklist, setIndustryPicklist] = useState([])
  const [refresh, triggerRefresh] = useState(false)

  // This is used to get the user data from Supabase Auth (if logged in) => user ID is used to identify users in Crisp
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      let user = session?.user

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


      const { data: fieldData } = await supabase
      .from("salesforce_fields")
      .select(`*`)
      .eq("company_id", profileData?.company_id)

      const { data: companyData } = await supabase
      .from("companies")
      .select(`*`)
      .eq("id", profileData?.company_id)

      const options = {
        headers: {
          Authorization: `Bearer ${salesforceData?.access_token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Headers': '*',
        },
      };
      let industryRes
      const industryUrl = `${salesforceData?.instance_url}/services/data/v59.0/sobjects/Account/describe`
      try {
      industryRes = await axios.get(industryUrl, options);
      } catch (error) {
        checkError(error)
        console.log(error)
      }
      let industryPick = industryRes?.data?.fields.filter(ind => ind.name === 'Industry')[0]?.picklistValues.filter(item => item.active === true)
        
        setIndustryPicklist([...industryPick])
        setData(session?.user);
        setProfile(profileData);
        setSalesforceAuth(salesforceData);
        setFields(fieldData)
        setCompany(companyData)
    };
    getUser();
  }, []);
  return (
    <>
      {/* Show a progress bar at the top when navigating between pages */}
      <NextTopLoader color={config.colors.main} showSpinner={false} />

      {/* Content inside app/page.js files  */}
      <CurrentUserContext.Provider
      value={{
        profile,
        data,
        salesforceAuth,
        industryPicklist,
        fields,
        company,
        setFields
      }}
      >
      {children}
      </CurrentUserContext.Provider>
      {/* Show Success/Error messages anywhere from the app with toast() */}
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />

      {/* Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content="" */}
      <Tooltip
        id="tooltip"
        className="z-[60] !opacity-100 max-w-sm shadow-lg"
      />

      {/* Set Crisp customer chat support */}
      <CrispChat />
    </>
  );
};

export default ClientLayout;
