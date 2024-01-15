import React, {MouseEventHandler, MutableRefObject, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {Button, ButtonGroup, FormControlLabel, Switch} from "@mui/material";

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
    const [isCaptured, setIsCaptured] = useState(false);
    const [isReversed, setIsReversed] = useState(true);

    const videoRef = useRef<HTMLVideoElement>() as MutableRefObject<HTMLVideoElement>;
    const canvasRef = useRef<HTMLCanvasElement>() as MutableRefObject<HTMLCanvasElement>;

    const [cameraId, setCameraId] = useState<string>()
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>()

    const getUserMedia = function(constraints?: MediaStreamConstraints){
        return new Promise(function(resolve, reject) {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
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
        getUserMedia({video: {deviceId: cameraId, facingMode: 'user', width: 400, height: 600}});

        console.log(isCaptured)
    }, [cameraId]);

    function playVideo(){
        setIsCaptured(false);
        videoRef.current.play();
    }

    function savePicture(){
        const video = videoRef.current;
        const canvas = canvasRef.current;

        video.pause();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        if(context != null){
            // canvas 좌우반전
            if(isReversed){
                context.scale(-1, 1);
                context.translate(-canvas.width, 0);
            }
            context.drawImage(video, 0, 0);
        }

        setIsCaptured(true);
        return canvas.toDataURL('image/png');
    }

    function downloadPicture(){
        const a = document.createElement('a');

        a.href = savePicture();
        a.download = Date.now() + '.png';
        document.body.appendChild(a);
        a.click();
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
                <div className="section">
                    <div className="section-btn-group">
                        <div className="title">카메라 옵션</div>
                        <div>
                            <FormControlLabel labelPlacement="end"
                                              control={<Switch onChange={event => {
                                                  setIsReversed(event.target.checked);
                                              }}
                                                               defaultChecked={true}/>}
                                              label="좌우 반전"/>
                            <ButtonGroup>
                                <Button hidden={isCaptured} onClick={savePicture}>촬영</Button>
                                <Button hidden={!isCaptured} onClick={playVideo}>재촬영</Button>
                                <Button onClick={downloadPicture}>사진 다운로드</Button>
                            </ButtonGroup>
                        </div>
                    </div>

                </div>
                <div className="section">
                    <video id="camera" autoPlay={true} ref={videoRef} className={isReversed ? 'reverse' : ''}></video>
                    <canvas id="canvas" ref={canvasRef}></canvas>
                </div>

            </div>
        </div>
    );
};

export default CameraView;