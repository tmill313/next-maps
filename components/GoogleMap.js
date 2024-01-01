'use client'
import React, {useRef, useState, useEffect} from 'react';
import {APIProvider, Map, Marker, useMap, AdvancedMarker} from '@vis.gl/react-google-maps';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


import axios from "axios";
import {
    setKey,
    fromAddress,
  } from "react-geocode";
import ButtonGradient from './ButtonGradient';
import MapDrawerContainer from './MapDrawerContainer';
import MapMenu from './MapMenu';
import SmallNav from '@/app/dashboard/SmallNav';

const ALL_ACCOUNTS = 'accounts'
const CUSTOMERS = 'customers'
const PROSPECTS = 'prospects'
const GoogleMap = () => {
    const [points, setPoints] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [currentPoint, setCurrentPoint] = useState(null)
    const [salesforce, setSalesforce] = useState(null)
    const [accounts, setAccounts] = useState(true)
    const [customers, setCustomers] = useState(false)
    const [prospects, setProspects] = useState(false)
    const supabase = createClientComponentClient();

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
      const salesforceURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query?q=SELECT+id,name,billingAddress+FROM+Account`
      const customerURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,accountid+FROM+Opportunity+WHERE+isWon=true`
      const prospectsURL = `${salesforceAuth?.instance_url}/services/data/v59.0/query/?q=SELECT+Id,Name,accountid+FROM+Opportunity+WHERE+isWon=true`

        try {
            let records
            if(accounts) {
            const res = await axios.get(salesforceURL, options);
            records = res?.data?.records
            }

            if( customers) {
            const res = await axios.get(customerURL, options);
            const newSet = new Set()
            res?.data?.records?.map(opp => {
                if(opp?.AccountId) {
                newSet.add(opp.AccountId)
                }
            })
            let newArr = [...newSet]
            let joined = newArr.join(',')
            console.log(joined)
            const collectionURL = `${salesforceAuth?.instance_url}/services/data/v59.0/composite/sobjects/Account?ids=${joined}&fields=id,name,billingAddress`
            const collectionRes = await axios.get(collectionURL, options);
            records = collectionRes.data
            }

            if(prospects) {
                const accountRes = await axios.get(salesforceURL, options);
                const res = await axios.get(prospectsURL, options);
                console.log(res)
                let newArr = []
                const newSet = new Set()
                res?.data?.records?.map(opp => {
                    if(opp?.AccountId) {
                    newSet.add(opp.AccountId)
                    }
                })
                accountRes?.data?.records?.map(account => {
                    if(!newSet.has(account?.Id)) {
                    newArr.push(account.Id)
                    }
                })
                let joined = newArr.join(',')
                console.log(newSet)
                console.log(newArr)
                console.log(joined)
                const collectionURL = `${salesforceAuth?.instance_url}/services/data/v59.0/composite/sobjects/Account?ids=${joined}&fields=id,name,billingAddress`
                const collectionRes = await axios.get(collectionURL, options);
                records = collectionRes.data
            }
            setKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
            console.log(records)
            getPoints(records)
            console.log(points)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
      };
      setPoints([])
      getUser();
    }, [supabase, accounts, customers, prospects]);

    const getPoints = (array) => {
        array?.map((account, i) => {
            console.log(account)
            if(account.BillingAddress) {
                let address = `${account?.BillingAddress?.street}`
                fromAddress(address)
                .then(({ results }) => {
                    const { lat, lng } = results[0].geometry.location;
                    setPoints((prevState) => ([...prevState, {
                        id: account?.Id,
                        name: i,
                        lat, 
                        lng,
                        key: `${i}-${lat}-${lng}`
                    }]))
                })
                .catch(console.error);
                console.log(points, 'points')
                return
            }

        });
    }

    const handlePointClick = (id) => {
        setCurrentPoint(id)
        setIsOpen(true)
    }



      
        
        console.log(isLoading)
       if(isLoading) return <div>spinner</div>>
       console.log(points)
        return ( <div style={{'height': '100vh', 'width': '100%'}}>
  <APIProvider apiKey={API_KEY}>
    <Map
      mapId={'a74a7fe3dafbd1e'}
      zoom={4}
      center={{lat: 43.64, lng: -79.41}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >

        <MapMenu 
        accounts={accounts}
         setAccounts={setAccounts} 
         customers={customers}
        setCustomers={setCustomers}
        prospects={prospects}
        setProspects={setProspects}/>
{points?.map((point, i) => {
            return(  
            <Marker
            onMouseOver={() => console.log('yooo')}
            position={point}
            onClick={() => handlePointClick(point.id)}
            key={point.key}>
              </Marker>
)}  )}
    </Map>
  </APIProvider>
  <MapDrawerContainer setIsOpen={setIsOpen} salesforceAuth={salesforce} isOpen={currentPoint && isOpen} id={currentPoint}/>

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