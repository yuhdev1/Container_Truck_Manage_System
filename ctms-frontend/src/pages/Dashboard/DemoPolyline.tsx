/* eslint-disable jsx-a11y/no-access-key */
import React, { useEffect, useRef, useState } from "react";


import axios from "axios";
import { MFDirectionsRenderer, MFMap, MFMarker } from "react-map4d-map";

const DemoPolyline = () => {
    const [showMap, setShowMap] = useState(true);

    const [routeGeometry, setRouteGeometry] = useState([]);

    useEffect(() => {
        axios
            .get("http://api.map4d.vn/sdk/route", {
                params: {
                    origin: "7 Tôn Thất Thuyết, Hà Nội",
                    destination: "Đại học FPT, Hoà Lạc",
                    vehicle: "car",
                    key: "a05f1551557fd15b7dc77c9d6f7094f8",
                },
            })
            .then((response) => {
                const route = response.data;
                console.log(route);
                setRouteGeometry(route);
            })
            .catch((error) => {
                console.error("Error fetching directions:", error);
            });
    }, []);

    return (
        <div>
            <div style={{ width: "50%", height: "400px" }}>
                {showMap && (
                    <MFMap
                        options={{
                            center: { lat: 21.01528, lng: 105.52842 },
                            zoom: 15,
                            controls: true,
                        }}
                        accessKey={"a05f1551557fd15b7dc77c9d6f7094f8"}
                        version={"2.4"}
                    >
                        <MFMarker
                            position={{ lat: 16.072163491469226, lng: 108.22690536081757 }}
                        />
                        <MFDirectionsRenderer
                            routes={routeGeometry}

                        />
                    </MFMap>
                )}
            </div>
        </div>
    );
};

export default DemoPolyline;