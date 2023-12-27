'use client'
import React, {useRef, useState, useEffect} from 'react';
import {APIProvider, Map, Marker, useMap} from '@vis.gl/react-google-maps';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMap = ({selectedTrees}) => {
   return ( <div style={{'height': '100vh', 'width': '100%'}}>
  <APIProvider apiKey={API_KEY}>
    <Map
      mapId={'a74a7fe3dafbd1e'}
      zoom={11}
      center={{lat: 43.64, lng: -79.41}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
    </Map>
  </APIProvider>
  </div>)

};
export default GoogleMap;