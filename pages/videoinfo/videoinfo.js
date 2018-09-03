// pages/videoinfo/videoinfo.js
Page({
  data: {
    cover:'cover'
  },
  showSearch(){
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  }
})