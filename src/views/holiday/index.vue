<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">用户名</label>
        <el-input v-model="query.userName" clearable placeholder="用户名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">部门名称</label>
        <el-input v-model="query.deptName" clearable placeholder="部门名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">手机号</label>
        <el-input v-model="query.phone" clearable placeholder="手机号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">请假类型</label>
        <el-select v-model="query.type" clearable placeholder="请选择" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in dict.holiday_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">申请结果</label>
        <el-select v-model="query.status" clearable placeholder="请选择" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in dict.holiday_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">休假结果</label>
        <el-select v-model="query.result" clearable placeholder="请选择" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery">
          <el-option
            v-for="item in dict.holiday_result"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" :disabled="true" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" :disabled="true" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" :disabled="true" style="width: 370px;" />
          </el-form-item>
          <!-- <el-form-item label="开始时间" prop="startDate">
            <el-date-picker v-model="form.startDate" type="date" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker v-model="form.endDate" type="date" style="width: 370px;" />
          </el-form-item> -->
          <el-form-item label="请假时间" prop="rangeDate">
            <el-date-picker
              v-model="form.rangeDate"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{width: '100%'}"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              clearable
            />
          </el-form-item>
          <el-form-item label="天数">
            <el-input v-model="form.count" :disabled="true" style="width: 370px;" />
          </el-form-item>
          <!-- <el-form-item label="不可拆分" prop="split">
            <el-switch v-model="form.split" />
          </el-form-item> -->
          <el-form-item label="请假类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.holiday_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="status_show" label="申请结果" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.holiday_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="result_show" label="休假结果" prop="result">
            <el-select v-model="form.result" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in dict.holiday_result"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @row-click="open">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="phone" label="手机号" />
        <!-- <el-table-column prop="rangeDate" label="请假时间" /> -->
        <el-table-column prop="startDate" label="开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startDate,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endDate,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="split" label="假期不可拆分">
          <el-switch v-model="split" disabled />
        </el-table-column> -->
        <el-table-column prop="count" label="天数" />
        <el-table-column prop="type" label="请假类型">
          <template slot-scope="scope">
            {{ dict.label.holiday_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="申请结果" />
        <el-table-column prop="result" label="休假结果" />
        <!-- <template slot-scope="scope">
            {{ dict.label.holiday_status[scope.row.status] }}
          </template> -->

        <!-- <el-table-column v-permission="['admin','holidayRecord:edit','holidayRecord:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column> -->
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudHolidayRecord from '@/api/holidayRecord'
import { getPassedRecord } from '@/api/holidayPassedRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, userName: null, deptName: null, startDate: null, endDate: null, count: null, createTime: null, updateTime: null, status: null, phone: null }
export default {
  name: 'HolidayRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['holiday_type', 'holiday_status','holiday_result'],
  cruds() {
    return CRUD({ title: '请假记录', url: 'api/holidayRecord', sort: 'id,desc', crudMethod: { ...crudHolidayRecord }})
  },
  data() {
    return {
      status_show: false,
      result_show: false,
      permission: {
        add: ['admin', 'holidayRecord:add'],
        edit: ['admin', 'holidayRecord:edit'],
        del: ['admin', 'holidayRecord:del']
      },
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        // startDate: [
        //   { required: true, message: '开始时间不能为空', trigger: 'blur' }
        // ],
        // endDate: [
        //   { required: true, message: '结束时间不能为空', trigger: 'blur' }
        // ],
        type: [
          { required: true, message: '请假类型不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        rangeDate: [{
          required: true,
          type: 'array',
          message: '请至少选择一个时间',
          trigger: 'change'
        }]
      },
      queryTypeOptions: [
        { key: 'userName', display_name: '用户名' },
        { key: 'deptName', display_name: '部门名称' },
        { key: 'phone', display_name: '手机号' }
      ]
    }
  },
   created() {
  },
  watch: {
    'form.rangeDate': function(newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
      console.log(this.getDiffDay(newVal[0], newVal[1]))
      this.form.count = this.getDiffDay(newVal[0], newVal[1])
    },
    'form': function(newVal, oldVal) {
      console.log('表单对象发生变化')
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // // 编辑前做的操作
    // [CRUD.HOOK.afterToEdit](crud, form) {
    //   form.rangeDate = [form.startDate, form.endDate]
    // }
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // this.status_show = true
      this.result_show = true
      var array = []
      array.push(this.parseTime(form.startDate, '{y}-{m}-{d}'))
      array.push(this.parseTime(form.endDate, '{y}-{m}-{d}'))
      this.form.rangeDate = array
    },
    
    // 新增前做的操作
    [CRUD.HOOK.beforeToAdd](crud, form) {
      this.$store.dispatch('GetInfo').then(res => {
        this.form.userName = res.user.username
        this.form.deptName = res.user.dept.name
        this.form.phone = res.user.phone
      })
      this.result_show = false
      this.webSocket()
      // this.form.result = ''
    },
    // 新增取消后
    [CRUD.HOOK.afterAddCancel](crud, form) {
      this.$store.dispatch('GetInfo').then(res => {
        // this.form.rangeDate = ['', '']
        this.form.type = ''
      })
    },
    // 获取两个时间之间的天数
    getDiffDay(date_1, date_2) {
      // 计算两个日期之间的差值
      var totalDays, diffDate
      var myDate_1 = Date.parse(date_1)
      var myDate_2 = Date.parse(date_2)
      // 将两个日期都转换为毫秒格式，然后做差
      diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
      totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
      // console.log(totalDays)
      return totalDays + 1
    },
    open(val) {
      if (val && val.status == '被抵消') {
        getPassedRecord(val.id).then(res => {
          console.log('进入被抵消详情前端方法===========================')
          if(res != null && res != ''){
            var pass = res['pass']
            var pre = res['pre'] 
            console.log((res['pass'])[0][0]) //用户
            console.log((res['pass'])[0][1]) //条件类
            console.log((res['pass'])[0][2]) //条件项
            console.log((res['pass'])[0][3]) //权重

            var countpass = 0
            var countpre = 0
            var htmlstr = '<div>' + '低优先级用户： '+ pass[0][0] + '</div>'
            htmlstr += "<table border='1' cellspacing='0' width='100%'>";
            for(var i = 0; i < pass.length; i++) {
              htmlstr += "<tr style='background:#ffffff; color:#ff0000'>";

            var a = pass[i] + ''
            var aa = a.split(',')[2]
            var aaa = a.split(',')[3]

              htmlstr += "<td >" +'条件： ' + aa + "</td>";
              htmlstr += "<td >" +'权重： ' + aaa + "</td>";
              countpass += parseFloat(aaa)
              htmlstr += "</tr>";
            }
              htmlstr += "<tr style='background:#ffffff; color:#ff0000'><td colspan='2'>" +'总权重为： ' + countpass + "</td></td>";
              htmlstr += "</table>";
              htmlstr += '<div>' + '高优先级用户： '+ pre[0][0] + '</div>'
              htmlstr += "<table border='1' cellspacing='0'  width='100%'>";

            for(var ii = 0; ii < pre.length; ii++) {
              htmlstr += "<tr style='background:#ffffff; color:#00ff00'>";
            var b = pre[ii] + ''
            var bb = b.split(',')[2]
            var bbb = b.split(',')[3]

              htmlstr += "<td >" +'条件： ' + bb + "</td>";
              htmlstr += "<td >" +'权重： ' + bbb + "</td>";
              countpre += parseFloat(bbb)
              htmlstr += "</tr>";
            }
              htmlstr += "<tr style='background:#ffffff; color:#00ff00'><td colspan='2'>" +'总权重为： ' + countpre + "</td></tr>";
              htmlstr += "</table>";
          }else{
            htmlstr = '<div>' + '系统未找到相关信息' + '</div>'
          }



          this.$alert(htmlstr, '被抵消详情', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
          })
        })
      }
    },


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
    }
  }
}
</script>

<style scoped>

</style>
