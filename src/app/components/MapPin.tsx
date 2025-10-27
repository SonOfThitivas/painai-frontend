"use client"

import { MapContainer, TileLayer, Marker, Popup ,useMapEvents } from "react-leaflet"
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    params?: string,
    zoom?: number,
}


const defaults = {
    zoom: 10,
    minZoom: 6,
    bounds: [
        [22.167060640961587, 100.76447309999337],   // north
        [9.709726514428047, 85.97863686627129],     // west
        [15.533646623860792, 111.6507134093085],   // east
        [4.58080276368839, 101.27367013230179],     // south
    ]
}

function Map(Map: MapProps){
    let {zoom = defaults.zoom, posix, params} = Map
    const router = useRouter()
    const searchParams = useSearchParams()


    function ClickLocation() {
    const [location, setLocation] = useState(null)
    
    // map event handling
    const map = useMapEvents({
        click: (e) => {
            // query params
            let newParam = new URLSearchParams(searchParams.toString())
            newParam.set("zoom", map.getZoom())
            newParam.set("lat", e.latlng.lat)
            newParam.set("lng",  e.latlng.lng)
            router.replace(`?${newParam.toString()}`)

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

            <MapContainer 
            center={params.size > 0 ? [params.get("lat"), params.get("lng")] : posix} 
            zoom={params.size > 0 ? params.get("zoom") : zoom}
            minZoom={defaults.minZoom}
            maxBounds={defaults.bounds}
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
    )
}

export default Map