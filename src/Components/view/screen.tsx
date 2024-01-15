import React, {MutableRefObject, useEffect, useRef, useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Alert from "../utils";
import {
    Box,
    Button,
    ButtonGroup,
    FormControlLabel,
    IconButton,
    Switch,
    Tab,
    Tabs,
    Tooltip,
    Typography
} from "@mui/material";
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function tabProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ScreenView = () => {
    const [tab, setTab] = useState(0);
    const [isPlayed, setIsPlayed] = useState(false);
    const [stream, setStream] = useState<MediaStream>();

    const [videoOptions, setVideoOptions] = useState<boolean>(true);
    const [audioOptions, setAudioOptions] = useState<boolean>(true);

    const videoObj = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;
    const recordObj = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;
    const canvasObj = useRef<HTMLCanvasElement>(null) as MutableRefObject<HTMLCanvasElement>;

    async function getDisplayMedia() {
        const constraints = {video: videoOptions, audio: audioOptions};

        return await navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
            videoObj.current.srcObject = stream;
            setStream(stream);
            setIsPlayed(true);
        }).catch(text => {
            Alert.error({title: "Can't capture screen", text: text});
        });
    }

    const controlVideo = function(type: string) {
        return async function(event: React.MouseEvent<HTMLButtonElement>){
            // 화면 선택
            if (type === 'select') {
                await getDisplayMedia();
            }
            // 화면 재생
            else if (type === 'play') {
                await videoObj.current.play();
                setIsPlayed(true);
            }
            // 화면 캡처
            else if (type === 'capture') {
                videoObj.current.pause();
                setIsPlayed(false);
            }
            // 화면 삭제
            else if (type === 'remove') {
                setStream(undefined);
                videoObj.current.srcObject = null;
            }
            // 화면 다운로드
            else if(type === 'download'){
                canvasObj.current.width = videoObj.current.width;
                canvasObj.current.height = videoObj.current.height;

                const ctx = canvasObj.current.getContext('2d');
                if(ctx != null){
                    ctx.drawImage(videoObj.current, 0, 0, videoObj.current.width, videoObj.current.height);
                }

                // A DOM 생성
                const $link = document.createElement("a");

                $link.download = "파일명.png";
                $link.href = canvasObj.current.toDataURL("image/png");

                // element에 마우스 클릭
                $link.click();
            }
        }
    };

    const recordVideo = function(type: string) {
        return async function(event: React.MouseEvent<HTMLButtonElement>){

        }
    };

    const handleTabs = (event: React.SyntheticEvent, tabIndex: number) => {
        setTab(tabIndex);
    };

    useEffect(function () {
        if (stream !== undefined) {
            videoObj.current.srcObject = stream;
            if(isPlayed){
                videoObj.current.play();
            }
        }
    }, [stream, tab])

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
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPlay}/>}> 화면 재생
                            </Button>
                            <Button variant="outlined" color="warning" onClick={controlVideo('capture')}
                                    disabled={stream == null || !isPlayed} startIcon={<FontAwesomeIcon icon={faCamera}/>}> 화면 캡처
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={controlVideo('download')}
                                    disabled={stream == null || isPlayed} startIcon={<FontAwesomeIcon icon={faDownload}/>}> 다운로드
                            </Button>
                        </ButtonGroup>
                    </div>


                    <div className="section-btn-group">
                        <div className="title">녹화</div>
                        <ButtonGroup variant="outlined" color="inherit">
                            <Button onClick={recordVideo('play')}
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPlay}/>}> 녹화 시작
                            </Button>
                            <Button onClick={recordVideo('pause')}
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faPause}/>}> 녹화 임시 중지
                            </Button>
                            <Button onClick={recordVideo('stop')}
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faStop}/>}> 녹화 중단
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button variant="outlined" onClick={recordVideo('download')} data-type="download"
                                    disabled={stream == null} startIcon={<FontAwesomeIcon icon={faDownload}/>}> Download
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="view-section">
                    <Box sx={{width: '100%'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs value={tab} onChange={handleTabs} aria-label="basic tabs example">
                                <Tab label={<div><FontAwesomeIcon icon={faCircleDot} /> Live</div>} {...tabProps(0)} />
                                <Tab label={<div><FontAwesomeIcon icon={faVideo} /> Save</div>} {...tabProps(1)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={tab} index={0}>
                            <video id="video" autoPlay={true} ref={videoObj}></video>
                            <canvas ref={canvasObj}></canvas>
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
