<template>
    <!-- //大背景 蓝色 -->
    <div class="login_container">
        <!-- //白色 -->
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <!-- //登陆图片 -->
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区域 label-width是定义label的宽度-->
            <!-- :model=loginForm数据绑定到loginForm对象上，loginForm对象定义在行为区script -->
            <!--  :model是v-bind:model的缩写，v-model常常用于双向数据绑定-->
            <!-- :rules表单验证规则 -->
            <!-- loginFromRef表单的实例对象 -->
            <el-form ref="loginFromRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 验证规则加在item上，而不是input上-->
                <el-form-item prop="username">
                    <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--密码 -->
                 <el-form-item prop="password">
                    <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!--按钮 class为了下面设置样式 居右对齐-->
                <el-form-item class="btns">
                    <!-- 登陆按钮绑定单击事件，后面就是事件的处理函数，进行预验证 -->
                    <el-button type="primary" @click="login">登录</el-button>
                    <!-- 为重置按钮绑定单击事件 -->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //这是登陆表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            //这是表单的验证规则属性
            loginFormRules:{
                //验证用户名
                username: [
                    { required: true, message: '请输入登陆名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                //验证密码
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods:{
        //点击重置按钮，重置登陆表单
        resetLoginForm(){
            // console.log(this)
            //这个表单的refs属性，就是它的实例
            this.$refs.loginFromRef.resetFields();
        },
        login(){
            this.$refs.loginFromRef.validate(async valid=>{
                // console.log(valid);
                if(!valid){
                    return;
                }
                //this.$http发起登陆的post请求，参数是路径+对象，loginForm保存了用户填写的数据，所以直接作为请求的参数
                //发现返回的是promise，所以加上await，这个只能在async方法中用，所以也要加上
                //异步函数，加上await 直接拿到服务器返回的数据
                const { data:res } = await this.$http.post('login',this.loginForm);
                //result只有data属性是服务器返回的，所以看data就行了
                //data:res将返回值的data属性命名为res
                // console.log(result.data);
                if(res.meta.status != 200){
                    // return console.log("登陆失败");改为弹框
                    return this.$message.error('登陆失败！');
                }
                this.$message.success('登陆成功');
                // console.log("登陆成功");
                // 1. 将登录成功之后的 token，便于访问其他接口，保存到客户端的 sessionStorage 中
                //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中，而不是localstorge（持久有效）
                //token是window的 setItem（key，value）
                window.sessionStorage.setItem("token",res.data.token);
                // 2. 通过编程式导航对象 router跳转到后台主页，路由地址是 /home
                this.$router.push("/home")
            });
        }
    }
};
</script>

<style lang="less" scoped>//lang=less 支持less语法，scoped控制组件样式生效区间，
//有scoped则该节点样式只在当前组件下生效，即单文件
//类名选择器
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;//圆角边框
    position: absolute;
    //距离左侧和顶部各50%
    left: 50%;
    top: 50%;
    //上面把方框的左上角移到中央，所以需要减去长高的一半去修正位置
    transform: translate(-50%,-50%);

    .avatar_box {//less嵌套语法
        height: 130px;
        width: 130px;
        border: 1px solid #eee;//边框线
        border-radius: 50%;//圆角边框
        padding: 10px;//图片和边框之间的间隙
        //加阴影
        box-shadow: 0 0 10px #ddd;
        //移动到中央
        position: absolute;
        left: 50%;
        //-50%向后撤自身的50%，向上也是
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            //图片背景颜色
            background-color: #eee;
        }
    }
}

.login_form{
    position: absolute;
    //文本框放在底部
    bottom: 0;
    //文本框占满底部
    width: 100%;
    //加边距
    padding: 0 20px;
    //溢出处理
    box-sizing: border-box;
}

.btns{
    display: flex;//弹性盒子模型
    justify-content: flex-end;
}

</style>