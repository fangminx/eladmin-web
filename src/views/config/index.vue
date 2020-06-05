<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">姓名</label>
        <el-input v-model="query.name" clearable placeholder="姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="基本条件">
            <el-input v-model="form.jbtj" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="荣誉条件">
            <el-select v-model="form.rytj" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.ry_condition"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="优惠条件">
            <el-select v-model="form.yhtj" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.yh_condition"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="特殊条件">
            <el-select v-model="form.tstj" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.ts_condition"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="其他条件">
            <el-input v-model="form.qttj" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="优先级得分">
            <el-input v-model="form.score" style="width: 370px;" />
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
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="jbtj" label="基本条件" />
        <el-table-column prop="rytj" label="荣誉条件">
          <template slot-scope="scope">
            {{ dict.label.ry_condition[scope.row.rytj] }}
          </template>
        </el-table-column>
        <el-table-column prop="yhtj" label="优惠条件">
          <template slot-scope="scope">
            {{ dict.label.yh_condition[scope.row.yhtj] }}
          </template>
        </el-table-column>
        <el-table-column prop="tstj" label="特殊条件">
          <template slot-scope="scope">
            {{ dict.label.ts_condition[scope.row.tstj] }}
          </template>
        </el-table-column>
        <el-table-column prop="qttj" label="其他条件" />
        <el-table-column prop="score" label="优先级得分" />
        <el-table-column v-permission="['admin','zConfig:edit','zConfig:del']" label="操作" width="150px" align="center">
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
import crudZConfig from '@/api/zConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, jbtj: null, rytj: null, yhtj: null, tstj: null, qttj: null, score: null }
export default {
  name: 'ZConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['ry_condition', 'yh_condition', 'ts_condition'],
  cruds() {
    return CRUD({ title: '荣誉条件配置', url: 'api/zConfig', sort: 'id,desc', crudMethod: { ...crudZConfig }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'zConfig:add'],
        edit: ['admin', 'zConfig:edit'],
        del: ['admin', 'zConfig:del']
      },
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '姓名' }
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
