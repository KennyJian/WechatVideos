const app = getApp()

Page({
  data: {
    //用于分页的属性
    totalPage:1,
    page:1,
    videoList:[],
    screenWidth: 350,
    serverUrl:""
  },

  onLoad: function (params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth,
    });

    var page=me.data.page;
    me.getAllVideoList(page);
   
  },

  getAllVideoList(page){
    var me = this;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '加载中...',
    });

    wx.request({
      url: serverUrl + '/video/showAll?page=' + page,
      method: "POST",
      success(res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        console.log(res.data)
        //判断当前页是不是第一页,如果是第一页,那么设置videoList为空
        if (page == 1) {
          me.setData({
            videoList: []
          });
        }
        var videoList = res.data.data.rows;
        var newVideoList = me.data.videoList;
        me.setData({
          videoList: newVideoList.concat(videoList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        })
      }
    })
  },

  onReachBottom(){
    var me=this;
    var currentPage=me.data.page;
    var totalPage = me.data.totalPage;
    console.log(currentPage);
    console.log(totalPage);
    //判断当前页数合总页数是否相等,如果相等则无需查询
    if (currentPage === totalPage){
      wx.showToast({
        title: '已经没有视频啦~~',
        icon:"none"
      });
      return;
    }

    var page=currentPage+1;
    me.getAllVideoList(page);
  },

  onPullDownRefresh(){
    wx.showNavigationBarLoading();
    this.getAllVideoList(1);
  }
})
