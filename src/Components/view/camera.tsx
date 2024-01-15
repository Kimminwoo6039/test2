import React, {MouseEventHandler, MutableRefObject, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {Button, ButtonGroup} from "@mui/material";

interface IDeviceProps {
    info: MediaDeviceInfo;
    isActive: boolean
    onClick: MouseEventHandler<HTMLDivElement>
}

const Camera = (props: IDeviceProps) => {
    return (
        <div className={props.isActive ? "device-item active": "device-item"} onClick={props.onClick}>
            <div className="icon"><FontAwesomeIcon icon={faCamera} /></div>
            <div className="name">{props.info.label.split('(')[0]}</div>
        </div>
    );
}
const CameraView = () => {
    const videoRef = useRef<HTMLVideoElement>() as MutableRefObject<HTMLVideoElement>;
    const canvasRef = useRef<HTMLCanvasElement>() as MutableRefObject<HTMLCanvasElement>;
    const [stream, setStream] = useState<MediaStream>();
    const [cameraId, setCameraId] = useState<string>()
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>()

    const getUserMedia = function(constraints?: MediaStreamConstraints){
        return new Promise(function(resolve, reject) {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                setStream(stream);
                videoRef.current.srcObject = stream;
                resolve(stream);
            }).catch(error => {
                if (['NotFoundError', 'DevicesNotFoundError', 'NotReadableError'].indexOf(error.name) > -1) {
                    reject('사용 가능한 카메라가 없습니다.');
                } else if (error.name === 'TrackStartError') {
                    reject('다른 앱에서 카메라를 이미 사용하고 있어 사용할 수 없습니다.');
                } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    reject('카메라 접근을 허용해주세요.');
                } else {
                    reject('알 수 없는 이유로 카메라에 접근할 수 없습니다.')
                }
            });
        })
    }

    useEffect(function () {
        getUserMedia({video: true, audio: true}).then((stream) => {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const cameras = devices.filter(e => e.kind === 'videoinput');
                setCameras(cameras);
                setCameraId(cameras[0].deviceId)
            });
        })
    }, []);
    
    // 카메라 ID 변경 시 변경된 Video 저장
    useEffect(function(){
        getUserMedia({video: {deviceId: cameraId, facingMode: 'user', width: 400, height: 600}})
    }, [cameraId]);

    function savePicture(){
        const video = videoRef.current;
        const canvas = canvasRef.current;

        video.pause();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        if(context != null){
            // canvas 좌우반전
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);
            context.drawImage(video, 0, 0);
        }

        return canvas.toDataURL('image/png');
    }
    return (
        <div className="container card">
            <div className="card-body flex-column">
                <div className="section">
                    <div className="section-title">카메라 목록</div>
                    <div className="device-list">
                        {cameras?.map((device, index) =>{
                            return <Camera key={'camera-'+index} info={device} isActive={cameraId === device.deviceId}
                                           onClick={(e) => {
                                setCameraId(device.deviceId);
                            }}/>;
                        })}
                    </div>
                </div>
                <div className="d-flex section">
                    <div className="section desc-section">
                        <ButtonGroup>
                            <Button onClick={e => {
                                videoRef.current.classList.toggle('reverse');
                            }}>좌우 반전</Button>
                            <Button onClick={savePicture}>사진 촬영</Button>
                        </ButtonGroup>
                    </div>
                    <div className="view-section">
                        <video id="camera" autoPlay={true} ref={videoRef}></video>
                        <canvas id="canvas" ref={canvasRef}></canvas>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CameraView;