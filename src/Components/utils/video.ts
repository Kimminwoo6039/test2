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
    constructor(obj: HTMLVideoElement, options?: VideoOptions) {
        this.obj = obj;
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
     * [VideoUtil] Video 현재 화면 이미지 다운로드
     */
    downloadImage(): void {
        const a = document.createElement('a');

        a.href = this.saveImage();
        a.download = Date.now() + '.png';
        document.body.appendChild(a);
        a.click();
    }

    /**
     * [옵션 설정] 거울 모드 설정
     * @param {boolean} mirror 거울 모드 여부
     */
    setMirror(mirror: boolean){
        this.options.mirror = mirror;
        this.obj.classList.toggle('reverse', this.options.mirror);
    }
}

export default VideoUtil;