<template>
  <div>
    <div v-if="query.realHolidayName === ''">
      <div class="my-code">点击查看实时假日详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.name" clearable size="small" placeholder="输入部门查询" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
          <rrOperation />
        </div>
      </div>
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参考假日" prop="refHoliday">
            <el-input v-model="form.refHoliday" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column label="所属部门">
          {{ query.realName }}
        </el-table-column>
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="refHoliday" label="参考假日" />
        <el-table-column v-permission="['admin','realholiday:edit','realholiday:del']" label="操作" width="130px" align="center" fixed="right">
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
import crudRealDetail from '@/api/real/realDetail'

import CRUD, { presenter, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import udOperation from '@crud/UD.operation'

const defaultForm = { id: null, label: null, value: null, dictSort: 999 }

export default {
  components: { pagination, rrOperation, udOperation },
  cruds() {
    return [
      CRUD({ title: '详情', url: 'api/realDetail', query: { realName: '' },
        crudMethod: { ...crudRealDetail },
        optShow: { add: true,
          edit: true,
          del: true,
          reset: false
        },
        queryOnPresenterCreated: false
      })
    ]
  },
  mixins: [
    presenter(),
    header(),
    form(function() {
      return Object.assign({ real: { id: this.realId }}, defaultForm)
    })],
  data() {
    return {
      dictId: null,
      rules: {
        label: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        dictSort: [
          { required: true, message: '请输入', trigger: 'blur', type: 'number' }
        ]
      },
      permission: {
        add: ['admin', 'realholiday:add'],
        edit: ['admin', 'realholiday:edit'],
        del: ['admin', 'realholiday:del']
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
