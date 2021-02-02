/* leny/enigjewo
 *
 * /src/components/game/panorama.js - Game Component: panorama (street-view)
 *
 * coded by leny@BeCode
 * started at 02/02/2021
 */

/* eslint-disable */ // WIP

import "styles/game/panorama.scss";

import {useRef, useState, useEffect} from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const Panorama = ({panorama, discriminator}) => {
    const box = useRef(null);
    const [streetView, setStreetView]=useState(null);

    useEffect(()=>{
        if(streetView||!box.current){
            return;
        }

        setStreetView(
            new google.maps.StreetViewPanorama(
                box.current,{
                    addressControl: false,
                fullscreenControl: false,
                motionTracking: false,
                motionTrackingControl: false,
                showRoadLabels: false,
                panControl: true,
                }
            )
        );
    },[
        box, streetView, setStreetView
    ]);

    useEffect(()=>{
        if (!streetView||!panorama){
            return;
        }

        streetView.setPano(panorama);
        streetView.setPov({
            heading: 270,
            pitch: 0,
        });
        streetView.setZoom(0);
    },[streetView, panorama, discriminator])

    return <div className={classnames("panorama")} ref={box} />;
};

Panorama.propTypes = {
    panorama: PropTypes.string.isRequired,
    discriminator: PropTypes.number.isRequired,
};

export default Panorama;
