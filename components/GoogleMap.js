'use client'
import React, {useRef, useState, useEffect} from 'react';
import {APIProvider, Map, Marker, useMap, AdvancedMarker, Pin, useAdvancedMarkerRef, useMapsLibrary} from '@vis.gl/react-google-maps';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { CalendarIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"






import axios from "axios";
import {
    setKey,
    fromAddress,
  } from "react-geocode";
import ButtonGradient from './ButtonGradient';
import MapDrawerContainer from './MapDrawerContainer';
import MapMenu from './MapMenu';
import SmallNav from '@/app/dashboard/SmallNav';
import Spinner from './Spinner';
import MapHoverBox from './MapHoverBox';

const ALL_ACCOUNTS = 'accounts'
const CUSTOMERS = 'customers'
const PROSPECTS = 'prospects'
const GoogleMap = () => {
    const [prospectPoints, setProspectPoints] = useState([])
    const [customerPoints, setCustomerPoints] = useState([])
    const [partnerPoints, setPartnerPoints] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [currentPoint, setCurrentPoint] = useState(null)
    const [salesforce, setSalesforce] = useState(null)
    const [partners, setPartners] = useState(false)
    const [customers, setCustomers] = useState(false)
    const [prospects, setProspects] = useState(true)
    const supabase = createClientComponentClient();
    const markerRef = useAdvancedMarkerRef(null);
    const mapsLib = useMapsLibrary('maps');
    
    useEffect(() => {
      if (!mapsLib) return;
  
      console.log(mapsLib)
      // ...
    }, [mapsLib]);

    useEffect(() => {
      const getUser = async () => {
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
  
        let salesforceAuth = salesforceData
        setSalesforce(salesforceAuth)
        const options = {
            headers: {
              Authorization: `Bearer ${salesforceAuth?.access_token}`,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Headers': '*',
            },
          };
          const PARTNER_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Email+FROM+Contacts)+FROM+Account+WHERE+Id+IN(SELECT+AccountFromId+FROM+Partner)`
          const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query?q=SELECT+id,name,billingAddress+FROM+Account`
      const CUSTOMER_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,BillingAddress,Industry,NumberOfEmployees,AnnualRevenue,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities)+FROM+Account+WHERE+ownerId='${salesforceData?.user_id}'+AND+Id+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=true)`
      const PROSPECT_URL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,Industry,BillingAddress,NumberOfEmployees,AnnualRevenue,LastActivityDate,Owner.Name,Owner.Id,(Select+Id,MobilePhone,FirstName,LastName,Title,Email+FROM+Contacts),+(Select+Id,isWon+FROM+Opportunities),+(Select+Id+FROM+Notes)+FROM+Account+WHERE+ownerId='${salesforceData?.user_id}'+AND+Id+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=false)+AND+Id+NOT+IN(SELECT+AccountId+FROM+Opportunity+WHERE+isWon=true)`

        try {
            setKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
            if(partners) {
            const res = await axios.get(PARTNER_URL, options);
            getPoints(res?.data?.records, setPartnerPoints)
            }

            if( customers) {
            const res = await axios.get(CUSTOMER_URL, options);
            console.log(res)
            getPoints(res.data.records, setCustomerPoints)

            }

            if(prospects) {
                const res = await axios.get(PROSPECT_URL, options);
                console.log(res)
                getPoints(res?.data?.records, setProspectPoints)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
      };
      setIsLoading(true)
      setPartnerPoints([])
      setProspectPoints([])
      setCustomerPoints([])
      getUser();
    }, [supabase, partners, customers, prospects]);


    const getPoints = (array, setter) => {
        array?.map((account, i) => {
            console.log(account)
            if(account.BillingAddress) {
                let address = `${account?.BillingAddress?.street}`
                fromAddress(address)
                .then(({ results }) => {
                    const { lat, lng } = results[0].geometry.location;
                    setter((prevState) => ([...prevState, {
                        id: account?.Id,
                        accountName: account?.Name,
                        owner: account?.Owner?.Name,
                        name: i,
                        lat, 
                        lng,
                        key: `${i}-${lat}-${lng}`
                    }]))
                })
                .catch(console.error);
                return
            }

        });
    }

    const handlePointClick = (id) => {
        setCurrentPoint(id)
        setIsOpen(true)
    }

    useEffect(() => {
      console.log(markerRef)
      if(!markerRef) return
      markerRef?.current?.addListener('mouseover', () => console.log('yo'))
    }, [markerRef.current])


      
        

        return ( 
        <div  className='[button]:!hidden' style={{'height': '92vh', 'width': '100%'}}>
            <Spinner isLoading={isLoading} />
  <APIProvider apiKey={API_KEY}>
    <Map
      mapId={'a74a7fe3dafbd1e'}
      zoom={4}
      center={{lat: 43.64, lng: -79.41}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >

        <MapMenu 
        partners={partners}
         setPartners={setPartners} 
         customers={customers}
        setCustomers={setCustomers}
        prospects={prospects}
        setProspects={setProspects}/>
{customerPoints?.map((point, i) => { 
      const svgMarker = {
        url: 'data:image/svg+xml;utf-8, \
         <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="38px" viewBox="0 0 26 37" style="display: block; overflow: visible; grid-area: 1;"> \
            <g fill="none" fill-rule="evenodd" style="pointer-events: auto;"> \
              <path class="RIFJN-maps-pin-view-border" d="M13 0C5.8175 0 0 5.77328 0 12.9181C0 20.5733 5.59 23.444 9.55499 30.0784C12.09 34.3207 11.3425 37 13 37C14.7225 37 13.975 34.2569 16.445 30.1422C20.085 23.8586 26 20.6052 26 12.9181C26 5.77328 20.1825 0 13 0Z" fill="rgb(25, 118, 210)"></path> \
              <path class="RIFvHW-maps-pin-view-background" fill="rgb(33, 150, 243)" d="M13.0167 35C12.7836 35 12.7171 34.9346 12.3176 33.725C11.9848 32.6789 11.4854 31.0769 10.1873 29.1154C8.92233 27.1866 7.59085 25.6173 6.32594 24.1135C3.36339 20.5174 1 17.7057 1 12.6385C1.03329 6.19808 6.39251 1 13.0167 1C19.6408 1 25 6.23078 25 12.6385C25 17.7057 22.6699 20.55 19.6741 24.1462C18.4425 25.65 17.1443 27.2193 15.8793 29.1154C14.6144 31.0442 14.0818 32.6135 13.749 33.6596C13.3495 34.9346 13.2497 35 13.0167 35Z"></path> \
              <path class="KWCFZI-maps-pin-view-default-glyph" d="M13 18C15.7614 18 18 15.7614 18 13C18 10.2386 15.7614 8 13 8C10.2386 8 8 10.2386 8 13C8 15.7614 10.2386 18 13 18Z" fill="rgb(25, 118, 210)"></path> \
            </g> \
          </svg>',
        anchor: new window.google.maps.Point(0, 20),
      };
           return (
            <MapHoverBox point={point} key={point?.id} svgMarker={svgMarker} handlePointClick={handlePointClick} />
          )
})
     }


{prospectPoints?.map((point, i) => {
            return(  
              <MapHoverBox key={point?.id} point={point} handlePointClick={handlePointClick} />
)}  )}
{partnerPoints?.map((point, i) => {
      const svgMarker = {
        url: 'data:image/svg+xml;utf-8, \
         <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="38px" viewBox="0 0 26 37" style="display: block; overflow: visible; grid-area: 1;"> \
            <g fill="none" fill-rule="evenodd" style="pointer-events: auto;"> \
              <path class="RIFJN-maps-pin-view-border" d="M13 0C5.8175 0 0 5.77328 0 12.9181C0 20.5733 5.59 23.444 9.55499 30.0784C12.09 34.3207 11.3425 37 13 37C14.7225 37 13.975 34.2569 16.445 30.1422C20.085 23.8586 26 20.6052 26 12.9181C26 5.77328 20.1825 0 13 0Z" fill="rgb(135, 152, 106)"></path> \
              <path class="RIFvHW-maps-pin-view-background" fill="rgb(151, 169, 124)" d="M13.0167 35C12.7836 35 12.7171 34.9346 12.3176 33.725C11.9848 32.6789 11.4854 31.0769 10.1873 29.1154C8.92233 27.1866 7.59085 25.6173 6.32594 24.1135C3.36339 20.5174 1 17.7057 1 12.6385C1.03329 6.19808 6.39251 1 13.0167 1C19.6408 1 25 6.23078 25 12.6385C25 17.7057 22.6699 20.55 19.6741 24.1462C18.4425 25.65 17.1443 27.2193 15.8793 29.1154C14.6144 31.0442 14.0818 32.6135 13.749 33.6596C13.3495 34.9346 13.2497 35 13.0167 35Z"></path> \
              <path class="KWCFZI-maps-pin-view-default-glyph" d="M13 18C15.7614 18 18 15.7614 18 13C18 10.2386 15.7614 8 13 8C10.2386 8 8 10.2386 8 13C8 15.7614 10.2386 18 13 18Z" fill="rgb(113, 131, 85)"></path> \
            </g> \
          </svg>',
        anchor: new google.maps.Point(0, 20),
      };
            return(  
<MapHoverBox point={point} key={point?.id} svgMarker={svgMarker} handlePointClick={handlePointClick} />

            
)}  )}
    </Map>
  </APIProvider>
  <MapDrawerContainer setCurrentPoint={setCurrentPoint} setIsOpen={setIsOpen} salesforceAuth={salesforce} isOpen={currentPoint && isOpen} id={currentPoint}/>

  </div>)

};

const Markers = ({points}) => {
    const map = useMap();
    const [markers, setMarkers] = useState({});
    const clusterer = useRef(null);
  
    // Initialize MarkerClusterer
    useEffect(() => {
      if (!map) return;
      if (!clusterer.current) {
        clusterer.current = new MarkerClusterer({map});
      }
    }, [map]);
  
    // Update markers
    useEffect(() => {
      clusterer.current?.clearMarkers();
      clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);
  
    const setMarkerRef = (marker, key) => {
      if (marker && markers[key]) return;
      if (!marker && !markers[key]) return;
  
      setMarkers(prev => {
        if (marker) {
          return {...prev, [key]: marker};
        } else {
          const newMarkers = {...prev};
          delete newMarkers[key];
          return newMarkers;
        }
      });
    };
  
    return (
      <>
        {points.map(point => (
          <Marker
            position={point}
            key={point.key}
            ref={marker => setMarkerRef(marker, point.key)}>
          </Marker>
        ))}
      </>
    );
  };
export default GoogleMap;