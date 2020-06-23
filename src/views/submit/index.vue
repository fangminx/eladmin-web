<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="条件选择" prop="condition_item">
        <el-cascader v-model="formData.condition_itemOptions" :options="condition_itemOptions" :props="condition_itemProps" placeholder="请选择对应条件" clearable />
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getAllConditions } from '@/api/mydict/dict'
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        condition_item: [],
        condition_itemOptions: []
      },
      rules: {
        condition_item: [{
          required: true,
          type: 'array',
          message: '请至少选择一个级联选择',
          trigger: 'change'
        }]
      },
      condition_itemOptions: [{
        'id': 1,
        'value': 1,
        'label': '选项1',
        'children': [{
          'id': 2,
          'value': 2,
          'label': '选项1-1'
        },
        {
          'id': 3,
          'value': 3,
          'label': '选项1-2'
        }]
      }],
      condition_itemProps: {
        'multiple': false,
        'label': 'label',
        'value': 'value',
        'children': 'children'
      }
    }
  },
  watch: {
    'formData.condition_itemOptions': function(newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
    },
    'formData': function(newVal, oldVal) {
      console.log('表单对象发生变化')
      this.formData.condition_itemOptions = newVal
    }
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      // this.$refs['elForm'].resetFields()
      console.log(this.formData.condition_itemOptions)
      this.getCondition_itemOptions()
      console.log(this.formData.condition_itemOptions)
    },
    getCondition_itemOptions() {
      // TODO 发起请求获取数据
      getAllConditions().then(res => {
        this.formData.condition_itemOptions = res
      })
    }
  }
}

</script>
<style>
</style>
