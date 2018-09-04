const app = getApp()

Page({
    data: {
      bgmList:[],
      serverUrl:"",
      videoParams:{}
    },

    onLoad(params){
      var me=this;
      me.setData({
        videoParams: params
      })
      wx.showLoading({
        title: '请等待...',
      })
      wx.request({
        url: app.serverUrl + '/bgm/list',
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          var status=res.data.status;
          var data=res.data;
          wx.hideLoading();
          if (status == 200) {
            var bgmList=res.data.data;
            me.setData({
              bgmList:bgmList,
              serverUrl: app.serverUrl
            })
          } else if (status == 500) {

          }
        }
      })
    },

    upload(e){
      var me=this;

      var bgmId=e.detail.value.bgmId;
      var desc=e.detail.value.desc;
      console.log("bgmId:"+bgmId);
      console.log("desc:"+desc);

      var duration = me.data.videoParams.duration;
      var tmpheight = me.data.videoParams.tmpheight;
      var tmpwidth = me.data.videoParams.tmpwidth;
      var tmpVideoUrl = me.data.videoParams.tmpVideoUrl;
      var CoverUrl = me.data.videoParams.CoverUrl;

      wx.showLoading({
        title: '上传视频中...',
      })
      var userInfo = app.getGlobalUserInfo();
      //上传短视频
      wx.uploadFile({
        url: app.serverUrl + '/video/uploadVideo',       
        formData:{
          userId: userInfo.id, //fixme 修改原有的全局对象为本地缓存  原来app.userInfo.id
          bgmId: bgmId,
          description: desc,
          videoSeconds: duration,
          videoHeight: tmpheight,
          videoWidth: tmpwidth,
        },
        filePath: tmpVideoUrl,
        name: 'file',
        header:{
          'content-type':'application/json'
        },
        success: function (res) {
          var data=JSON.parse(res.data);
          wx.hideLoading();
          if(data.status==200){
            wx.showToast({
              title: "上传成功",
              icon: 'success',
              duration: 3000
            })
            wx.navigateBack({
              delta:1
            })
          }
          //   //获取videoId
          //   var videoId=data.data;
          //   wx.showLoading({
          //     title: '上传封面中...',
          //   })
          //   //上传封面
          //   wx.uploadFile({
          //     url: app.serverUrl + '/video/uploadCover',
          //     formData: {
          //       userId: app.userInfo.id,
          //       videoId: videoId
          //     },
          //     filePath: me.data.videoParams.CoverUrl,
          //     name: 'file',
          //     header: {
          //       'content-type': 'application/json'
          //     },
          //     success: function (res) {
          //       var data=JSON.parse(res.data);
          //       wx.hideLoading();
          //       if (data.status == 200) {
          //         wx.showToast({
          //           title: "上传成功",
          //           icon: 'success',
          //           duration: 3000
          //         })
          //         wx.navigateBack({
          //           delta:1
          //         })
          //       }else{
          //         ex.showToast({
          //           title: '上传失败~',
          //           icon: 'none'
          //         })
          //       }
          //     },
          //     fail(res){
          //       console.log(res)
          //     }
          //   })
      }
    })
    }
})

