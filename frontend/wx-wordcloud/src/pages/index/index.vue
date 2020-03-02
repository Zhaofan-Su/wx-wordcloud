<template>
  <view>
    <form>
      <view class="cu-form-group radius input-shadow  solid bg-white margin">
        <textarea
      
          maxlength="-1"
          :disabled="keyboard!=null"
          @input="textareaInput"
          placeholder="请输入文本"
        ></textarea>
      </view>

      <view class="cu-bar bg-white margin-top margin-right margin-left">
        <view class="action">选择背景图片</view>
      </view>
      <view class="cu-form-group margin-right margin-left">
        <view class="grid col-4 grid-square flex-sub">
          <view v-if="choosedImg!==''" class="bg-img" :data-url="choosedImg">
            <image :src="choosedImg" mode="aspectFill"></image>
            <view class="cu-tag bg-red" @tap.stop="delImg">
              <text class="cuIcon-close"></text>
            </view>
          </view>
          <view class="solids" v-if="choosedImg === ''" @tap="chooseImage">
            <text class="cuIcon-cameraadd"></text>
          </view>
        </view>
      </view>

      <view class="cu-bar bg-white margin-right margin-left">
        <view class="action">推荐图片</view>
      </view>
      <view class="cu-form-group margin-right margin-left">
        <view class="grid col-4 grid-square flex-sub">
          <view
            class="bg-img"
            v-for="(item,index) in defaultList"
            :key="index"
            @tap="viewImage"
            :data-url="defaultList[index]"
          >
            <image :src="'/static/images/'+defaultList[index]" mode="aspectFill"></image>
            <view class="cu-tag bg-green" @tap.stop="chooseDefaultImg" :data-index="index">
              <text class="cuIcon-check"></text>
            </view>
          </view>
        </view>
      </view>

      <view class="cu-form-group margin-top margin-right margin-left margin-bottom-sm">
        <view class="title">颜色自适应</view>
        <switch
          @change="switchChange"
          :class="colorAdaption?'checked':''"
          :checked="colorAdaption?true:false"
          class="cyan"
        ></switch>
      </view>
    </form>
    <view class="padding">
      <button class="cu-btn block bg-cyan lg" @tap="upload">生成词云</button>
    </view>

    <view class="cu-modal showResult" :class="showResult?'show':''">
      <view class="cu-dialog">
        <view class="bg-white" >
          <image class="resultImg" :src="'data:image/PNG;base64,' +resultImg" mode="aspectFill"></image>
        </view>
        <view class="cu-bar">
          <view class="action margin-0 flex-sub text-cyan" @tap="saveImg">
            <text class="cuIcon-down"></text>保存到本地
          </view>
          <view
            class="action margin-0 flex-sub solid-left text-gray modalButton"
            @tap="hideModal"
          >再来一张</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      textareaValue: "",
      choosedImg: "",
      defaultList: ["1.png", "2.jpg","3.jpg",'4.jpg','5.jpg','6.jpg','7.jpg','8.jpg'],
      colorAdaption: false,
      showResult: false,
      resultImg: ""
    };
  },
  onLoad() {},
  methods: {
    getDefaultImages() {},
    textareaInput(e) {
      this.textareaValue = e.detail.value;
    },
    chooseImage() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: res => {
          if (this.choosedImg === "") {
            this.choosedImg = res.tempFilePaths[0];
          }
        }
      });
    },
    viewImage(e) {
      let imageList = [];
      this.defaultList.forEach(img => {
        imageList.push("/static/images/" + img);
      });
      uni.previewImage({
        urls: imageList,
        current: "/static/images/" + e.currentTarget.dataset.url
      });
    },
    chooseDefaultImg(e) {
      this.choosedImg =
        "/static/images/" + this.defaultList[e.currentTarget.dataset.index];
    },
    delImg(e) {
      uni.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        cancelText: "取消",
        confirmText: "确定",
        success: res => {
          if (res.confirm) {
            this.choosedImg = "";
          }
        }
      });
    },
    switchChange(e) {
      this.colorAdaption = e.detail.value;
    },
    upload() {
      let text = this.textareaValue;
      let image = this.choosedImg;
      let colorAdaption = this.colorAdaption ? 1 : 0;

      let image_path = this.choosedImg;
      let loc = this.choosedImg.lastIndexOf("/");
      let image_name = this.choosedImg.substring(loc + 1);

      let that = this;

      uni.uploadFile({
        url: "http://smartiot.zhaofan.site:8000/api/uploadInfo",
        filePath: image_path,
        name: "image",
        formData: {
          text: text,
          colorAdaption: colorAdaption
        },
        success: res => {
          that.resultImg = res.data;
          that.showResult = true;
        },
        fail: res => {
          uni.showToast({
            title: "图片上传失败",
            icon: "none",
            duration: 2000,
            mask: true
          });
        }
      });
    },
    saveImg() {
      let that = this;
      var fs = uni.getFileSystemManager();
      let imageName = new Date().getTime() + '.png'
      fs.writeFile({
        filePath:
          `${wx.env.USER_DATA_PATH}` + "/" +imageName,
        data: that.resultImg,
        encoding: "base64",
        success: res => {
          uni.saveImageToPhotosAlbum({
            filePath:
              `${wx.env.USER_DATA_PATH}` + "/" +imageName,
            success: function(res) {
              uni.showToast({
                title: "保存成功"
              });
              that.showResult = false
            },
            fail: function(err) {
              uni.showToast({
                title:'保存失败，请重试'
              })
            }
          });
          
        },
        fail: err => {
          console.log(err);
        }
      });
    },
    hideModal() {
      this.showResult = false;
    }
  }
};
</script>

<style>
.title {
  font-size: 36upx;
  color: #8f8f94;
}

.resultImg {
  height: 440px;
}

.modalButton {
  border-left: 1px solid #1cbbb4;
}
.input-shadow{
  box-shadow: 0 10upx 20upx rgba(0, 0, 0, 0.2)
}
.textarea{
  min-height: 4000upx;
}
</style>
