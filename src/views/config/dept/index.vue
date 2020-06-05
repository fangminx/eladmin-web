<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">部门名称</label>
        <el-input v-model="query.name" clearable placeholder="部门名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">人员在位率</label>
        <el-input v-model="query.rate" clearable placeholder="人员在位率" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="部门总人数" prop="count">
            <el-input v-model="form.count" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="人员在位率" prop="rate">
            <el-input v-model="form.rate" style="width: 370px;" />
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
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="count" label="部门总人数" />
        <el-table-column prop="rate" label="人员在位率" />
        <el-table-column v-permission="['admin','zDept:edit','zDept:del']" label="操作" width="150px" align="center">
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
import crudZDept from '@/api/zDept'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, count: null, rate: null }
export default {
  name: 'ZDept',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '部门配置', url: 'api/zDept', sort: 'id,desc', crudMethod: { ...crudZDept }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'zDept:add'],
        edit: ['admin', 'zDept:edit'],
        del: ['admin', 'zDept:del']
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '部门总人数不能为空', trigger: 'blur' }
        ],
        rate: [
          { required: true, message: '人员在位率不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '部门名称' },
        { key: 'rate', display_name: '人员在位率' }
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
