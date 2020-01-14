
const app = getApp()
var dev = 'http://192.168.1.105:8085';
var dev1 = 'http://192.168.1.105:18001'

var ip = dev;
var ip1  = dev1;

var api = {
  getOpenidByCode: ip1 + '/mini/program/getOpenidByCode', // 获取openid
 
  deliciousList: ip + '/api/mwkt/video/recipes/list', // 美味课堂首页 
  siginInfo: ip + '/api/member/sign/info/' + app.globalData.memberId, //美味课堂签到信息
  dianz: ip + '/api/mwkt/video/recipes/dianz', //点赞
  deliciousDetail: ip + '/api/mwkt/video/recipes/detail', //美味菜谱详情
  browse: ip + '/api/mwkt/video/recipes/view', //美味菜谱详情
  comment: ip + '/api/mwkt/video/recipes/comment', //发表评论接口
  siginBtn: ip + '/api/member/sign/start/' + app.globalData.memberId, //点击签到
  calendar: ip + '/api/member/signin/list/' + app.globalData.memberId, //日历记录

  banner: ip + '/api/shop/adv/getAll', //商城轮播图
  shoppingcategory: ip + '/api/shop/category/getAll', //商城分类
  shoppingList: ip + '/api/shop/goods/list', //商城列表
  shoppingDetail: ip + '/api/shop/goods/detail/', //商品详情
   
       
  commentList: ip + '/api/member/comment/list/' + app.globalData.memberId, // 评论记录
  memberId : ip + '/api/member/dianz/list/{memberId}',	//点赞记录接口
	list: ip + '/api/mwkt/video/recipes/list',	//美味课堂接口
	view: ip + '/api/mwkt/video/recipes/view',	//美味菜谱和视频浏览
	relay: ip + '/api/mwkt/video/recipes/relay',	//美味课堂视频或菜谱分享
	detail: ip + '/api/mwkt/video/recipes/detail',	//美味视频或美味菜谱详情
	dianz: ip + '/api/mwkt/video/recipes/dianz'	//视频，美味菜谱和评论点赞接口
};

module.exports = api;