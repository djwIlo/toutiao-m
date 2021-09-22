<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录 / 注册"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <!-- 基于 vant 的表单验证：
    1.使用 van-form 组件包裹所有的表单项 van-field
    2.给 van-form 绑定 submit 事件当表单提交的时候会触发 submit 事件
    提示：只有表单验证通过，它才会调用 submit
    3.使用 Field 的 rules 属性定义校验规则
     -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          icon-prefix="toutiao"
          left-icon="shouji"
          placeholder="请输入手机号"
          name="mobile"
          center
          :rules="formRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          center
          icon-prefix="toutiao"
          left-icon="yanzhengma"
          placeholder="请输入验证码"
          name="code"
          :rules="formRules.code"
        >
          <template #button>
            <van-button
              v-if="isCountDownShow"
              class="send-btn"
              size="mini"
              round
              @click.prevent="onSendSms"
              :loading="isSendSmsLoading"
              >发送验证码</van-button
            ><van-count-down
              v-else
              :time="time"
              @finish="isCountDownShow = true"
              format=" sss"
            />
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
      <!--/ 登录表单 -->
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
import { Toast } from "vant";

export default {
  name: "LoginIndex",
  data() {
    return {
      user: {
        mobile: "", // 手机号
        code: "", // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: "请输入手机号" },
          { pattern: /^1[3|5|7|8|9]\d{9}/, message: "手机号码格式错误" },
        ],
        code: [
          { required: true, message: "请输入验证码" },
          { pattern: /^\d{6}/, message: "验证码格式错误" },
        ],
      },
      time: 1000 * 60,
      isCountDownShow: true, // 控制发送验证码按钮跟倒计时的显示状态
      isSendSmsLoading: false // 发送验证码按钮的 Loading 状态
    };
  },
  methods: {
    // 如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。
    // 如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。
    async onLogin() {
      Toast.loading({
        message: "登录中...", // 文字提示
        forbidClick: true, // 禁止背景点击
        duration: 0, //展示时长(ms)，值为 0 时，toast 不会消失
      });
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const { data } = await login(this.user);
        // 4.处理响应结果
        Toast.success("登录成功");

        // 将后端返回的用户登录状态（token等数据）收到 vuex 容器中
        this.$store.commit('setUser', data.data)

        // 清除 layout 的缓存，让他重新渲染
        this.$store.commit('removeCachePage', 'LayoutIndex')

        // 登录成功，跳转回原来页面
        // this.$router.back() 
        //想用这种方式但是它不太好
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        Toast.fail("登录失败，手机号或验证码错误");
        console.log(err);
      }
    },
    onFailed(err) {
      if (err.errors[0]) {
        Toast({
          message: err.errors[0].message, // 提示消息
          position: "top", // 防止键盘高度覆盖提示消息
        });
      }
    },
    async onSendSms() {
      try {
        // 1.校验手机号
        await this.$refs["login-form"].validate("mobile");

        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true //展示按钮的 loading 状态， 防止网络慢用户多次点击请求按钮
        await sendSms(this.user.mobile);

        // 短信发出去了，隐藏发送按钮，显示倒计时
        this.isCountDownShow = false;

        // 倒计时结束 -> 隐藏倒计时，显示发送按钮
        // 监视倒计时结束时触发 finish 事件
      } catch (err) {
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要you不同的提示，那就需要判断了
        let message = "";
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = "发送太频繁了，请稍后再试";
        } else if (err.name === "mobile") {
          // 表单验证失败的错误提示
          message = err.message;
        } else {
          // 未知错误
          message = "发送失败，请稍后重试";
        }
        console.log(err);
        Toast({
          message,
          position: "top",
        });
      }

      // 无论验证码发送成功还是失败，组后都要关闭 loading
      this.isSendSmsLoading = false

      // this.$refs['login-form'].validate('mobile').then(res => {
      //   console.log(res);
      // })

      // 2.验证通过 -> 请求发送验证码 -> 用户接受短信 -> 输入验证码 -> 请求登录
      // 3.请求发送验证码 -> 显示倒计时
      // 4.倒计时结束 -> 隐藏倒计时，显示发送按钮
    },
  },
};
</script>

<style lang='less'>
.login-container {
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 16px;
      }
    }
  }
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
}
</style>