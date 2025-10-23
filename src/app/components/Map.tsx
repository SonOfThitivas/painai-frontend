"use client"

import { MapContainer, TileLayer, Marker, Popup ,useMapEvents } from "react-leaflet"
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    data: Array,
    zoom?: number,
}

const defaults = {
    zoom: 10
}

function Map(Map: MapProps){
    const {zoom = defaults.zoom, posix, data} = Map

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
                
                {
                    data.map((act) => {
                        return (<Marker key={act.ID} position={[act.Latitude,act.Longitude]}>
                            <Popup>
                                {act.Title}
                            </Popup>
                        </Marker>)
                    })
                }

            </MapContainer>
        </div>
    )
}

export default Map