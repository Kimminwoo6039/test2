import React, {MouseEventHandler, MutableRefObject, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {Button, ButtonGroup, FormControlLabel, Switch} from "@mui/material";
import {VideoUtil} from "Components/utils/video";

interface IDeviceProps {
    info: MediaDeviceInfo;
    isActive: boolean
    onClick: MouseEventHandler<HTMLDivElement>
}

const Camera = (props: IDeviceProps) => {
    return (
        <div className={props.isActive ? "device-item active" : "device-item"} onClick={props.onClick}>
            <div className="icon"><FontAwesomeIcon icon={faCamera}/></div>
            <div className="name">{props.info.label.split('(')[0]}</div>
        </div>
    );
}
const CameraView = () => {
    const videoRef = useRef<HTMLVideoElement>() as MutableRefObject<HTMLVideoElement>;

    const [cameraId, setCameraId] = useState<string>()
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>()

    const [isCaptured, setIsCaptured] = useState(false);
    const [constraints, setConstraints] = useState<MediaStreamConstraints>({video: true, audio: true});

    const videoUtil= new VideoUtil(videoRef, {
        mirror: true
    });

    const getUserMedia = function (constraints?: MediaStreamConstraints) {
        return new Promise(function (resolve, reject) {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                videoRef.current.srcObject = stream;
                resolve(stream);
            }).catch(error => {
                console.error(error)
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

    useEffect(() => {
        setIsCaptured(false);

        getUserMedia(constraints).then((stream) => {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const cameras = devices.filter(e => e.kind === 'videoinput');
                setCameras(cameras);
                setCameraId(cameras[0].deviceId);
            });
        })
    }, []);

    // 카메라 ID 변경 시 변경된 Video 저장
    useEffect(function () {
        setIsCaptured(false);
    }, [cameraId]);

    function playVideo() {
        setIsCaptured(false);
        videoUtil.play();
    }

    function savePicture() {
        setIsCaptured(true);
        videoUtil.saveImage();
    }

    function downloadPicture() {
        setIsCaptured(true);
        videoUtil.downloadImage();
    }

    return (
        <div className="container card">
            <div className="card-body flex-column">
                <div className="section">
                    <div className="section-title">카메라 목록</div>
                    <div className="device-list">
                        {cameras?.length === 0 ? (
                                <div>사용 가능한 카메라가 없습니다. <br/> 카메라 연결 후 사용해주세요</div>
                            ) :
                            (cameras?.map((device, index) => {
                                return <Camera key={'video-' + index} info={device}
                                               isActive={cameraId === device.deviceId}
                                               onClick={(e) => {
                                                   setCameraId(cameraId)
                                                   getUserMedia({
                                                       video: {
                                                           deviceId: cameraId,
                                                       }
                                                   }).then(stream => {

                                                   })
                                               }}/>;
                            }))
                        }
                    </div>
                </div>
                <div className="section">
                    <div className="section-btn-group">
                        <div className="title">카메라 옵션</div>
                        <div>
                            <FormControlLabel labelPlacement="end"
                                              control={<Switch onChange={event => {
                                                  videoUtil && videoUtil.setMirror(event.target.checked);
                                              }}
                                                               defaultChecked={videoUtil.getMirror()}/>}
                                              label="좌우 반전"/>
                            <ButtonGroup>
                                <Button disabled={isCaptured} onClick={savePicture}>촬영</Button>
                                <Button disabled={!isCaptured} onClick={playVideo}>재촬영</Button>
                                <Button disabled={!isCaptured} onClick={downloadPicture}>사진 다운로드</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <video id="camera" autoPlay={true} ref={videoRef}></video>
                </div>

            </div>
        </div>
    );
};

export default CameraView;