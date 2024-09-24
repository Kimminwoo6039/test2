export interface IDateProps {
    // 반환 유형
    date?: Date;
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minutes?: number;
    seconds?: number;
    returnType?: 'day' | 'month' | 'year' | 'timestamp' | 'timeonly';
}

export const DateUtil = {
    getDateToStr: function (params?: IDateProps) {
        let date = params?.date || new Date();

        let day = params?.day || 0;
        let month = params?.month || 0;
        let year = params?.year || 0;
        let hour = params?.hour || 0;
        let minutes = params?.minutes || 0;
        let seconds = params?.seconds || 0;

        date.setDate(date.getDate() + day);
        date.setMonth(date.getMonth() + month);
        date.setFullYear(date.getFullYear() + year);
        date.setHours(date.getHours() + hour);
        date.setMinutes(date.getMinutes() + minutes);
        date.setSeconds(date.getSeconds() + seconds);

        year = date.getFullYear();
        let monthStr = DateUtil.leftPad(date.getMonth() + 1);
        let dayStr = DateUtil.leftPad(date.getDate());
        let hourStr = DateUtil.leftPad(date.getHours());
        let minuteStr = DateUtil.leftPad(date.getMinutes());
        let secondStr = DateUtil.leftPad(date.getSeconds());

        const valHash = {
            object: date,
            day: [year, monthStr, dayStr].join('-'),
            month: [year, monthStr].join('-'),
            year: [year].join(''),
            timestamp: [year, monthStr, dayStr].join('-') + ' ' + [hourStr, minuteStr, secondStr].join(':'),
            timeonly: [hourStr, minuteStr, secondStr].join(':'),
        }

        const type = params?.returnType || 'day';
        if (Object.keys(valHash).includes(type)) {
            return valHash[type];
        }

        return valHash.day;
    },
    diff: function (from: number, to: number) {
        let timeDiff = (to - from)  / 1000;

        // 초 추출 - 분이 되지 못한 정수 값의 초를 얻기위해 모듈러 연산
        const seconds = Math.floor(timeDiff % 60);

        // 분 추출: 초 단위 시간 차를 분 단위로 변환
        timeDiff = Math.floor(timeDiff / 60);
        const minutes = Math.floor(timeDiff % 60);

        // 시 추출: 분 단위 시간 차를 시 단위로 변환
        timeDiff = Math.floor(timeDiff / 60);
        const hours = Math.floor(timeDiff % 24);

        let times = [hours, minutes, seconds];
        if(hours === 0){
            times = [minutes, seconds];
        }
        return times.map(v => DateUtil.leftPad(v)).join(':');
    },
    leftPad: function (str: number) {
        return str >= 10 ? str.toString() : '0' + str.toString();
    }
}