<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from './store'
export default {
  name: 'App',
  components: {},
  props: [],
  data() {
  },
  computed: {},
  watch: {},
  created() {
    // 连接webSocket，用于接收后台实时报警信息推送
      this.webSocket()
    
  },
  mounted() {},
  methods: {
    webSocket() {
      console.log('进入wedsocket前端方法')
      const that = this
      if (typeof (WebSocket) === 'undefined') {
        this.$notify({
          title: '提示',
          message: '当前浏览器无法接收实时报警信息，请使用谷歌浏览器！',
          type: 'warning',
          duration: 0
        })
      } else {
        console.log('进入else代码...')
        // 获取token保存到vuex中的用户信息，此处仅适用于本项目，注意删除或修改
        this.$store.dispatch('GetInfo').then(res => {
          console.log(res.user.phone)
          // 实例化socket，这里我把用户名传给了后台，使后台能判断要把消息发给哪个用户，其实也可以后台直接获取用户IP来判断并推送
          // const socketUrl = 'ws://127.0.0.1:8000/websocket/' + info.username;
          console.log('开始连接对应的ws地址...')
          this.socket = new WebSocket('ws://36.35.109.71:8000/webSocket/' + res.user.phone)
          // this.socket = new WebSocket('ws://localhost:8000/webSocket/' + res.user.phone)
          // 监听socket打开
          this.socket.onopen = function() {
            console.log('浏览器WebSocket已打开')
          }
          // 监听socket消息接收
          this.socket.onmessage = function(msg) {
            console.log('开始接受socket消息，消息为' + msg.data)
            console.log('开始接受socket消息，消息为' + JSON.parse(msg.data).msg)
            // 转换为json对象
            // const data = JSON.parse(msg.data)
            that.$notify({
              title: JSON.parse(msg.data).msg,
              // 这里也可以把返回信息加入到message中显示
              message: '实时提醒服务连接成功',
              type: JSON.parse(msg.data).msgType,
              duration: 0,
              onClick: () => {
                that.$router.push({
                  // path: '/holiday/ref/index'
                  path: '/holidayRecord/index'
                })
              }
            })
          }
          // 监听socket错误
          this.socket.onerror = function() {
            that.$notify({
              title: '错误',
              message: '服务器错误，无法接收实时报警信息',
              type: 'error',
              duration: 0
            })
          }
          // 监听socket关闭
          this.socket.onclose = function() {
            console.log('WebSocket已关闭')
          }
        })
      }
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
        // TODO 提交表单
        // this.notify('请假状态有变化，请修改', 'error')
          this.webSocket()
          // this.$notify({
          //   title: '请假状态有变化，请修改',
          //   type: 'success',
          //   duration: 2500
          // })
        } else {
          return
        }
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    }
  }
}
</script>
