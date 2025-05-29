import React, { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'

const videoConstrains = {
    width:540,
    facingMode: 'environment'
}

const Camera = () => {

 const webcamRef = useRef(null)

 const[url, setUrl] = useState(null)

 const capturePhoto = useCallback(async() => {
    const imageSrc = webcamRef.current.getScreenshot()

    setUrl(imageSrc);
 }, [webcamRef]);

 const onUserMedia = (e) =>{
    console.log(e);
 }


  return (
    <>
    <Webcam 
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={videoConstrains}
        onUserMedia={onUserMedia}
        mirrored={true}
    />

    <button onClick={capturePhoto}>Capture</button>
    <button onClick={() => setUrl(null)}>Refresh</button>

    {url && (
        <div>
            <img src={url} alt='Screenshot'/>
        </div>
    )}
    </>
  )
}

export default Camera
