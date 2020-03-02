/* 
Date对象转为yyyy-MM-dd 
*/
export function dateFormat(value) {
    var year = value.getFullYear()
    var month = ("0" + (value.getMonth() + 1)).slice(-2)
    var day = ("0" + value.getDate()).slice(-2)
    return year + '-' + month + '-' + day
}

/* 
Date对象转为hh: mm: ss
*/
export function timeFormat(value) {
    var hour = ("0" + value.getHours()).slice(-2)
    var minutes = ("0" + value.getMinutes()).slice(-2)
    var ss = ("0" + value.getMilliseconds()).slice(-2)
    return hour + ':' + minutes + ":" + ss
}

/* 
Date对象转为yyyy-MM-dd hh：mm：ss
*/
export function dateTimeFormat(value) {
    return dateFormat(value) + " " + timeFormat(value)
}


export function getDayStartAndEnd(dateTime) {
    let day = {
        start: new Date(dateTime).getTime() - 8 * 60 * 60 * 1000,
        end: new Date(dateTime).getTime() + (15 * 60 + 59) * 60 * 1000
    }
    return day
}