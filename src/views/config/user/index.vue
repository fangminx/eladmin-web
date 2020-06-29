<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">用户名</label>
        <el-input v-model="query.userName" clearable placeholder="用户名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <!-- <label class="el-form-item-label">部门名称</label>
        <el-input v-model="query.deptName" clearable placeholder="部门名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">手机号</label>
        <el-input v-model="query.userPhone" clearable placeholder="手机号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" /> -->
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <!-- <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="form.userPhone" style="width: 370px;" />
          </el-form-item> -->
          <!-- <el-form-item label="条件类别" prop="conditions">
            <el-input v-model="form.conditions" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="条件项" prop="conditionItem">
            <el-input v-model="form.conditionItem" style="width: 370px;" />
          </el-form-item> -->
          <el-form-item label="条件选择" prop="condition_item">
            <el-cascader ref="ref_condion" v-model="selectOption" :options="options" :props="condition_itemProps" placeholder="请选择对应条件" clearable style="width: 370px;" />
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
        <!-- <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="userPhone" label="手机号" /> -->
        <el-table-column prop="conditions" label="条件类别" />
        <el-table-column prop="conditionItem" label="条件项" />
        <el-table-column prop="conditionWeight" label="条件权重" />
        <!-- <el-table-column v-permission="['admin','configUser:edit','configUser:del']" label="操作" width="150px" align="center">
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
import crudConfigUser from '@/api/configUser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllConditions } from '@/api/mydict/dict'

const defaultForm = { id: null, userName: null, deptName: null, userPhone: null, conditions: null, conditionItem: null, conditionWeight: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'ConfigUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '用户条件配置', url: 'api/configUser', sort: 'id,desc', crudMethod: { ...crudConfigUser }})
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
        // deptName: [
        //   { required: true, message: '部门名称不能为空', trigger: 'blur' }
        // ],
        // userPhone: [
        //   { required: true, message: '手机号不能为空', trigger: 'blur' }
        // ],
        // conditions: [
        //   { required: true, message: '条件类别不能为空', trigger: 'blur' }
        // ],
        // conditionItem: [
        //   { required: true, message: '条件项不能为空', trigger: 'blur' }
        // ],
        condition_item: [{
          required: false,
          type: 'array',
          message: '请选择一个条件',
          trigger: 'blur'
        }]
      },
      options: [
      ],
      selectOption: [
      ],
      condition_itemProps: {
        'multiple': false,
        'label': 'label',
        'value': 'value',
        'children': 'children'
      },
      queryTypeOptions: [
        { key: 'userName', display_name: '用户名' },
        { key: 'deptName', display_name: '部门名称' },
        { key: 'userPhone', display_name: '手机号' }
      ]
    }
  },
  watch: {
    'selectOption': function(newVal, oldVal) {
      // 选中级联填充表单对应的2个字段
      var condi = this.$refs['ref_condion'].getCheckedNodes()[0].pathLabels
      var arr = condi.toString().split(',')
      this.form.conditions = arr[0]
      this.form.conditionItem = arr[1]

      // 选中级联自动获取权重
      var item = newVal
      item = item.slice(1, item.length)
      for (var i = 0; i < this.options.length; i++) {
        for (var j = 0; j < this.options[i].children.length; j++) {
          if (this.options[i].children[j].label == item) {
            this.form.conditionWeight = this.options[i].children[j].weight
          }
        }
      }
    }

  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增前做的操作
    [CRUD.HOOK.beforeToAdd](crud, form) {
      this.selectOption = ','
      getAllConditions().then(res => {
        this.options = res
      })
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.selectOption = ','
      getAllConditions().then(res => {
        this.options = res
      })
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.afterAddError](crud, form) {
      this.$notify.error({
          title: '校验失败',
          message: '请仔细检查用户名是否正确以及该用户的条件配置是否符合逻辑'
        });
    }
    //     conditionChange(item) {
    //       // 获取选中的级联结果
    //       console.log('ref:' + this.$refs['ref_condion'].getCheckedNodes()[0].pathLabels)
    //       console.log('item:' + item)
    //       item = item.slice(1, item.length)
    //       for(var i = 0; i < this.options.length; i++) {
    //         for(var j = 0; j < this.options[i].children.length; j++){
    //           console.log(this.options[i].children[j].label)
    //           console.log('label:' + item)
    //           if(this.options[i].children[j].label == item){
    //             console.log('weightttttttttttttt:' + this.options[i].children[j].weight)
    //             this.form.weight = this.options[i].children[j].weight
    //             console.log('weightformmmmmmmmmmmmmm:' + this.form.weight)
    //           }
    //         }
    //       }
    //     }
  }
}
</script>

<style scoped>

</style>
