"use client"

import { MapContainer, TileLayer, Marker, Popup ,useMap} from "react-leaflet"
import { LatLngExpression, LatLngTuple} from 'leaflet';
import { ZoomControl } from "react-leaflet";
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
    zoom: 10
}

const ChangeView = ({ center }: { center: LatLngExpression | LatLngTuple}) => {
    const map = useMap()
    useEffect(()=>{
        map.setView(center, map.getZoom());
    }, [center, map])
    return null;
    }

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

            </MapContainer>
        </div>
    )
}

export default Map