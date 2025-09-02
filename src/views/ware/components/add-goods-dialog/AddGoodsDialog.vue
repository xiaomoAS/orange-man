<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加商品"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div v-if="dialogVisible">
      <el-form ref="addCateFormRef" class="form-box" :model="addCateForm" label-width="120px" :rules="rules">
        <el-form-item label="商品标题" prop="title">
          <el-input v-model="addCateForm.title" placeholder="请输入商品标题"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input v-model="addCateForm.desc" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="商品类目" prop="categoryId">
          <el-input v-model.number="addCateForm.categoryId" placeholder="请输入商品类目"></el-input>
        </el-form-item>
        <el-form-item label="商品主图" prop="mainImgFiles">
          <CommonUpload
            v-model:fileList="addCateForm.mainImgFiles"
            :action="`${BASE_API_URL}/admin/file/upload`"
            @change="validateField('mainImgFiles')"
          />
        </el-form-item>
        <el-form-item label="商品详情图片" prop="detailImgFiles">
          <CommonUpload
            v-model:fileList="addCateForm.detailImgFiles"
            :action="`${BASE_API_URL}/admin/file/upload`"
            @change="validateField('detailImgFiles')"
          />
        </el-form-item>
        <el-form-item label="商品详情视频" prop="videoFiles">
          <CommonUpload
            v-model:fileList="addCateForm.videoFiles"
            type="video"
            :action="`${BASE_API_URL}/admin/file/upload`"
          />
        </el-form-item>
        <el-form-item label="预售时间" prop="presaleTime">
          <el-date-picker
            v-model="addCateForm.presaleTime"
            type="datetimerange"
            start-placeholder="预售开始时间"
            end-placeholder="预售结束时间"
            value-format="x"
            :teleported="false"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item label="预计送达时间" prop="deliveryDays">
          <el-input v-model.number="addCateForm.deliveryDays" placeholder="请输入预计送达时间">
            <template #append>
              <span>天</span>
            </template>
          </el-input>
        </el-form-item>
        <!-- TODO -->
        <el-form-item label="检测报告类型" prop="reportType">
          <el-radio-group v-model="addCateForm.reportType">
            <el-radio v-for="item in REPORT_TYPE_LIST" :value="item.value" :key="item.value">{{
              item?.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="检测报告" prop="reportFiles">
          <CommonUpload
            v-model:fileList="addCateForm.reportFiles"
            :type="addCateForm.reportType === REPORT_TYPE.IMG ? 'image' : 'file'"
            :action="`${BASE_API_URL}/admin/file/upload`"
            @change="validateField('reportFiles')"
          />
        </el-form-item>
        <el-form-item label="商品标签" prop="tags">
          <el-input v-model="addCateForm.tags" placeholder="请输入商品标签，用英文,分隔"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler">添加商品</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { CommonUpload } from '@/components/advance'
import { BASE_API_URL } from '@/api/server'
import * as apis from '@/api/services'
import { ElMessage } from 'element-plus'
import { REPORT_TYPE_LIST, REPORT_TYPE } from '../../constants'

const emit = defineEmits(['getTableData'])
const dialogVisible = ref<boolean>(false)
const addCateFormRef = ref()
const rowData = ref()

const isEdit = computed(() => !!rowData.value)

const addCateForm = reactive<Record<string, any>>({
  title: null,
  desc: null,
  categoryId: null,
  mainImgFiles: [],
  detailImgFiles: [],
  videoFiles: [],
  presaleTime: [],
  deliveryDays: null,
  reportType: REPORT_TYPE.FILE,
  reportFiles: [],
  tags: null,
})

const rules = {
  title: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请输入商品类目Id', trigger: 'blur' }],
  mainImgFiles: [{ required: true, message: '请上传商品主图', trigger: 'change' }],
  detailImgFiles: [{ required: true, message: '请上传商品详情图片', trigger: 'change' }],
  reportType: [{ required: true, message: '请上传商品详情图片', trigger: 'change' }],
  reportFiles: [{ required: true, message: '请上传检测报告', trigger: 'change' }],
}

const handleClose = () => {
  Object.assign(addCateForm, {
    title: null,
    desc: null,
    categoryId: null,
    mainImgFiles: [],
    detailImgFiles: [],
    videoFiles: [],
    presaleTime: [],
    deliveryDays: null,
    reportType: REPORT_TYPE.FILE,
    reportFiles: [],
    tags: null,
  })
}

/**
 * @description: 获取详情数据
 */
const getDetailData = async () => {
  try {
    const data = await apis?.getProductDetail({
      id: rowData.value?.id,
    })
    Object.assign(addCateForm, {
      ...data,
      mainImgFiles: data?.mainImgUrl ? [{ url: data?.mainImgUrl, response: data?.mainImgUrl }] : [],
      detailImgFiles: data?.detailImgUrl ? [{ url: data?.detailImgUrl, response: data?.detailImgUrl }] : [],
      videoFiles: data?.videoUrl ? [{ url: data?.videoUrl, response: data?.videoUrl, name: '商品详情视频' }] : [],
      presaleTime: data?.presaleStartTime && data?.presaleEndTime ? [data?.presaleStartTime, data?.presaleEndTime] : [],
      reportFiles: data?.reportUrl ? [{ url: data?.reportUrl, response: data?.reportUrl, name: '检测报告' }] : [],
      tags: data?.tagList?.length ? data?.tagList.join(',') : null,
    })
  } catch {
    ElMessage.error('获取商品详情失败')
  }
}

const open = (row = null) => {
  rowData.value = row
  if (row) {
    getDetailData()
  }
  dialogVisible.value = true
}

// 手动触发表单验证
const validateField = (field: string) => {
  addCateFormRef.value?.validateField(field)
}

const submitHandler = () => {
  addCateFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const apiName = isEdit.value ? 'updateProduct' : 'addProduct'
      const res = await apis?.[apiName]({
        id: rowData.value?.id || null,
        title: addCateForm?.title,
        desc: addCateForm?.desc,
        categoryId: addCateForm?.categoryId,
        mainImgUrl: addCateForm?.mainImgFiles?.[0]?.response,
        detailImgUrl: addCateForm?.detailImgFiles?.[0]?.response,
        videoUrl: addCateForm?.videoFiles?.[0]?.response,
        presaleStartTime: addCateForm?.presaleTime?.[0],
        presaleEndTime: addCateForm?.presaleTime?.[1],
        deliveryDays: addCateForm?.deliveryDays,
        reportType: addCateForm?.reportType,
        reportUrl: addCateForm?.reportFiles?.[0]?.response,
        tagList: addCateForm?.tags ? (addCateForm.tags as string).split(',') : null,
      })
      if (res) {
        ElMessage.success('添加成功')
        emit('getTableData')
        dialogVisible.value = false
      } else {
        ElMessage.error('添加失败')
      }
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({ open })
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
