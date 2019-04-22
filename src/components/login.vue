<template>
    <div class="login-container">
        <div class="login-box">
            <div class="avatar-box">
                <img src="../assets/img/logo.png" alt="">
            </div>

            <el-form ref="loginFormRef" :model="loginForm" :rules="rules">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username">
                        <i slot="prefix" class="iconfont icon-user"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" show-password>
                        <i slot="prefix" class="iconfont icon-3702mima"></i>
                    </el-input>
                </el-form-item>
                <el-row>
                    <el-col :push="15">
                        <el-button type="primary" @click = "login()">登录</el-button>
                        <el-button type="info" @click="resetForm()">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>

        </div>
    </div>
</template>

<script>
export default {
    methods:{
        login(){
            // 点击登录按钮验证账号密码并返回给用户，设置token
            // console.log(this)
            this.$refs.loginFormRef.validate(async (valid) => {
            if (valid) {
                const {data:dt} = await this.$http.post('/login',this.loginForm)
                console.log(dt)
                
                if(dt.meta.status != 200){
                    return this.$message.error(dt.meta.msg);
                }
                window.sessionStorage.setItem('token',dt.data.token)
                this.$router.push('/home')
            }
            })
        },
        // 重置
        resetForm() {
            
            this.$refs.loginFormRef.resetFields();
        }
    }
    ,
    data(){
        return {
            loginForm :{ 
                username:'',
                password:''
            },
            rules: {
                username: [
                    { required: true, message: '用户名必写', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码必填', trigger: 'blur' },
                ]
            }
        }  
    }
}

</script>

<style lang="less" scoped>
    .login-container {
        height: 100%;
        background: #2b4b6b;
        overflow: hidden;
        .login-box{
            width: 450px;
            height: 304px;
            background: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .el-form{
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
            .avatar-box{
                width: 130px;
                height: 130px;
                border: 1px solid #eee;
                border-radius: 50%;
                padding: 8px;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                background: #fff;
                box-shadow: 0 0 10px #eee;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #eee;
                }
            }
        }
    }
</style>
