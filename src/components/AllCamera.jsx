import React, { useCallback, useEffect, useState } from 'react'
import Webcam from 'react-webcam';
import Camera from './Camera';


const AllCamera = () => {
    const [devices, setDevices] = useState([]);
    

    const handleDevices = useCallback(
        (mediaDevices) => setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    );
    useEffect(() => 
    {
        navigator.mediaDevices.enumerateDevices().then(handleDevices)
    }, [handleDevices])
  return (
    <div>
        <Camera />
    </div>
  )
}

export default AllCamera
