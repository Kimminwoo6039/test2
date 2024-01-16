import React, {MutableRefObject, useEffect, useRef, useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Alert from "../utils";
import {Box, Button, ButtonGroup, FormControlLabel, IconButton, Switch, Tab, Tabs, Tooltip} from "@mui/material";
import {
    faArrowPointer,
    faCamera,
    faCircleDot,
    faDesktop,
    faDownload,
    faPause,
    faPlay,
    faQuestionCircle,
    faStop,
    faVideo,
    faVolumeHigh,
    faVolumeXmark
} from "@fortawesome/free-solid-svg-icons";
import {CustomTabPanel, tabProps} from "../element/tab";
import {VideoUtil} from "../element/video";

const ScreenView = () => {
    const [tab, setTab] = useState(0);
    const [stream, setStream] = useState<MediaStream>();

    const [videoOptions, setVideoOptions] = useState<boolean>(true);
    const [audioOptions, setAudioOptions] = useState<boolean>(true);

    const [videoUtil, setVideoUtil] = useState<VideoUtil>()

    const [isCaptured, setIsCaptured] = useState(false);
    const videoObj = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;

    const recordObj = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;

    useEffect(() => {
        setVideoUtil(new VideoUtil(videoObj.current, {
            mirror: false
        }));
    }, []);

    useEffect(function () {
        if (stream !== undefined) {
            videoObj.current.srcObject = stream;
        }
    }, [stream, tab]);

    async function getDisplayMedia() {
        const constraints = {video: videoOptions, audio: audioOptions};

        return await navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
            videoObj.current.srcObject = stream;
            setStream(stream);
            setIsCaptured(false);
        }).catch(text => {
            Alert.error({title: "Can't capture screen", text: text});
        });
    }

    const controlVideo = function (type: string) {
        return async function (event: React.MouseEvent<HTMLButtonElement>) {
            // 화면 선택
            if (type === 'select') {
                await getDisplayMedia();
            }
            // 화면 재생
            else if (type === 'play') {
                setIsCaptured(false);
                videoUtil && videoUtil.play();
            }
            // 화면 캡처
            else if (type === 'capture') {
                setIsCaptured(true);
                videoUtil && videoUtil.stop();
            }
            // 화면 삭제
            else if (type === 'remove') {
                setIsCaptured(false);
                setStream(undefined);
                videoObj.current.srcObject = null;
            }
            // 화면 다운로드
            else if (type === 'download') {
                setIsCaptured(true);
                videoUtil && videoUtil.downloadImage();
            }
        }
    };

    const recordVideo = function (type: string) {
        return async function (event: React.MouseEvent<HTMLButtonElement>) {

        }
    };

    const handleTabs = (event: React.SyntheticEvent, tabIndex: number) => {
        setTab(tabIndex);
    };

    return (
        <div className="container card">
            <div className="card-body">
                <div className="section desc-section">
                    <div className="section-title">
                        <span>화면 공유 및 녹화</span>
                        <Tooltip title="MediaDevices 인터페이스의 getDisplayMedia() 메소드를 이용하여 간단히 화면을 제어할 수 있는 메뉴입니다.">
                            <IconButton><FontAwesomeIcon icon={faQuestionCircle}/></IconButton>
                        </Tooltip>
                    </div>
                    <div className="section-desc">
                        아래의 버튼을 통해 화면의 제어 기능을 수행할 수 있습니다.
                    </div>


                    <div className="section-btn-group">
                        <div className="title">미디어 옵션</div>
                        <div>
                            <FormControlLabel labelPlacement="start"
                                              control={<Switch onChange={event => {
                                                  setVideoOptions(event.target.checked);
                                              }}
                                                               defaultChecked={true}/>}
                                              label={<><FontAwesomeIcon icon={faDesktop}/> 화면</>}/>
                            <FormControlLabel labelPlacement="start"
                                              control={<Switch onChange={event => {
                                                  setAudioOptions(event.target.checked);
                                              }}
                                                               defaultChecked={true}/>}
                                              label={<>{audioOptions ? <FontAwesomeIcon icon={faVolumeHigh}/> :
                                                  <FontAwesomeIcon icon={faVolumeXmark}/>} 소리</>}/>
                        </div>
                    </div>

                    <div className="section-btn-group">
                        <div className="title">상태</div>
                        <ButtonGroup>
                            <Button variant="outlined" color="primary" onClick={controlVideo('select')}
                                    disabled={stream != null}
                                    startIcon={<FontAwesomeIcon icon={faArrowPointer}/>}> 공유할 화면 선택
                            </Button>
                            <Button variant="outlined" color="error" onClick={controlVideo('remove')}
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faStop}/>}> 공유 중지
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button variant="outlined" color="info" onClick={controlVideo('play')}
                                    disabled={stream == null || !isCaptured} startIcon={<FontAwesomeIcon icon={faPlay}/>}> 재생
                            </Button>
                            <Button variant="outlined" color="warning" onClick={controlVideo('capture')}
                                    disabled={stream == null || isCaptured}
                                    startIcon={<FontAwesomeIcon icon={faCamera}/>}> 캡처
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={controlVideo('download')}
                                    disabled={stream == null || !isCaptured}
                                    startIcon={<FontAwesomeIcon icon={faDownload}/>}> 다운로드
                            </Button>
                        </ButtonGroup>
                    </div>


                    <div className="section-btn-group">
                        <div className="title">녹화</div>
                        <ButtonGroup variant="outlined" color="inherit">
                            <Button onClick={recordVideo('play')}
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPlay}/>}> 시작
                            </Button>
                            <Button onClick={recordVideo('pause')}
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPause}/>}> 임시 중지
                            </Button>
                            <Button onClick={recordVideo('stop')}
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faStop}/>}> 중단
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button variant="outlined" onClick={recordVideo('download')} data-type="download"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faDownload}/>}> 다운로드
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="view-section">
                    <Box sx={{width: '100%'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs value={tab} onChange={handleTabs} aria-label="basic tabs example">
                                <Tab label={<div><FontAwesomeIcon icon={faCircleDot}/> Live</div>} {...tabProps(0)} />
                                <Tab label={<div><FontAwesomeIcon icon={faVideo}/> Save</div>} {...tabProps(1)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={tab} index={0}>
                            <video id="video" autoPlay={true} ref={videoObj}></video>
                        </CustomTabPanel>
                        <CustomTabPanel value={tab} index={1}>
                            <video id="video" autoPlay={true} ref={recordObj}></video>
                        </CustomTabPanel>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default ScreenView;
