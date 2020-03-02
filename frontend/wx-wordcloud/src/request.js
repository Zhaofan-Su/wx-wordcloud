export default function request(requestObject) {
    let baseURL = 'http://127.0.0.1:8000/api'

    let promise = new Promise(function (resolve, reject) {
        uni.request({
            url: baseURL + requestObject.url,
            method: requestObject.method,
            data: requestObject.data,
            header: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            dataType: 'json',
            success: (response) => {
                switch (parseInt(response.statusCode / 100)) {
                    case 4:
                        response.message = '客户端错误，请求包含语法错误'
                        break
                    case 5:
                        response.message = '服务器错误'
                        break
                    default:
                        break
                }
                resolve(response)
            },
            fail: (response) => {
                reject(response)
            }
        })
    })

    return promise
}