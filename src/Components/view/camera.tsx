import React, {useEffect, useState} from 'react';

interface IDeviceProps {
    key: string;
    info: MediaDeviceInfo;
}

const Camera = (props: IDeviceProps) => {
    return (
        <div key={props.key}>
            <div>장치 분류: {props.info.kind}</div>
            <div>장치 아이디: {props.info.deviceId}</div>
            <div>장치명: {props.info.label}</div>
        </div>
    );
}
const CameraView = () => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>()

    useEffect(function () {
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(media => {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                setCameras(devices.filter(e => e.kind === 'videoinput'))
            });
        });
    }, []);

    return (
        <div className="container card">
            <div className="card-body">
                <div className="section desc-section">
                    <div className="section-title">미디어 목록</div>
                    <div className="section-desc">
                        <b>MediaDevices 인터페이스</b>의 <b>enumerateDevices() 메소드</b>를 이용하여 가용한 미디어 정보를 보여줍니다.<br/><br/>
                        아래의 버튼을 통해 화면의 제어 기능을 수행할 수 있습니다.
                    </div>
                    <div>
                        {cameras?.map((device, index) =>{
                            return <Camera key={'camera-'+index} info={device}/>;
                        })}
                    </div>
                </div>
                <div className="view-section">
                    hi
                </div>
            </div>
        </div>
    );
};

export default CameraView;