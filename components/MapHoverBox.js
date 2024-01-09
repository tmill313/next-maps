'use client'
import { useState } from 'react';
import {InfoWindow, Marker} from '@vis.gl/react-google-maps';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PersonIcon } from "@radix-ui/react-icons"


const MapHoverBox = ({point, name, handlePointClick, svgMarker}) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleMouseOver = () => {
        setTimeout(() => {
            setIsOpen(true)
          }, 300);
    }

    const handleMouseOut = () => {
        setTimeout(() => {
            setIsOpen(false)
          }, 300);
    }
   return( 
    <div>
    <Marker
    position={point}
    icon={svgMarker}
    onMouseOver={handleMouseOver}
    onMouseOut={handleMouseOut}
    onClick={() => handlePointClick(point.id)}
    >
      </Marker>
    {isOpen && <InfoWindow position={point}>
    <div className="w-44">
        <div className="flex justify-between flex-col">
          <div className="space-y-1 flex flex-col items-center">
            <h4 className="text-sm font-semibold">{point?.accountName ?? ''}</h4>
            {point?.owner && <div className="flex items-center pt-2">
              <PersonIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {point?.owner}
              </span>
            </div>}
          </div>
        </div>
      </div>  </InfoWindow>}
  </div>)
}

export default MapHoverBox