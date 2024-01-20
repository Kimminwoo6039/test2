import {MutableRefObject} from "react";

export interface VideoOptions {
    mirror?: boolean; // 거울 모드
}

export class VideoUtil {
    obj: HTMLVideoElement;
    options: VideoOptions;

    /**
     * [VideoUtil] Video 관리자 생성
     * @param {HTMLVideoElement} obj 제어할 Video 객체
     * @param {VideoOptions} options Video 옵션
     */
    constructor(obj: MutableRefObject<HTMLVideoElement>, options?: VideoOptions) {
        this.obj = obj.current;
        this.options = Object.assign({}, {
            mirror: true
        }, options);

        if(this.obj){
            this.obj.classList.toggle('reverse', this.options.mirror);
        }
    }

    /**
     * [VideoUtil] 비디오 재생
     * @returns {Promise<void>} promise Video 재생 결과 반환
     */
    play(): Promise<void>{
        return this.obj.play();
    }

    /**
     * [VideoUtil] 비디오 중지
     */
    stop(): void {
        this.obj.pause();
    }

    /**
     * [VideoUtil] Video 현재 화면 이미지 생성
     * @returns {string} Image Data URL
     */
    saveImage(): string {
        this.obj.pause();

        const canvas = document.createElement('canvas');
        canvas.width = this.obj.videoWidth;
        canvas.height = this.obj.videoHeight;
        const context = canvas.getContext('2d');

        if(context != null){
            // canvas 좌우반전
            if(this.options.mirror){
                context.scale(-1, 1);
                context.translate(-canvas.width, 0);
            }
            context.drawImage(this.obj, 0, 0);
        }

        return canvas.toDataURL('image/png');
    }

    /**
     * [VideoUtil] 다운로드 함수
     * @param { string } url 다운로드할 URL
     * @param {'video' | 'image'} format 파일 형식
     * @param { string } name 다운로드 명
     */
    static downloadUrl(url: string, format?: string, name?: string){
        const a = document.createElement('a');

        const extHash = {'video': 'webm', 'image': 'png'};
        // @ts-ignore
        let ext: string = extHash[format] || 'png';

        a.href = url;
        a.download = name || Date.now() + '.' + ext;
        document.body.appendChild(a);

        a.click();
        document.body.removeChild(a);
    }

    /**
     * [VideoUtil] Video 현재 화면 이미지 다운로드
     */
    downloadImage(): void {
        const a = document.createElement('a');

        VideoUtil.downloadUrl(this.saveImage());
    }

    /**
     * [VideoUtil] 거울모드 설정 확인
     */
    getMirror(){
        return this.options.mirror;
    }

    /**
     * [VideoUtil] 거울 모드 설정
     * @param {boolean} mirror 거울 모드 여부
     */
    setMirror(mirror: boolean){
        this.options.mirror = mirror;
        this.obj.classList.toggle('reverse', this.options.mirror);
    }
}

export class VideoRecorder {
    stream: MediaStream;
    isRecording: boolean = false;
    recorder?: MediaRecorder;
    data: BlobPart[] = [];
    dataUrl: string = '';

    constructor(stream: MediaStream) {
        this.stream = stream;
    }

    start(){
        this.isRecording = true;

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: 'video/webm; codecs=vp9'
        });
        this.recorder.ondataavailable = (event)=> {
            if (event.data.size > 0) {
                this.data.push(event.data);
            }
        }
        this.recorder.onstop = () =>{
            const blob = new Blob(this.data, {type: "video/webm"});
            const url = URL.createObjectURL(blob);
            this.dataUrl = url;
        }
        this.recorder.start();
    }

    stop(){
        this.recorder && this.recorder.stop();
        this.recorder = undefined;
    }
}