var ip = 'http://192.168.1.105:8085';

var api = {
  memberId : ip + '/api/member/dianz/list',							//点赞记录接口
	delicious: ip + '/api/mwkt/video/recipes/list',				//美味课堂接口
};

module.exports = api;