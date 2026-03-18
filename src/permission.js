
import router from './router'
import {getToken} from "@/util/auth.js";
import useUserStore from "@/stores/modules/userStore.js";
import {isReLogin} from "@/util/request.js";
import {ElMessage} from "element-plus";


const whiteList = ['/login', '/register']


const isWhiteList = (path) => {
    return whiteList.includes(path)
}


router.beforeEach((to, form, next) => {

    if (getToken()) {

        if (to.path === '/login' || to.path === '/register') {

            next({path: '/'})
        }


        else if (isWhiteList(to.path)) {

            next()
        }


        else {

            if (useUserStore().name === '') {

                isReLogin.show = true


                useUserStore().getInfo().then(res => {

                    isReLogin.show = false


                    next({path: to.path})
                }).catch(err => {

                    useUserStore().logOut().then(() => {

                        ElMessage.error(err)


                        next({path: '/login'})
                    })
                })
            } else {

                next()
            }
        }
    } else {

        if (isWhiteList(to.path)) {

            next()
        } else {

            next({path: '/login'})
        }
    }
})