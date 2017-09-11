var weatherIndexNum = 1;//天气指数数字

/**
 * 智能问答配置
 */
var QAConfig={
		host:"/cms",
		hostName:"闽侯县政府门户网站",
		simpleName:"福建闽侯",
		qaMathPrecision:0.2,//问答返回精度
		showPrecision:0.8,//问答命中显示精度
		chatPrecision:0.9//聊天命中显示精度
}

/**
 * 智能QA
 */
var QA = {
	//点击问题链接时
	click : function(e, qaId) {
		query($(e).text(), '', qaId);
	},
	/**
	 * 问题查询
	 */
	query:function(question,historyObject,history) {
		if(!question){
			question = $("#q").val();
		}
		if(!question||$.isEmptyObject($.trim(question))){
			//
			QA.showMessage("0","<span style='color:red;'>输入内容不能为空哦，请输入您想知道的问题，再发送提问哦。</span>");
			return;
		}
		if(!historyObject){
			historyObject = $("#historyObject").val();
			$("#historyObject").val('');
		}
		$.ajax({
				type : "post",
				contentType:"application/x-www-form-urlencoded;charset=UTF-8",
				url : QAConfig.host+"/inteligence.sp?act=qa",
				data:{"q":question,"historyObject":historyObject,"history":history,"qaMathPrecision":QAConfig.qaMathPrecision},
				dataType : "text",
				beforeSend : function(xhr){
					QA.showMessage("1",question);
				},
				complete:function(xhr,status){
					//$('#talk_box').scrollTop( $('#talk_box')[0].scrollHeight );
				},
				success : function(data) {
					var jsonObj = $.parseJSON(data);
					//请求成功
					if (jsonObj&&jsonObj.rspCode=="0") {
						try{console.log(jsonObj);}catch(e){}
						try{
							var response;
							if("train"==jsonObj.service){//火车票
								
							}else if("mhweather" == jsonObj.service){//闽侯天气
								if(jsonObj.data.result.status=='success'){
									QA.showWeatherMessage(jsonObj.data.result);
									return;
								}else{
									response = jsonObj.answer.text;
								}
								
							}else if("commonTool" == jsonObj.service){//常用工具匹配
								var type = jsonObj.semantic.slots.type;
								if('telephone' == type){
									var result = jsonObj.data.result;
									response = result.province+" "+result.city+" "+result.company+" "+result.card;
								}else{
									response = jsonObj.answer.text;
								}
							}else if("mhFAQ" == jsonObj.service){//闽侯常见问题解答
								var hit = false;
								if("mhFAQ" == jsonObj.service&&jsonObj.score>=QAConfig.showPrecision){
									response = '<h2><a target=\"_blank\" href=\"'+QAConfig.host+'/ar/'+jsonObj.data.result.extParam+'.htm\">'+jsonObj.data.result.question+'>></a></h2><p>'+jsonObj.answer.text+'</p>';
									hit = true;
								}
								var tempResponse=''; 
								if("mhFAQ" == jsonObj.service){
									if(!hit){
										title = jsonObj.data.result.question_hl?jsonObj.data.result.question_hl:jsonObj.data.result.question
										tempResponse = "<li style='color:blue;'><a style='color:blue;' href='javascript:void(0);' onclick=\"QA.query('"+jsonObj.data.result.question+"');\" >"+title+"</a>&nbsp;<a target=\"_blank\" href='"+QAConfig.host+"/ar/"+jsonObj.data.result.extParam+".htm' >>></a></li>";
									}
									if(jsonObj.moreResults&&jsonObj.moreResults.length>0){
										$.each(jsonObj.moreResults , function(i, value){
											if("mhFAQ" == value.service){
												title = value.data.result.question_hl?value.data.result.question_hl:jsonObj.data.result.question
												tempResponse += "<li style='color:blue'><a style='color:blue;'href='javascript:void(0);' onclick=\"QA.query('"+value.data.result.question+"');\" >"+title+"</a>&nbsp;<a target=\"_blank\" href='"+QAConfig.host+"/ar/"+jsonObj.data.result.extParam+".htm' >>></a></li>";
											}
										});
									}
								}
								if(hit&&tempResponse){
									response += "<p><b>更多相关信息：</b></p><ul>"+tempResponse+"</ul>";
								}else if(!hit&&tempResponse){
									response = "您好，“"+QAConfig.simpleName+"”政府门户网站智能机器人还在成长中，根据您的问题，未能帮您找到合适的答案。但找到其它相关信息，希望对您有帮助：</br><ul>"+tempResponse+"</ul>";
								}
							}else if("mhChat" == jsonObj.service){//闽侯聊天
								if(jsonObj.score>=QAConfig.chatPrecision){
									response = jsonObj.answer.text;
								}
							}else{
								if(!response){
									response = jsonObj.answer.text;
								}
							}
							if(response){
								QA.showMessage("0",response);
							}else{
								QA.showMessage("0","您好，“"+QAConfig.simpleName+"”政府门户网站智能机器人还在成长中，根据您的问题，未能帮您找到合适的答案，您可以试着换个说法进行提问或转到网站的搜索平台进行搜索。");
							}
							try{
								if(jsonObj.history){
									$("#historyObject").val(data);
								};
							}catch(e){
								
							}
						}catch(e){
							QA.showMessage("0","您好，“"+QAConfig.simpleName+"”政府门户网站智能机器人还在成长中，根据您的问题，未能帮您找到合适的答案，您可以试着换个说法进行提问或转到网站的搜索平台进行搜索。");
							try{console.log(e);}catch(e){}
						}
					//} else if(jsonObj&&jsonObj.rspCode=="4"){
					//	QA.showMessage("0",jsonObj.error.message);
					} else{
						QA.showMessage("0","您好，“"+QAConfig.simpleName+"”政府门户网站智能机器人还在成长中，根据您的问题，未能帮您找到合适的答案，您可以试着换个说法进行提问或转到网站的搜索平台进行搜索。");
					}
	
				},
				error : function(e) {
					QA.showMessage("0","<span style='color:red;'>报歉，请求出错，请稍候重试！</span>");
				}
			});
	
	},
	
	/**
	 *显示信息
	 *@param type,显示消息的类型：0:机器人 1:用户 2:显示loading
	 *@param con,消息内容
	 */
	showMessage:function(type,con){
		var scrollHeight = $("#talk_box")[0].scrollHeight;
		var date = QA.curentTime();
		if('0'==type){
			//删除loading...
			$("#robotLoadingBak").remove();
			var robot = $("#talk_robot").clone();
			$(".talk_con",robot).html(con);
			$(".date",robot).html(date);
			$("#talk_box").append(robot);
			robot.show();
		}else if('1'==type){
			//删除loading...
			$("#robotLoadingBak").remove();
			var robot = $("#talk_visitor").clone();
			$(".date",robot).html(date);
			$(".talk_con",robot).html(con);
			$("#talk_box").append(robot);
			robot.show()
			//添加loading...
			var loading = $("#talk_robot").clone();
			loading.attr("id","robotLoadingBak");
			$(".date",loading).html(date);
			$(".talk_con",loading).html("<img src='"+Cfg.basePath+"images/loading.gif' />&nbsp;正在处理...");
			$("#talk_box").append(loading);
			loading.show();
		}
		var currScrollHeight = $("#talk_box")[0].scrollHeight;
		//console.log("old:"+scrollHeight+" new:"+currScrollHeight);
		if(currScrollHeight-scrollHeight>365){
			if(scrollHeight>555){
				currScrollHeight = scrollHeight-190;
			}else{
				currScrollHeight = 0;
			}
		}
		$("#talk_box").scrollTop( currScrollHeight);
	},
	//获取当前时间并格式化，得到这样的时间2014-02-18 15:07:51
	curentTime:function () {
		var now = new Date();
		var year = now.getFullYear(); //年
		var month = now.getMonth() + 1; //月
		var day = now.getDate(); //日  
		var hh = now.getHours(); //时
		var mm = now.getMinutes(); //分  
		var ss = now.getSeconds(); //秒  
		var clock = year + "-";
		if (month < 10)
			clock += "0";
		clock += month + "-";
		if (day < 10)
			clock += "0";
		clock += day + " ";
		if (hh < 10)
			clock += "0";

		clock += hh + ":";
		if (mm < 10)
			clock += '0';
		clock += mm +":";
		if (ss < 10)
			clock += '0';
		clock += ss;
		return (clock);
	},
	/**
	 * 切换详细信息
	 */
	toggleWeatherDetail:function(o){
		if(!o){return;}
		var jqueryObject = $(o);
		var targetO = $("#"+jqueryObject.attr('targetId'));
		var weatherDetailO = $("#"+jqueryObject.attr('infoId'));
		jqueryObject.hide();
		targetO.show();
		if(weatherDetailO.attr("show")=="false"){
			weatherDetailO.show();
			weatherDetailO.attr("show","true")
		}else{
			weatherDetailO.hide();
			weatherDetailO.attr("show","false")
		}
	},
	//显示天气信息
	showWeatherMessage:function(weatherData){
		if(!weatherData){return;}
		var weatherBlock = $("#weather_block").clone()
		var curCityWeather = weatherData.results[0];
		//填充今天的天气数据
		var today = weatherData.results[0].weather_data[0];
		$("#cityName",weatherBlock).text(curCityWeather.currentCity);
		$("#date",weatherBlock).text(today.date);
		$("#pm25",weatherBlock).text("空气质量："+curCityWeather.pm25+" "+QA.airLevel(curCityWeather.pm25));
		var iconKey = "";
		if(today.dayPictureUrl){
			iconKey = QA.chinaWeatherIcon(today.dayPictureUrl);
		}else{
			iconKey = QA.chinaWeatherIcon(today.nightPictureUrl);
		}
		$("#weather_icon",weatherBlock).attr("src",Cfg.basePath+"images/weather/day/"+iconKey+".png");
		$("#weather_temp",weatherBlock).text(today.temperature);
		$("#weather_wind",weatherBlock).text(today.wind);
		$("#weather",weatherBlock).text(today.weather);
		//填充3天预报
		for(var i=1;i<curCityWeather.weather_data.length;i++){
			today = curCityWeather.weather_data[i];
			if(today.dayPictureUrl){
				iconKey = QA.chinaWeatherIcon(today.dayPictureUrl);
			}else{
				iconKey = QA.chinaWeatherIcon(today.nightPictureUrl);
			}
			$("#date_"+i,weatherBlock).text(today.date);
			$("#weather_icon_"+i,weatherBlock).attr("src",Cfg.basePath+"images/weather/day/"+iconKey+".png");
			$("#weather_temp_"+i,weatherBlock).text(today.temperature);
			//$("#weather_wind_"+i,weatherBlock).text(today.wind);
			$("#weather_"+i,weatherBlock).text(today.weather);
		}
		//填充详细指数
		var clone_tit = $("#tit_block",weatherBlock).clone();
		var parent = $("#tit_block",weatherBlock).parent();
		parent.empty();
		for(var i=0;i<curCityWeather.index.length;i++){
			var indexInfo = curCityWeather.index[i];
			var tit = clone_tit.clone();
			$("#tit_title",tit).text(indexInfo.tipt+"："+indexInfo.zs);
			$("#tit_detail",tit).text(indexInfo.des);
			parent.append(tit);
		}
		//随机改变指数块id
		var index = weatherIndexNum++;
		var moreBtnUp = $("#moreBtnUp",weatherBlock);
		moreBtnUp.attr("id","moreBtnUp_"+index);
		moreBtnUp.attr("targetId","moreBtnDown_"+index);
		moreBtnUp.attr("infoId","weather_detail_"+index);
		var weather_detail = $("#weather_detail",weatherBlock);
		weather_detail.attr("id","weather_detail_"+index);
		var moreBtnDown = $("#moreBtnDown",weatherBlock);
		moreBtnDown.attr("id","moreBtnDown_"+index);
		moreBtnDown.attr("targetId","moreBtnUp_"+index);
		moreBtnDown.attr("infoId","weather_detail_"+index);
		//显示天气模块
		QA.showMessage("0",weatherBlock.remove().html());
	},
	airLevel:function(pm25){
		if(pm25<=50){
			return "优";
		}else if(pm25>50&&pm25<=100){
			return "良";
		}else if(pm25>100&&pm25<=150){
			return "轻度污染";
		}else if(pm25>150&&pm25<=200){
			return "中度污染";
		}else if(pm25>200&&pm25<=300){
			return "重度污染";
		}else if(pm25>300){
			return "严重污染";
		}else{
			return "未知";
		}
	},
	chinaWeatherIcon:function(baiduIconUrl){
		if(!baiduIconUrl){return;}
		var startIndex = baiduIconUrl.lastIndexOf("/")+1;
		var endIndex = baiduIconUrl.lastIndexOf(".");
		return iconMatch[baiduIconUrl.substring(startIndex,endIndex)];
	}
};

var iconMatch = {
		"qing" : "00",
		"duoyun" : "01",
		"yin" : "02",
		"zhenyu" : "03",
		"leizhenyu" : "04",
		"leizhenyubanyoubingbao" : "05",
		"yujiaxue" : "06",
		"xiaoyu" : "07",
		"zhongyu" : "08",
		"dayu" : "09",
		"baoyu" : "10",
		"dabaoyu" : "11",
		"tedabaoyu" : "12",
		"zhenxue" : "13",
		"xiaoxue" : "14",
		"zhongxue" : "15",
		"daxue" : "16",
		"baoxue" : "17",
		"wu" : "18",
		"dongyu" : "19",
		"shachenbao" : "20",
		"xiaoyuzhuanzhongyu" : "21",
		"zhongyuzhuandayu" : "22",
		"dayuzhuanbaoyu" : "23",
		"baoyuzhuandabaoyu" : "24",
		"dabaoyuzhuantedabaoyu" : "25",
		"xiaoxuezhuanzhongxue" : "26",
		"zhongxuezhuandaxue" : "27",
		"daxuezhuanbaoxue" : "28",
		"fuchen" : "29",
		"yangsha" : "30",
		"qiangshachenbao" : "31",
		"mai" : "53",
		"无" : "99"
};
