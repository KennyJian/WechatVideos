//app.js
App({
  serverUrl: "http://de6ce83e.ngrok.io",
  userInfo: null,
  setGlobalUserInfo(user) {
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo() {
    return wx.getStorageSync("userInfo")
  }
})