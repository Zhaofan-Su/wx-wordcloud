/**
 * 
 * ArrayBuffer转为16进制字符串
 */
export function ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )

    return hexArr.join('')
}

/**
 * 
 * 十进制数字转为16进制
 */
export function ds2hex(value) {
    let num = parseInt(value)
    return ('00' + num.toString(16)).slice(-2)
}

/**
 * 
 * 二进制转为16进制
 */
export function bi2hex(value) {
    let temp = parseInt(value, 2)
    return ('00' + temp.toString(16)).slice(-2)
}

/**
 * 
 * 16进制转为十进制数字
 */
export function hex2ds(value) {
    return parseInt(value, 16)
}

/**
 * 
 * 计算checksum
 */
export function getChecksum(array) {
    // 输入为16进制

    let result = '0x' + array[0]
    for (let i = 1; i < array.length; i++) {
        result = result ^ ('0x' + array[i])
    }
    return ('00' + result.toString(16)).slice(-2)

}


/**
 * 
 * @param {翻身/步数的原始数据位} dataCode 
 * @param {开始采集数据的时间} startHour 
 * @param {最终数据形式，一个数据表示一个minutes内的总运动量} minutes 
 */
export function formatSportCurve(dataCode, startHour, minutes, dayMode = true) {
    // 72个byte记录60分钟的运动情况
    // 60分钟得到18个数据
    // 每10分钟由3个数据进行记录
    // minutes为10,20,30,40,50,60，表示最终数据形式为多少分钟展示一次
    let dayValue = []
    let nightValue = []
    let gap = 60 / minutes
    let dataGap = (minutes / 10) * 3
    for (let i = 0; i < dataCode.length; i += dataGap * 4) {

        let steps = 0
        let movements = 0
        for (let k = 1; k <= dataGap; k++) {
            let byte = '0x' + dataCode.substring(i + 4 * (k - 1), i + 4 * k)
            let bits = ('0000000000000000' + parseInt(byte, 16).toString(2)).slice(-16)

            // 0代表白天模式，1代表睡眠模式，2代表运动模式
            let type = byte >>> 14

            if (type === 0) {
                steps += parseInt(bits.substring(2, 16), 2)
                movements += 0
            } else if (type === 1) {
                steps += 0
                movements += parseInt(bits.substring(2, 16), 2)
            }
        }
        if (dayMode) {
            dayValue.push(steps)
        } else {
            nightValue.push(movements)
        }

    }
    // 1个小时的数据由72位原始数据位表示
    let hours = dataCode.length / 72
    let categories = []
    for (let j = 0; j < hours * gap; j++) {
        let minuteTime = ('0' + (j % gap) * minutes).slice(-2)
        let hourTime = ('0' + (startHour + Math.floor(j / gap))).slice(-2)
        categories.push(hourTime + ':' + minuteTime)
    }

    if (dayMode) {
        let result = {
            categories: categories,
            value: dayValue
        }
        return result
    } else {
        let result = {
            categories: categories,
            value: nightValue
        }
        return result
    }

}