import React, {MutableRefObject, useRef, useState} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import Alert from "../utils";

const ScreenView = () => {
    const videoObj = useRef<HTMLVideoElement>(null) as MutableRefObject<HTMLVideoElement>;
    const [videoOptions, setVideoOptions] = useState<DisplayMediaStreamOptions>({video: true, audio: true})

    async function controlVideo(event: React.MouseEvent<HTMLButtonElement>){
        const button: HTMLButtonElement = event.currentTarget;
        const type = button.dataset.type;
        if(type === 'select'){
            await navigator.mediaDevices.getDisplayMedia(videoOptions).then(stream => {
                videoObj.current.srcObject = stream;
            }).catch(text => {
                Alert.error({title: "Can't capture screen", text: text});
            })
        } else if(type === 'play'){
            await videoObj.current.play();
        } else if(type === 'pause'){
            videoObj.current.pause();
        } else if(type === 'remove'){
            videoObj.current.srcObject = null;
        }
    }

    function controlOption(){

    }
    return (
        <div className="container screen-container">
            <div className="section desc-section">
                <div className="section-title">메뉴 설명</div>
                <div className="section-sub-title">스크린: 화면 제어</div>
                <div className="section-desc">
                    <b>MediaDevices 인터페이스</b>의 <b>getDisplayMedia() 메소드</b>를 이용하여 간단히 화면을 제어할 수 있는 애플리케이션을 만들었습니다. <br/><br/>
                    아래의 버튼을 통해 화면의 
                </div>
                <div className="section-btn-group">
                    <div>상태</div>
                    <div>
                        <button onClick={controlVideo} data-type="select">Select</button>
                        <button onClick={controlVideo} data-type="play">Play</button>
                        <button onClick={controlVideo} data-type="pause">Pause</button>
                        <button onClick={controlVideo} data-type="remove">Remove</button>
                    </div>
                </div>

                <div className="section-btn-group">
                    <div>제어</div>
                    <div>
                        <button onClick={controlOption}>
                            <FontAwesomeIcon icon={icon({name: 'coffee'})} />
                            Screen</button>
                        <button onClick={controlOption}>Audio</button>
                    </div>
                </div>

                <div className="section-btn-group">
                    <div>녹화</div>
                    <div>
                        <button>Start</button>
                        <button>Stop</button>
                        <button>Download</button>
                    </div>
                </div>
            </div>
            <div className="view-section">
                <video id="video" autoPlay={true} ref={videoObj}></video>
            </div>
        </div>
    );
};

export default ScreenView;
