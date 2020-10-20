<template>
    <div>
        <!-- info:灰色按钮 -->
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        logout(){
            //清空session，重定向到登陆
            window.sessionStorage.clear()
            
            this.$router.push('/login')
        }
    }
};
</script>

<style lang="less" scoped>

</style>