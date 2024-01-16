export interface VideoOptions {
    // 거울 모드
    mirror?: boolean;
}

export class VideoUtil {
    obj: HTMLVideoElement;
    options: VideoOptions;

    constructor(obj: HTMLVideoElement, options?: VideoOptions) {
        this.obj = obj;
        this.options = Object.assign({}, {
            mirror: true
        }, options);
        if(this.obj){
            this.obj.classList.toggle('reverse', this.options.mirror);
        }
    }

    play(){
        return this.obj.play();
    }

    stop(){
        this.obj.pause();
    }

    saveImage(){
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

    downloadImage(){
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