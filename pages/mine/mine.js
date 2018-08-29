const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    CoverUrl: app.serverUrl+'/cover.jpg',
    fansCounts:0,
    followCounts:0,
    receiveLikeCounts:0   
  },
  onLoad(){
    var me=this;
    var user=app.userInfo;
    wx.showLoading({
      title: '正在加载数据...',
    })
    wx.request({
      url: app.serverUrl + '/user/query?userId='+app.userInfo.id,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 500) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
        } else if (res.data.status == 200) {
          app.userInfo = res.data.data;
          var faceUrl="../resource/images/noneface.png";
          if(app.userInfo.faceImage!=null&&app.userInfo.faceImage!=''&&app.userInfo.faceImage!=undefined){
            faceUrl = app.serverUrl + app.userInfo.faceImage
          }
          me.setData({
            faceUrl: faceUrl,
            fansCounts: app.userInfo.fansCounts,
            followCounts: app.userInfo.followCounts,
            receiveLikeCounts: app.userInfo.receiveLikeCounts,
          })
        }
      }
    })
  },
  logout(){    
    if (app.userInfo!=null){
      var user = app.userInfo;
      wx.showLoading({
        title: '请等待...',
      })
      wx.request({
        url: app.serverUrl + '/logout?userId=' + user.id,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          var status = res.data.status;
          wx.hideLoading();
          if (status == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 3000
            })
            app.userInfo = null;
            wx.navigateTo({
              url: '../userLogin/login',
            })
          } else if (status == 500) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: "注销失败",
        icon: 'none',
        duration: 3000
      })
    }
  },
  changeFace(){
    var me=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: app.serverUrl + '/user/uploadFace?userId=' + app.userInfo.id, 
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data)
            //do something
            wx.hideLoading();
            if(data.status==200){
              wx.showToast({
                title: "上传成功",
                icon: 'success',
                duration: 3000
              })
              var imageUrl=data.data;
              me.setData({
                faceUrl: app.serverUrl+imageUrl
              })
            }else if(data.status==500){
              wx.showToast({
                title: data.msg,
                duration: 3000
              })
            }
          }
        })
      }
    })
  },
  uploadVideo(){
    var me = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res);
        var tmpduration=res.duration;
        var tmpheight=res.height;
        var tmpwidth=res.width;
        var tmpVideoUrl=res.tempFilePath;
        if(tmpduration>17){
          wx.showToast({
            title: "视频长度不能超过17s",
            icon:"none",
            duration: 3000
          })
          }else if (tmpduration<1){
            //TODO 打开选择bgm的页面
            wx.showToast({
              title: "视频长度不能短于1s",
              icon: "none",
              duration: 3000
            })
          }else{
            //打开选择bgm的页面
            wx.navigateTo({
              url: '../chooseBgm/chooseBgm?duration=' + tmpduration
              + '&tmpheight=' + tmpheight
              + '&tmpwidth=' + tmpwidth
              + '&tmpVideoUrl=' + tmpVideoUrl
              + '&CoverUrl=' + me.data.CoverUrl
            })
          }       
      }
    })
  }

})
