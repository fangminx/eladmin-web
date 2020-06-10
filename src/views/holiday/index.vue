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
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="部门名称">
            <el-input v-model="form.deptName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请假开始时间">
            <el-date-picker v-model="form.startDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请假结束时间">
            <el-date-picker v-model="form.endDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="总共请假天数">
            <el-input v-model="form.count" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="假期状态">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.holiday_status"
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
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="startDate" label="请假开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="请假结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="总共请假天数" />
        <el-table-column prop="status" label="假期状态">
          <template slot-scope="scope">
            {{ dict.label.holiday_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','holidayRecord:edit','holidayRecord:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudHolidayRecord from '@/api/holidayRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, userName: null, deptName: null, startDate: null, endDate: null, count: null, createTime: null, updateTime: null, status: null }
export default {
  name: 'HolidayRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['holiday_status'],
  cruds() {
    return CRUD({ title: '请假记录', url: 'api/holidayRecord', sort: 'id,desc', crudMethod: { ...crudHolidayRecord }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'holidayRecord:add'],
        edit: ['admin', 'holidayRecord:edit'],
        del: ['admin', 'holidayRecord:del']
      },
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'userName', display_name: '用户名' },
        { key: 'deptName', display_name: '部门名称' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
