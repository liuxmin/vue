import request from '@/util/request'

//登录方法
export function login(data) {
    return request({
        url: '/login', //后端接口地址
        headers: { //请求头配置
            isToken: false //告诉拦截去, 这个请求不需要token
        },
        method: 'post', //请求方法: post请求(严格遵守后端逻辑)
        data: data //要发送的数据
    })
}

//获取当前用户信息
export function getInfo() {
    return request({
        url: '/getInfo',
        method: 'get',
    })
}

//退出登录
export function logout() {
    return request({
        url: '/logout',
        method: 'post',
    })
}