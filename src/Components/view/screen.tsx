import React, {MutableRefObject, useRef, useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Alert from "../utils";
import {Button, ButtonGroup, FormControlLabel, Switch} from "@mui/material";
import {
    faArrowPointer,
    faDesktop, faDownload,
    faPause,
    faPlay, faStop,
    faTrashCan,
    faVolumeHigh,
    faVolumeXmark
} from "@fortawesome/free-solid-svg-icons";

const ScreenView = () => {
    const [stream, setStream] = useState<MediaStream>();
    const videoObj = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;

    const [videoOptions, setVideoOptions] = useState<boolean>(true);
    const [audioOptions, setAudioOptions] = useState<boolean>(true);

    async function getDisplayMedia() {
        const constraints = {video: videoOptions, audio: audioOptions};
        console.log(constraints)

        return await navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
            videoObj.current.srcObject = stream;
            setStream(stream)
        }).catch(text => {
            Alert.error({title: "Can't capture screen", text: text});
        });
    }

    async function controlVideo(event: React.MouseEvent<HTMLButtonElement>) {
        const button: HTMLButtonElement = event.currentTarget;
        const type = button.dataset.type;
        if (type === 'select') {
            await getDisplayMedia();
        } else if (type === 'play') {
            await videoObj.current.play();
        } else if (type === 'pause') {
            videoObj.current.pause();
        } else if (type === 'remove') {
            setStream(undefined);
            videoObj.current.srcObject = null;
        }
    }


    return (
        <div className="container card">
            <div className="card-body">
                <div className="section desc-section">
                    <div className="section-title">메뉴 설명</div>
                    <div className="section-desc">
                        <b>MediaDevices 인터페이스</b>의 <b>getDisplayMedia() 메소드</b>를 이용하여 간단히 화면을 제어할 수 있는 애플리케이션을
                        만들었습니다. <br/><br/>
                        아래의 버튼을 통해 화면의 제어 기능을 수행할 수 있습니다.
                    </div>


                    <div className="section-btn-group">
                        <div className="title">[ 미디어 옵션 ]</div>
                        <div>
                            <FormControlLabel labelPlacement="start"
                                              control={<Switch onChange={event => {
                                                  setVideoOptions(event.target.checked);
                                              }}
                                                               defaultChecked={true}/>}
                                              label={<><FontAwesomeIcon icon={faDesktop}/> Video</>}/>
                            <FormControlLabel labelPlacement="start"
                                              control={<Switch onChange={event => {
                                                  setAudioOptions(event.target.checked);
                                              }}
                                                               defaultChecked={true}/>}
                                              label={<>{audioOptions ? <FontAwesomeIcon icon={faVolumeHigh}/> :
                                                  <FontAwesomeIcon icon={faVolumeXmark}/>} Audio</>}/>
                        </div>
                    </div>

                    <div className="section-btn-group">
                        <div className="title">[ 상태 ]</div>
                        <ButtonGroup variant="outlined" color="primary">
                            <Button onClick={controlVideo} data-type="select"
                                    disabled={stream != null}
                                    startIcon={<FontAwesomeIcon icon={faArrowPointer}/>}> Select
                            </Button>
                            <Button onClick={controlVideo} data-type="remove"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faTrashCan}/>}> Remove
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup variant="outlined" color="secondary">
                            <Button onClick={controlVideo} data-type="play"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPlay}/>}> Play
                            </Button>
                            <Button onClick={controlVideo} data-type="pause"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPause}/>}> Pause
                            </Button>
                        </ButtonGroup>
                    </div>


                    <div className="section-btn-group">
                        <div className="title">[ 녹화 ]</div>
                        <ButtonGroup variant="outlined" color="inherit">
                            <Button onClick={controlVideo} data-type="play"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPlay}/>}> Start
                            </Button>
                            <Button onClick={controlVideo} data-type="pause"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPause}/>}> Pause
                            </Button>
                            <Button onClick={controlVideo} data-type="stop"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faStop}/>}> STOP
                            </Button>
                        </ButtonGroup>

                        <Button onClick={controlVideo} data-type="download"
                                disabled={stream == null} startIcon={<FontAwesomeIcon icon={faDownload}/>}> Download
                        </Button>
                    </div>
                </div>
                <div className="view-section">
                    <video id="video" autoPlay={true} ref={videoObj}></video>
                </div>
            </div>

        </div>
    );
};

export default ScreenView;
