<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    :action="domain"
    accept=".obj"
    :http-request="myUpload"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :on-success="onSuccess"
    :file-list="fileList"
    :auto-upload="false"
    multiple
    :limit="10"
    :on-exceed="handleExceed">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success"
      @click="submitUpload">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">只能上传obj文件</div>
  </el-upload>
</template>

<script>
export default {
  data () {
    return {
      domain: '/file/upload',
      config: {
        headers: {'Content-Type': 'multipart/form-data'}
      },
      fileList: [
      ],
      projectName: this.$route.params.name
    }
  },
  methods: {
    myUpload (content) {
      console.log('文件上传')
      if (content === null) {
        this.$message.info('请选择要上传的文件')
      }
      let formdata = new FormData()
      formdata.append('directory', this.projectName)
      formdata.append('file', content.file)
      this.axios.post(this.domain, formdata, this.config)
        .then((res) => {
          console.log('文件上传成功')
          content.onSuccess('文件上传成功')
        }).catch((err) => {
          if (err.response) {
            content.onError(`文件上传失败(${err.response.status})，${err.response.data}`)
          } else if (err.request) {
            content.onError('文件上传失败，服务器端无响应')
          } else {
            content.onError('文件上传失败，请求封装失败')
          }
        })
    },
    beforeUpload (file) {
      let type = file.name.split('.')[1]
      console.log(type)
      const isOBJ = type === 'obj'
      if (!isOBJ) {
        this.$message.error('上传模型只能是 OBJ 格式!')
      }
      return isOBJ
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name} ?`)
    },
    onSuccess (response, file, fileList) {
      // this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style scoped>
.upload-demo{
  padding: 10px 0px;
  width: 300px;
  height: 200px;
  overflow: scroll;
}
</style>
