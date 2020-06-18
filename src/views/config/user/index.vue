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
        <el-input v-model="query.userPhone" clearable placeholder="手机号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="form.userPhone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="条件类别" prop="condition">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="条件项" prop="conditionItem">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="条件权重">
            <el-input v-model="form.conditionWeight" style="width: 370px;" />
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
        <el-table-column prop="userPhone" label="手机号" />
        <el-table-column prop="condition" label="条件类别" />
        <el-table-column prop="conditionItem" label="条件项" />
        <el-table-column prop="conditionWeight" label="条件权重" />
        <el-table-column v-permission="['admin','configUser:edit','configUser:del']" label="操作" width="150px" align="center">
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
import crudConfigUser from '@/api/configUser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, userName: null, deptName: null, userPhone: null, condition: null, conditionItem: null, conditionWeight: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'ConfigUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '用户荣誉条件配置', url: 'api/configUser', sort: 'id,desc', crudMethod: { ...crudConfigUser }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'configUser:add'],
        edit: ['admin', 'configUser:edit'],
        del: ['admin', 'configUser:del']
      },
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        condition: [
          { required: true, message: '条件类别不能为空', trigger: 'blur' }
        ],
        conditionItem: [
          { required: true, message: '条件项不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'userName', display_name: '用户名' },
        { key: 'deptName', display_name: '部门名称' },
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
