const Swal = require("sweetalert2");

export interface AlertOptions {
    title?: string; // 알림창 제목
    text: string; // 알림창 내용
    icon?: 'error'|'success'|'warning'|'info'|'question';
    type?: 'danger'|'success'|'warning'|'info';
    closeTime?: number; // 알림창 닫힘시간
    closeTimeDisplay?: boolean; //알림창 닫힘 사용 여부
    onHide?: () => {} // 알림창 닫힐때 callback
}

export interface AlertLoadingOptions {
    title?: string;
    text?: string;
    icon?: 'error'|'success'|'warning'|'info';
}

export interface AlertConfirmOptions {
    title?: string; // 알림창 제목
    text: string; // 알림창 내용
    icon?: 'error'|'success'|'warning'|'info'|'question';
    confirmText?: string; // 확인 버튼
    cancelText?: string; // 취소 버튼
    closeTime?: number; // 알림창 닫힘시간
    closeTimeDisplay?: boolean; //알림창 닫힘 사용 여부
    onHide?: () => {} // 알림창 닫힐때 callback
}

export class Alert {
    static info(options: AlertOptions){
        options = Object.assign({}, {
            type: 'info',
            icon: 'info'
        }, options);

        Alert.alert(options);
    }

    static warning(options: AlertOptions){
        options = Object.assign({}, {
            type: 'warning',
            icon: 'warning'
        }, options);

        Alert.alert(options);
    }

    static success(options: AlertOptions){
        options = Object.assign({}, {
            type: 'success',
            icon: 'success'
        }, options);

        Alert.alert(options);
    }

    static danger(options: AlertOptions){
        options = Object.assign({}, {
            type: 'danger',
            icon: 'error'
        }, options);

        Alert.alert(options);
    }

    static alert(options: AlertOptions){
        // 알림창 닫힘 설정
        let timerInterval: NodeJS.Timer;
        let time = options.closeTime || 5;

        let timeContext = '';
        if(options.closeTimeDisplay){
            timeContext = `<br>[ <strong>${time}</strong>초 내로 팝업이 종료됩니다. ]`;
        }

        Swal.fire({
            icon: options.icon || 'info',
            title: options.title || '알림',
            html: options.text + timeContext,
            timer: time * 1000,
            willOpen: () => {
                if (options.closeTimeDisplay) {
                    timerInterval = setInterval(() => {
                        const section = Swal.getContainer();
                        if (section !== null) {
                            const ctx = section.querySelector('strong');
                            if(ctx){
                                // @ts-ignore
                                ctx.textContent = String(Math.ceil(Swal.getTimerLeft() / 1000));
                            }
                        }
                    }, 1000);
                }
            },
            willClose: () => {
                if (timerInterval !== undefined) {
                    clearInterval(timerInterval);
                }
            },
            customClass: {
                confirmButton: `btn btn-${options.type || 'info'}`,
                cancelButton: 'btn btn-secondary'
            },
        }).then(options.onHide);
    }

    static loading(options: AlertLoadingOptions){
        Swal.fire({
            title: options.title,
            html: options.text || '데이터를 출력 중입니다.<br>잠시만 기다려주세요!',
            width: '25rem',
            icon: options.icon,
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            backdrop: 'rgba(0, 0, 0, 0.6)'
        });
    }

    static confirm(options: AlertConfirmOptions){
        // 알림창 닫힘 설정
        let timerInterval: NodeJS.Timer;
        let time = options.closeTime || 5;

        let timeContext = '';
        if(options.closeTimeDisplay){
            timeContext = `<br>[ <strong>${time}</strong>초 내로 팝업이 종료됩니다. ]`;
        }

        Swal.fire({
            title: options.title || '알림',
            html: options.text,
            icon: options.icon || 'info',
            showCancelButton: true,
            confirmButtonText: options.confirmText || '확인',
            cancelButtonText: options.cancelText || '취소',
            customClass: {
                confirmButton: 'btn btn-info',
                cancelButton: 'btn btn-secondary'
            },
            timer: time,
            willOpen: () => {
                if (options.closeTimeDisplay) {
                    timerInterval = setInterval(() => {
                        const section = Swal.getContainer();
                        if (section !== null) {
                            const ctx = section.querySelector('strong');
                            if(ctx){
                                // @ts-ignore
                                ctx.textContent = String(Math.ceil(Swal.getTimerLeft() / 1000));
                            }
                        }
                    }, 1000);
                }
            },
            willClose: () => {
                if (timerInterval !== undefined) {
                    clearInterval(timerInterval);
                }
            },
        }).then(options.onHide);
    }
}

export default Alert;