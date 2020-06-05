<template>
  <div>
    <aside style="margin-top:15px;">
      请提交请假申请
    </aside>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-row gutter="15">
        <el-col :span="15">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名：" clearable :style="{width: '100%'}" />
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="所在部门：" prop="dept">
            <el-select v-model="formData.dept" placeholder="请选择所在部门：" clearable :style="{width: '100%'}">
              <el-option
                v-for="(item, index) in deptOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="请假时间：" prop="qj_date">
            <el-date-picker
              v-model="formData.qj_date"
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
        </el-col>
        <el-col :span="15">
          <el-form-item label="请假天数：" prop="date_num">
            <el-input-number v-model="formData.date_num" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="优先竞选：" prop="youxian">
            <el-switch v-model="formData.youxian" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        name: undefined,
        dept: undefined,
        qj_date: ['', ''],
        date_num: undefined,
        youxian: false
      },
      rules: {
        name: [{
          required: true,
          message: '请输入姓名：',
          trigger: 'blur'
        }],
        dept: [{
          required: true,
          message: '请选择所在部门：',
          trigger: 'change'
        }],
        qj_date: [{
          required: true,
          type: 'array',
          message: '请至少选择一个qj_date',
          trigger: 'change'
        }],
        date_num: []
      },
      deptOptions: [{
        'label': '研发部',
        'value': 1
      }, {
        'label': '运维部',
        'value': 2
      }]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    }
  }
}

</script>
<style>
</style>
