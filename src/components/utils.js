const Swal = require("sweetalert2");

/**
 * @Group SweetAlert2
 * @Desc 알림창 관리 객체
 *
 * 1. Alert.load(params, onHide);
 * @param params: object {type, icon, title, text}
 *    - type: string [ info | success | warning | error | danger ]
 *  - icon: string [ info | success | warning | error ]
 *  - title: string, text: string
 * @param onHide: callback function (to perform after modal is closed)
 *   syntax => (result) => {}
 *   result: object {isConfirmed: boolean, isDenied: boolean, isDismissed: boolean, value: boolean}
 *
 * 2. Alert.find(type, params, onHide)
 * - find function using type
 * - type: string [ info | success | warning | error | danger ]
 *
 * 3. Alert.info(params, onHide)
 * 4. Alert.warning(params, onHide)
 * 5. Alert.success(params, onHide)
 * 6. Alert.danger(params, onHide)
 * 7. Alert.error(params, onHide)
 *
 * 8. Alert.confirm(params, onHide, time);
 * - params: object {title, text, confirmText, cancelText}
 *   title: string, text: string, confirmText: string, cancelText: string
 * - time: int - timeout seconds
 */
const Alert = {
    params: {},
    load: function (params, onHide) {
        this.params = params;

        Alert.draw(params, onHide);
    },
    find: function (type, params, onHide) {
        const alert_type = {
            info: this.info,
            warning: this.warning,
            success: this.success,
            danger: this.danger,
            error: this.danger
        }

        let func = this.info;
        if (Object.keys(alert_type).includes(type)) {
            func = alert_type[type];
        }

        func(params, onHide);
    },
    /**
     * [Alert]
     * @param params
     * @param onHide
     */
    info: function (params, onHide) {
        params.type = 'info';
        params.icon = 'info';

        Alert.draw(params, onHide);
    },
    warning: function (params, onHide) {
        params.type = 'warning';
        params.icon = 'warning';

        Alert.draw(params, onHide);
    },
    success: function (params, onHide) {
        params.type = 'success';
        params.icon = 'success';

        Alert.draw(params, onHide);
    },
    danger: function (params, onHide) {
        params.title = '에러 발생!';
        params.type = 'danger';
        params.icon = 'error';

        Alert.draw(params, onHide);
    },
    error: function (params, onHide) {
        params.type = 'danger';
        params.icon = 'error';

        Alert.draw(params, onHide);
    },
    /**
     * [Alert] 알림창 그리기
     * @param params
     * @param {'error'|'success'|'warning'|'info'} params.icon 아이콘 유형
     * @param {string} params.title 알림창 제목
     * @param {string} params.text 알림창 내용
     * @param {'danger'|'success'|'warning'|'info'} params.type 버튼 유형
     * @param {number} params.time 알림창 닫힘 시간
     * @param {boolean} params.timeDisplay 알림창 닫힘 시간 표시여부
     * @param {function} onHide 알림창 닫힐때 callback
     */
    draw: function (params, onHide) {
        let icon = '';
        let title = '';
        let text = '';
        let btnClass = '';

        if (params.type !== undefined) {
            icon = params.icon;
            title = params.title || '알림';
            text = params.text;
            btnClass = params.type;
        } else {
            icon = 'error';
            title = '알수 없음!';
            btnClass = 'danger';
        }
        if (onHide === undefined) {
            onHide = () => {
            };
        }

        let timerInterval;
        let time = params.time || 100
        let timeContext = '';
        if (params.time !== undefined && params.timeDisplay !== undefined && params.timeDisplay) {
            timeContext = `<br>[ <strong>${params.time}</strong>초 내로 팝업이 종료됩니다. ]`;
        }

        Swal.fire({
            icon: icon,
            title: title,
            html: text + timeContext,
            timer: time * 1000,
            willOpen: () => {
                if (params.time != undefined) {
                    timerInterval = setInterval(() => {
                        const section = Swal.getContent().querySelector('strong');
                        if (section != null) {
                            section.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                        }
                    }, 1000);
                }
            },
            willClose: () => {
                if (params.time != undefined) {
                    clearInterval(timerInterval);
                }
            },
            customClass: {
                confirmButton: `btn btn-${btnClass}`,
                cancelButton: 'btn btn-secondary'
            },
        }).then(onHide);
    },
    /**
     * [Alert] 확인 알림창
     * @param params
     * @param {string} params.title 알림창 제목
     * @param {string} params.text 알림창 내용
     * @param {string} params.confirmText 확인 버튼
     * @param {string} params.cancelText 취소 버튼
     * @param {string} params.icon 아이콘
     * @param {number} params.time 알림창 지속 시간
     * @param {function} onHide 알림창 닫힐때 callback
     */
    confirm: function (params, onHide) {
        let title = '정말로 삭제하시겠습니까?';
        let text = '삭제 시 복구가 불가능합니다.';

        let confirmButtonText = '예';
        let cancelButtonText = '아니오';
        let icon = 'info';
        let time = params.time;

        // param setting
        if (params !== undefined) {
            title = params.title || '알림';
            text = params.text;
            confirmButtonText = params.confirmText || '예';
            cancelButtonText = params.cancelText || '아니오';
            icon = params.icon || 'info';
        }

        // onHide setting
        if (onHide === undefined) onHide = () => {
        };

        // timeout setting
        if (time === undefined) time = false;
        else time *= 1000;

        let timerInterval;

        Swal.fire({
            title: title,
            html: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            customClass: {
                confirmButton: 'btn btn-info',
                cancelButton: 'btn btn-secondary'
            },
            timer: time,
            willOpen: () => {
                if (time !== false) {
                    timerInterval = setInterval(() => {
                        const strong = Swal.getContent().querySelector('strong');
                        if (strong != null) {
                            strong.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                        }
                    }, 1000);
                }
            },
            willClose: () => {
                if (time !== false) {
                    clearInterval(timerInterval);
                }
            }
        }).then(onHide);
    },
    printLoading: function (params) {
        let text = params.text || '데이터를 출력 중입니다.<br>잠시만 기다려주십시오!';
        Swal.fire({
            html: text,
            width: '25rem',
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            backdrop: 'rgba(0, 0, 0, 0.6)'
        });
    }
};

module.exports = Alert;