"use client"

import { MapContainer, TileLayer, Marker, Popup ,useMapEvents } from "react-leaflet"
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
    zoom: 18
}

// click handler
// function MapEventComponent() {
//   const map = useMapEvents({
//     click: (e) => {
//         console.log(e.latlng)
//     },
//   })
//   return null
// }

function Map(Map: MapProps){
    const {zoom = defaults.zoom, posix} = Map

    return(
        <div>
            <MapContainer 
            center={posix} 
            zoom={zoom}
            style={{ height: "100svh", width: "100%" }}
            >
                {/* <MapEventComponent/> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={posix}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default Map