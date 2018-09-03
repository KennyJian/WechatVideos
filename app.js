//app.js
App({
  serverUrl: "http://ac18bca7.ngrok.io",
  userInfo:null,
  setGlobalUserInfo(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo() {
    return wx.getStorageSync("userInfo")
  }
})