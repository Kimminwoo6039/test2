import React, {MutableRefObject, useEffect, useRef, useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {Box, Button, ButtonGroup, FormControlLabel, IconButton, Switch, Tab, Tabs, Tooltip} from "@mui/material";
import {
    faArrowPointer,
    faCamera,
    faCircleDot,
    faDesktop,
    faDownload,
    faPlay,
    faQuestionCircle,
    faStop,
    faVideo,
    faVolumeHigh,
    faVolumeXmark
} from "@fortawesome/free-solid-svg-icons";
import {TabPanel, tabProps} from "Components/element/tab";
import {VideoUtil} from "Components/utils/video";
import Alert from "Components/utils/alert";

const ScreenView = () => {
    const [tab, setTab] = useState(0);
    const [stream, setStream] = useState<MediaStream>();

    const [videoOptions, setVideoOptions] = useState<boolean>(true);
    const [audioOptions, setAudioOptions] = useState<boolean>(true);

    const videoRef = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;
    const recordRef = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;

    const videoUtil = new VideoUtil(videoRef, {
        mirror: false
    });

    let recorder: MediaRecorder | null = null;
    const data: BlobPart[] = [];

    const [recordedUrl, setRecordedUrl] = useState('');
    const [isCaptured, setIsCaptured] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    async function getDisplayMedia() {
        const constraints = {video: videoOptions, audio: audioOptions};

        return await navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
            videoRef.current.srcObject = stream;
            setStream(stream);
            setIsCaptured(false);
        }).catch(text => {
            Alert.danger({title: "Can't capture screen", text: text});
        });
    }

    const controlVideo = function (type: string) {
        return async function (event: React.MouseEvent<HTMLButtonElement>) {
            // 화면 선택
            if (type === 'select') {
                setTab(0);
                await getDisplayMedia();
            }
            // 화면 재생
            else if (type === 'play') {
                setIsCaptured(false);
                videoUtil.play();
            }
            // 화면 캡처
            else if (type === 'capture') {
                setIsCaptured(true);
                videoUtil.stop();
            }
            // 화면 삭제
            else if (type === 'remove') {
                setIsCaptured(false);
                setStream(undefined);
                videoRef.current.srcObject = null;
            }
            // 화면 다운로드
            else if (type === 'download') {
                setIsCaptured(true);
                videoUtil.downloadImage();
            }
        }
    };

    const startRecording = () => {
        setIsRecording(true);

        if(stream){


            // 1.MediaStream을 매개변수로 MediaRecorder 생성자를 호출
            recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9'
            })

            // 2. 전달받는 데이터를 처리하는 이벤트 핸들러 등록
            recorder.ondataavailable = function (event) {
                if (event.data.size > 0) {
                    data.push(event.data);
                }
            }

            // 3. 녹화 중지 이벤트 핸들러 등록
            recorder.onstop = function () {
                const blob = new Blob(data, {type: "video/webm"});
                const url = URL.createObjectURL(blob);

                setRecordedUrl(url);
            }

            // 4. 녹화 시작
            recorder.start(1000);
        }
    }

    const stopRecording = () => {
        setIsRecording(false);
        recorder && recorder.stop();
        recorder = null;
    }

    const downloadRecordedVideo = () => {
        if(recordedUrl){
            VideoUtil.downloadUrl(recordedUrl, 'video');
        } else {
            Alert.warning({text: '다운로드할 영상이 없습니다!'});
        }
    }
    const handleTabs = (event: React.SyntheticEvent, tabIndex: number) => {
        setTab(tabIndex);
    };


    useEffect(() => {
        // Live
        if (tab === 0) {
            if(stream !== undefined){
                videoRef.current.srcObject = stream;
            }
        }
        // Save
        else if(tab === 1){
            if(recordedUrl){
                console.info('handle tab', recordedUrl)
                console.log('record', recordRef)
                recordRef.current.src = recordedUrl;
            }
        }
    }, [tab]);
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
                                    disabled={stream == null || !isCaptured}
                                    startIcon={<FontAwesomeIcon icon={faPlay}/>}> 재생
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
                            <Button onClick={startRecording}
                                    disabled={stream == null || isRecording} startIcon={<FontAwesomeIcon icon={faPlay}/>}> 시작
                            </Button>
                            <Button onClick={stopRecording}
                                    disabled={stream == null || !isRecording} startIcon={<FontAwesomeIcon icon={faStop}/>}> 종료
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button variant="outlined" onClick={downloadRecordedVideo}
                                    disabled={stream == null || isRecording} startIcon={<FontAwesomeIcon icon={faDownload}/>}> 다운로드
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="view-section">
                    <Box sx={{width: '100%'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs value={tab} onChange={handleTabs} aria-label="screen tabs">
                                <Tab label={<div><FontAwesomeIcon icon={faCircleDot}/> Live</div>} {...tabProps(0)} />
                                <Tab label={<div><FontAwesomeIcon icon={faVideo}/> Save</div>} {...tabProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={tab} index={0}>
                            <video id="video" autoPlay={true} ref={videoRef}></video>
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <video id="record" controls={true} ref={recordRef}></video>
                        </TabPanel>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default ScreenView;
