"use client"

import { MapContainer, TileLayer, Marker, Popup ,useMap, useMapEvents, } from "react-leaflet"
import { LatLng, LatLngExpression, LatLngTuple} from 'leaflet';
import { useEffect, useState} from "react";
import SearchBox from "./SearchBox";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    data: Array<any>,
    // title?: RefObject<string>,
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

const ChangeView = ({ center }: { center: LatLngExpression | LatLngTuple}) => {
    const map = useMap()
    useEffect(()=>{
        map.setView(center, map.getZoom());
    }, [center, map])
    return null;
    }

// const EventListener = () => {
//     const map = useMapEvents({
//         click(e) {
//             // console.log(map.latLng)
//             // console.log(map.getZoom())
//         }
//     })

//     return null
// }

function Map(Map: MapProps){
    const {zoom = defaults.zoom, posix, data,} = Map
    // const title = useRef("")
    const [dataMap, setDataMap] = useState<Array<any>>(data)
    const [title, setTitle] = useState<string>("")
    const [pos, setPos] = useState<LatLngExpression | LatLngTuple>(posix)

    const fetchFilterData = () => {
        let filtAct = data.filter((item)=>{
            let text = item.Title
            text = text.toLowerCase()
            return text.match(title.toLowerCase())
        })
        // console.log(filtAct)
        setDataMap(filtAct)
        if ((data.length > filtAct.length) &&
            (filtAct.length > 0)){
            setPos([filtAct[0].Latitude, filtAct[0].Longitude])
        }
        // if (filtAct.length > 0) setPos([filtAct[0].Latitude, filtAct[0].Longitude]) 
    }

    useEffect(()=>{
        fetchFilterData()
    },[title])

    return(
        <div>
            <SearchBox label={"Search Activities"} data={data} setTitle={setTitle} />
            
            <MapContainer 
            center={pos} 
            zoom={zoom}
            zoomControl={false}
            style={{ height: "100svh", width: "100%" }}
            minZoom={defaults.minZoom}
            maxBounds={defaults.bounds}
            >
                {/* <MapEventComponent/> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    
                />
            
                {
                    dataMap.map((act) => {
                        return (<Marker key={act.ID} position={[act.Latitude,act.Longitude]}>
                            <Popup>
                                {act.Title}
                            </Popup>
                        </Marker>)
                    })
                }

                <ChangeView center={pos}/>
                {/* <EventListener/> */}
            </MapContainer>
        </div>
    )
}

export default Map