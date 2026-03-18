import axios from "axios"
import {ElMessage, ElMessageBox} from "element-plus"
import {getToken} from "@/util/auth"

axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8"
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 20000,
})

service.interceptors.request.use(config => {
    const isToken = config.headers?.isToken !== false
    const token = getToken()
    if (isToken && token) {
        config.headers["Authorization"] = "Bearer " + token
    }

    const isRepeatSubmit = config.headers?.isRepeatSubmit !== false
    const includesMethod = ["post", "put"].includes(config.method)
    if (!isRepeatSubmit && includesMethod) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === "object" ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }

        const sessionValue = sessionStorage.getItem("sessionKey")
        const sessionObj = sessionValue ? JSON.parse(sessionValue) : null
        if (sessionObj) {
            const interval = 1000
            if (requestObj.url === sessionObj.url && requestObj.data === sessionObj.data && requestObj.time - sessionObj.time < interval) {
                ElMessage.error('请勿重复提交')
            }
        }

        sessionStorage.removeItem("sessionKey", JSON.stringify(requestObj))
    }

    return config
}, error => {
    ElMessage.error(error)
})

export const isReLogin = {show: false}

const handleReLogin = () => {
    if (isReLogin.show) return
    isReLogin.show = true
    ElMessageBox.confirm(
        '', '系统提示', {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
        }
    ).then(() => {
        isReLogin.show = false
        //调用退出登录的方法(清空用户信息)
        useUserStore().logOut().then(() => {
            //退出后跳转到登录页面(重新登录)
            location.href = '/login' //相当于在浏览器地址栏输入这个地址
        })
    }).catch((err) => {
        isReLogin.show = false
    })
}

service.interceptors.response.use(res => {
    const includesBlob = ["blob"].includes(res.request.responseType)
    if (includesBlob) {
        return res.data
    }

    const code = res.data.code || 200
    const msg = res.data.msg || "操作失败"

    if (code === 401) {
        handleReLogin()
        return Promise.reject('当前登录状态已失效，请重新登录')
    }

    if (code !== 200) {
        return Promise.reject(new Error(msg))
    }

    return res.data
}, error => {

    let {message, response} = error
    if (response?.status === 401) {
        handleReLogin()
        return Promise.reject('当前登录状态已失效，请重新登录')
    }

    const errMap = {
        "Network Error": "访问后台接口网络异常",
        "timeout": "访问后台接口超时",
        "Request failed with status code": "访问接口" + message.substr(message.length - 3) + "异常"
    }

    for (const [key, value] of Object.entries(errMap)) {
        if (message.includes(key)) {
            message = value
        }
    }

    ElMessage.error(message)
    return Promise.reject(error)
})

export default service