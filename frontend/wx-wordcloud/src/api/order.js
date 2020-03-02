import request from '../request'

export function uoloadInfo(data) {
    return request({
        url: '/uploadInfo',
        method: 'post',
        data
    })
}