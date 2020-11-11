<template>
    <el-container class="home-container">
        <!-- info:灰色按钮 -->
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 即左侧-->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <!-- :unique-opened加冒号代表属性绑定  :router开启路由模式-->
                <el-menu background-color="#333744" text-color="#fff"
                    active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse"
                    :collapse-transition="false" :router="true"
                    :default-active="activePath">
                    <!-- 一级菜单 -->
                    <!--  :index="item.id保证点击一个 不影响另外一个 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单的模版区 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 动态配置文本-->
                            <span>{{item.authName}}</span>
                        </template>
                        
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" 
                        :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧 内容主体-->
            <el-main>
                <!-- 定义完路由规则后 放置路由占位符 home组件重定向到welcome 所以就在占位符上显示出来-->
            <router-view>

            </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            //左侧菜单数据
            menulist:[],
            //生产不同的图标
            iconsObj:{
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            //false代表不折叠
            isCollapse:false,
            //被激活的连接地址
            activePath:''
        }
    },
    //页面加载时
    created(){
        this.getMenuList(),
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            //清空session，重定向到登陆
            window.sessionStorage.clear()
            
            this.$router.push('/login')
        },
        //获取所有的菜单
        async getMenuList(){
            //menus路径返回的data对象命名为res
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status!==200)return this.$message.error(res.meta.msg)
            //res.data是个数组 menulist也是数组
            this.menulist = res.data
            console.log(res)
        },
        //左侧菜单的折叠和展开
        toggleCollapse(){
            this.isCollapse=!this.isCollapse
        },
        //保存连接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath=activePath
        }

    }
};
</script>

<style lang="less" scoped>
//充满整个屏幕
.home-container{
    height: 100%;
}
//elementui中组件的名字也就是类名 el-header
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;//左右贴边对齐
    padding-left: 0;//清除图片左侧的空白
    align-items: center;//按钮居中
    color: #fff;//文本白色
    font-size: 20px;//文本大小
    > div {//嵌套调整
        display: flex;
        align-items: center;
        span{//文本和图片间距
            margin-left: 15px;
        }
    }
}

.el-aside{
    background-color: #333744;
    //解决不对齐的问题
    .el-menu{
        border-right: none;
    }
}

.el-main{
    background-color: #EAEDF1;
}

//图标和文字间距
.iconfont{
    margin-right: 10px;
}

.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>