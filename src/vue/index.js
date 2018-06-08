import Vue from "vue"
import App from "index.vue"
import VueRouter from "vue-router"

// import Home from "home.vue"
// import Products from "products/index.vue"
// import List from "products/list.vue"
// import Detail from "products/detail.vue"

const Home = (r) => {
    require.ensure([],()=>{
        r(require("home.vue"))
    })
}
const Products = (r) =>{
    require.ensure([],()=>{
        r(require("products/index.vue"))
    })
}
const List = (r)=>{
    require.ensure([],()=>{
        r(require("products/list.vue"))
    })
}
const Detail = (r) =>{
    require.ensure([],()=>{
        r(require("products/detail.vue"))
    })
}

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {path: "/", component: Home}, // 首页
        {path: "/products", component: Products}, // 产品首页
        {path: "/products/list", component: List}, // 列表
        {path: "/products/detail", component: Detail}, // 详情
        {path: "*", redirect: "/"}
    ]
})
router.afterEach(router => {
    document.documentElement.scrollTop = document.body.scrollTop = 0
})

new Vue({
    el: "#app",
    router,
    render: h => h(App)
})
