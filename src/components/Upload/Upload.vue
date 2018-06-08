<template>
  <el-upload
    ref="upload"
    :action="domain"
    accept=".obj,.mtl"
    :http-request="myUpload"
    :before-upload="beforeUpload"
    :on-success="onSuccess"
    :file-list="fileList"
    :auto-upload="false"
    multiple
    :limit="10"
    :on-exceed="handleExceed">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success"
      @click="submitUpload">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">只能上传obj或mtl文件</div>
  </el-upload>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    pname: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      domain: '/file/upload',
      config: {
        headers: {'Content-Type': 'multipart/form-data'}
      },
      fileList: [],
      hasMtl: false
    }
  },
  methods: {
    myUpload (content) {
      // console.log('文件上传')
      let formdata = new FormData()
      formdata.append('directory', this.pname)
      formdata.append('file', content.file)
      let self = this
      self.axios.post(self.domain, formdata, self.config)
        .then((res) => {
          // console.log(content.file.name)
          content.onSuccess('文件上传成功')
          this.hasMtl = res.data.hasMtl
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
      const isOK = (type === 'obj') || (type === 'mtl')
      if (!isOK) {
        this.$message.error('上传模型只能是 OBJ 或 MTL 格式!')
      }
      return isOK
    },
    submitUpload () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.warning('请选择要上传的文件')
      } else {
        this.$refs.upload.submit()
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    onSuccess (response, file, fileList) {
      // console.log('success')
      let type = file.name.split('.')[1]
      if (type === 'obj') {
        this.$emit('upload', {
          name: file.name,
          hasMtl: this.hasMtl
        })
      }
      for (let i = 0; i < fileList.length; i++) {
        if (file.name === fileList[i].name) {
          this.fileList = fileList.split(i, 1)
          break
        }
      }
    }
  }
}
</script>
