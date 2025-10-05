"use client"

import { MapContainer, TileLayer, Marker, Popup ,useMapEvents } from "react-leaflet"
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { useRouter, useSearchParams} from 'next/navigation'
import { useState} from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    getLocation? : LatLngExpression | LatLngTuple,

    zoom?: number,
}


const defaults = {
    zoom: 10
}

function Map(Map: MapProps){
    let {zoom = defaults.zoom, posix, getLocation = null} = Map
    const router = useRouter()
    const searchParams = useSearchParams()
    let params = new URLSearchParams(searchParams.toString())


    function ClickLocation() {
    const [location, setLocation] = useState(null)
    
    // map event handling
    const map = useMapEvents({
        click: (e) => {
            // query params
            params = new URLSearchParams(searchParams.toString())
            params.set("zoom", map.getZoom())
            params.set("lat", e.latlng.lat)
            params.set("lng",  e.latlng.lng)
            router.replace(`?${params.toString()}`)

            // set map view
            // console.log(e.latlng)
            setLocation(e.latlng)
            map.setView(e.latlng)


        },
    })
    return (
        <>
            {location !== null && <Marker position={location}/>}
        </>
    )
}

    return(
        <div>
            <MapContainer 
            center={params.size > 0 ? [params.get("lat"), params.get("lng")] : posix} 
            zoom={params.size > 0 ? params.get("zoom") : zoom}
            style={{ height: "100svh", width: "100%" }}
            >
                
                {/* <MapEventComponent/> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickLocation/>

                {params.size > 0 && <Marker position={[params.get("lat"), params.get("lng")]}/>}

            </MapContainer>
        </div>
    )
}

export default Map