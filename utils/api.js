
const app = getApp()
var dev = 'http://192.168.1.16:8085';
var dev1 = 'http://192.168.1.16:8080';

var test = 'https://apitest-qr.cresz.com.cn';
var test1 = 'https://test-qr.cresz.com.cn';

var pro = 'https://api-qr.cresz.com.cn';
var pro1 = 'https://qr.cresz.com.cn';

var ip = test;
var ip1 = test1;

var api = {
  
  getOpenidByCode: ip1 + '/mini/program/getOpenidByCode', // 获取openid
  reginfo: ip + '/api/member/register/info', // 小程序授权成功自动注册会员接口
  deliciousList: ip + '/api/mwkt/video/recipes/list', // 美味课堂首页 
  siginInfo: ip + '/api/member/sign/info/', //美味课堂签到信息
  dianz: ip + '/api/mwkt/video/recipes/dianz', //点赞
  deliciousDetail: ip + '/api/mwkt/video/recipes/detail', //美味菜谱详情
  browse: ip + '/api/mwkt/video/recipes/view', //美味菜谱浏览记录
  comment: ip + '/api/mwkt/video/recipes/comment', //发表评论接口
  siginBtn: ip + '/api/member/sign/start/', //点击签到
  calendar: ip + '/api/member/signin/list/', //日历记录

  banner: ip + '/api/shop/adv/getAll', //商城轮播图
  shoppingcategory: ip + '/api/shop/category/getAll', //商城分类
  shoppingList: ip + '/api/shop/goods/list', //商城列表
  shoppingDetail: ip + '/api/shop/goods/detail/', //商品详情
  address: ip + '/api/shop/getDefault/', //默认收货地址
  submitOrder: ip + '/api/shop/submit/order/', //提交订单

  addressList: ip + '/api/shop/receiveAddr/list/', //收货地址列表
  addressAdd: ip + '/api/shop/receiveAddr/add/', //添加地址
  addressUpd: ip + '/api/shop/receiveAddr/upd/', //修改地址
  addressDel: ip + '/api/shop/receiveAddr/del/', //删除地址
  activity: ip + '/api/game/point/activity', // 九宫格获取奖项信息
  lottery: ip + '/api/game/point/lottery/' , // 九宫格抽奖
  addressDef: ip + '/api/shop/setDefault/', //设置默认收货地址

  //register: ip + '/api/member/register/info',    // 注册
  userInfo: ip + '/api/member/owner/info/', //个人中心
  orderList: ip + '/api/shop/order/list/', //订单列表
  kdinfo: ip + '/api/shop/order/wuliu/', //快递信息

  orderOk: ip + '/api/shop/confirm/order/',//确认收货
 
  integralList: ip + '/api/member/point/updlist/', //积分记录
  joinList: ip + '/api/member/pointj/list/', //积分抽奖记录
  dianzList: ip + '/api/member/dianz/list/', //点赞记录
  commentList: ip + '/api/member/comment/list/', // 评论记录
  relayList: ip + '/api/member/share/list/', // 分享记录
  lotteryList: ip + '/api/member/activity/lottery/', //一物一码中奖记录
  infoSub: ip + '/api/member/finish/info/', // 完善个人资料
  lotter: ip + '/qdwz/lihong/xcx/lotter', // 一物一码抽奖接口

  saveEntityObjRewardAddr: ip + '/qdwz/lihong/saveEntityObjRewardAddr', // 一物一码收货地址
  relay: ip + '/api/mwkt/video/recipes/relay', // 美味课堂分享接口
  uvpv: ip + '/api/uvpv/submit/info', //uv记录
  userCash: ip + '/api/consumer/cash/userCash', //提现接口

  msg:ip+ '/qdwz/wechat/xcx/bizRedPacket/msg', //红包提现错误接口
  decrypt: ip+'/qdwz/wechat/xcx/mobile/decrypt', //获取手机号码
  retry: ip+'/api/consumer/cash/retry/', //当前未领取红包
  callback: ip + '/api/consumer/cash/callback/', //领取红包回调
  advlogin: ip + '/api/shop/adv/login', //首页弹窗
  categoryList: ip + '/api/mwkt/video/category/list', //社区分类
  rule: ip + '/qdwz/activity/rule', //获取最新活动规则内容接口
}


module.exports = api;