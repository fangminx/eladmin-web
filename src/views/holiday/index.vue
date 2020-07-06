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
    },
    // 新增取消后
    [CRUD.HOOK.afterAddCancel](crud, form) {
      this.$store.dispatch('GetInfo').then(res => {
        this.form.rangeDate = ['', '']
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
          var text = ''
          var passUser = '被抵消用户： ' + res.passedUser
          var passWeight = '被抵消用户权重： ' + res.passedWeight
          var priUser = '高优先级用户： ' + res.priorityUser
          var priWeight = ' 高优先级用户权重： ' + res.priorityWeight

          text += '<div style="background:#ffffff; color:#ff0000">' + passUser + '</div>'
          text += '<div style="background:#ffffff; color:#ff0000">' + passWeight + '</div>'
          text += '<div style="background:#ffffff; color:#00ff00">' + priUser + '</div>'
          text += '<div style="background:#ffffff; color:#00ff00">' + priWeight + '</div>'

          this.$alert(text, '被抵消详情', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
