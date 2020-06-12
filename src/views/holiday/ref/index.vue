<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">部门名称</label>
        <el-input v-model="query.deptName" clearable placeholder="部门名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">用户名</label>
        <el-input v-model="query.userName" clearable placeholder="用户名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">休息日</label>
        <el-input v-model="query.refHolidayDate" clearable placeholder="休息日" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">手机号</label>
        <el-input v-model="query.userPhone" clearable placeholder="手机号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="休息日" prop="refHolidayDate">
            <el-date-picker v-model="form.refHolidayDate" type="date" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="form.userPhone" style="width: 370px;" />
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
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="refHolidayDate" label="休息日">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.refHolidayDate,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userPhone" label="手机号" />
        <el-table-column v-permission="['admin','holidayReference:edit','holidayReference:del']" label="操作" width="150px" align="center">
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
import crudHolidayReference from '@/api/holidayReference'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, deptName: null, userName: null, refHolidayDate: null, createBy: null, updateBy: null, createTime: null, updateTime: null, userPhone: null }
export default {
  name: 'HolidayReference',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '实时参考假日，根据部门在位率算', url: 'api/holidayReference', sort: 'id,desc', crudMethod: { ...crudHolidayReference }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'holidayReference:add'],
        edit: ['admin', 'holidayReference:edit'],
        del: ['admin', 'holidayReference:del']
      },
      rules: {
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        refHolidayDate: [
          { required: true, message: '休息日不能为空', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'deptName', display_name: '部门名称' },
        { key: 'userName', display_name: '用户名' },
        { key: 'refHolidayDate', display_name: '休息日' },
        { key: 'userPhone', display_name: '手机号' }
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
