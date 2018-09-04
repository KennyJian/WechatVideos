 const app = getApp()

Page({
  data: {
  },
  doLogin(e){
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;

    //简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else{
      wx.showLoading({
        title: '请等待...',
      })
      wx.request({
        url: app.serverUrl +'/login',
        method:"POST",
        data:{
          username:username,
          password:password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          if(res.data.status==500){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          } else if (res.data.status == 200) {
            wx.showToast({
              title: "登陆成功",
              icon: 'success',
              duration: 2000
            })
            // app.userInfo = res.data.data;
            // fixme修改原有的全局对象为本地缓存
            app.setGlobalUserInfo(res.data.data);
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      })
    }
  },
  goRegistPage(){
    wx.navigateTo({
      url: '../userRegist/regist',
    })
  }
})