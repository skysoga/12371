/**
 * 智能问答js
 * author by zyl
 */

var weatherIndexNum = 1,//天气指数数字
	detailNum = 1;//文字显示详细的数字
/**
 * cms留言类型、评分模型配置
 */
var CMSConfig={
	categoryCode : "wtzx",//留言类型别名(根据不同的项目,将cms中新建的留言分类类型的别名填上)
	mdrId : "1400000012"//(cms评分模型中模型标识,根据cms的评分类型而更改)
}
	
/**
 * 智能问答配置
 */
var QAConfig={
	host : "/pmc",//根据情况更改
	hostName : "党员e家",
	simpleName : "党员e家",
	qaMathPrecision : 0.2,//问答返回精度
	showPrecision : 0.8,//问答命中显示精度
	chatPrecision : 0.9,//聊天命中显示精度
	},
	tipContent = "限用100字简要描述您的问题，比如“什么是发展对象”";//输入框的提示字(根据情况修改)

/**
 * 初始化我要体验和时间
 */
window.onload=function(){ 
	var date = QA.curentTime();
	$(".date").html(date);
};

/**
 * userId
 */
var userId = "";

/**
 * 智能QA
 */
var QA = {
	//点击问题链接时
	click : function(e) {
		query($(e).text(), '');
	},
	/**
	 * 问题查询
	 * 
	 * [question]=问题
	 */
	query:function(question,historyObject,history) {
		var fhtml=true;
		var fjs=true;
		var fcss=true;
		if(!question){
			question = $("#q").val();
		}
		if (!fhtml && !fjs && !fcss && !fself)
	        fhtml = true;
	    if (fjs)
	    	question = question.replace(/<\s*script[^>]*>(.|[\r\n])*?<\s*\/script[^>]*>/gi, '');
	    if (fcss)
	    	question = question.replace(/<\s*style[^>]*>(.|[\r\n])*?<\s*\/style[^>]*>/gi, '');
	    if (fhtml) {
	    	question = question.replace(/<\/?[^>]+>/g, '');
	        question = question.replace(/\&[a-z]+;/gi, '');
	    }
	    if(!question||$.isEmptyObject($.trim(question))){
			QA.showMessage("0","<span style='color:red;'>输入内容不能为空，请输入您想知道的问题，再发送提问!</span>");
			return;
		}
		if(!historyObject){
			historyObject = $("#historyObject").val();
			$("#historyObject").val('');
		}	
		$.ajax({
			type : "post",
			contentType:"application/x-www-form-urlencoded;charset=UTF-8",
			url : QAConfig.host+"/party/inteligence/qa.json",
			data:{"q":question,"historyObject":historyObject,"history":history,"qaMathPrecision":QAConfig.qaMathPrecision,"appId":QAConfig.appId,"mdrId":CMSConfig.mdrId},
			dataType : "text",
			beforeSend : function(xhr){
				QA.showMessage("1",question);
			},
			complete:function(xhr,status){
					//$('#talk_box').scrollTop( $('#talk_box')[0].scrollHeight );
			},
			success : function(data) {
				var jsonObj = $.parseJSON(data);
				//调用智能引擎请求成功
				if (jsonObj&&jsonObj.rspCode=="0") {
//					try{console.log(jsonObj);}catch(e){}
					try{
						var response;
						if("questionSearch"==jsonObj.service){//问题查询
							var result = jsonObj.data.result;
							var isNull = isNullObj(result);
							if(result != null&&!isNull){
								response = result;
								QA.showQuestion(response);
								return;
							}else{
								response = "<p>很抱歉，您输入的编号或者验证码有误!</p>";
							}				
						}else if("Myquestion"==jsonObj.service){
							var qa = $.parseJSON(jsonObj.answer);
							if(qa!=null){
								var myQuestion =  $.parseJSON(jsonObj.answer.text);
								var content = "	<p class=\"desc\" ><span style=\"color:red;\" >温馨提醒：</span>“我的问题”未入库，不能通过输入进行回复</p><p class=\"desc\" >(只显示最多10条的记录)</p><ul class=\"guide\"> ";
							    jQuery.each(myQuestion, function (i, val) { 
							    	var temp="";
							    	if(val.messagesAudit){
							    		if('3'== val.messagesAudit.status){
							    			temp="正在办理";
								    	}else if('4'==val.messagesAudit.status){
								    		temp="已办理";
								    	}else if('5'==val.messagesAudit.status){
								    		temp="不办理";
								    	}else{
								    		temp="未办理";
								    	}
								    	content = content+"  <li>"+(i+1)+"、<a href=\"javascript:void(0)\" class='showAnswer_"+i+"' onclick=\"myQA(this);\"> "+val.msgTitle+"</a> " +
								    				"<ul class=\"fq\"><li class=\"con  fqaAnswer\" style=\"display:none;\">答："+val.messagesAudit.replyContent+"<span style='color:red'>&nbsp;("+temp+")</span> </li></ul>   </li>";
							    		}else{
							    			content = content+"  <li>"+(i+1)+"、<a href=\"javascript:void(0)\" class='showAnswer_"+i+"' onclick=\"myQA(this);\"> "+val.msgTitle+"</a>" +
							    					" <ul class=\"fq\"><li class=\"con  fqaAnswer\" style=\"display:none;\">答：请耐心等待工作人员处理该问题… <span style='color:red'>&nbsp;(未办理 )</span></li></ul> </li>";
							    		}
							    	 });
							    	content = content+"</ul>";
							    	response = content;
							}else{
								response ="";
							}
							
						}
						else if("mhweather" == jsonObj.service){//闽侯天气
							if(jsonObj.data.result.status=='success'){
								QA.showWeatherMessage(jsonObj.data.result);
								return;
							}else{
								response = jsonObj.answer.text;
							}
						}else if("translation" == jsonObj.service){//翻译
							var result = jsonObj.data.result;
							if(result != null){
								response = result.result;
							}				
							}else if("fmAnswer" == jsonObj.service){//表单问答
								var hit = false;
								if("fmAnswer" == jsonObj.service&&jsonObj.score>=QAConfig.showPrecision){//命中精确
									response = jsonObj.answer.text;
									hit = true;
								}
								var tempResponse='';
								if("fmAnswer" == jsonObj.service){
									if(!hit){
										title = jsonObj.data.result.qa.question_hl?jsonObj.data.result.qa.question_hl:jsonObj.data.result.qa.question;
										response = "<p><b>您是不是要找：</b></p><ul><li ><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+jsonObj.data.result.qa.question+"');\" >"+title+"</a></li></ul>";
									}
									if(jsonObj.moreResults&&jsonObj.moreResults.length>0){
										$.each(jsonObj.moreResults , function(i, value){
											if("fmAnswer" == value.service){
												title = value.data.result.qa.question_hl?value.data.result.qa.question_hl:value.data.result.qa.question;
												tempResponse += "<li><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+value.data.result.qa.question+"');\" >"+title+"</a></li>";
											}
										});
									}
									answerType = jsonObj.data.result.qa.answerType;//是否有子列表subQaList
									if(answerType==1){//场景式问题,即上下文问答实现方式
										var qaJson = jsonObj.data.result.qa.subQaList;
										if(qaJson!=""&&qaJson!=undefined&&qaJson!=null){//存在子问题列表
											var childResponse = '';
											jQuery.each(qaJson, function (i, val) { 
												childResponse += "<li><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+val.question+"');\">"+val.question+"</a></li>";
											});
											response += "<p></p><ul>"+childResponse+"</ul>";
										}
									}
								}
								if(hit&&tempResponse){
									response += "<p><b>更多相关信息：</b></p><ul>"+tempResponse+"</ul>";
								}else if(!hit&&tempResponse){
									response = "<p><b>您是不是要找：</b></p><ul>"+tempResponse+"</ul>";
								}
							}else if("commonTool" == jsonObj.service){//常用工具匹配
								var type = jsonObj.semantic.slots.type;
								if('telephone' == type){
									var result = jsonObj.data.result;
									response = result.province+" "+result.city+" "+result.company+" "+result.card;
								}else{
									response = jsonObj.answer.text;
								}
							}else if("partyFAQ" == jsonObj.service){//12371常见问题解答
								var hit = false;
								if("partyFAQ" == jsonObj.service&&jsonObj.score>=QAConfig.showPrecision){//命中精确
									response = jsonObj.answer.text;
									hit = true;
								}
								var tempResponse='';
								var answerType=''; 
								if("partyFAQ" == jsonObj.service){
									if(!hit){
										title = jsonObj.data.result.qa.question_hl?jsonObj.data.result.qa.question_hl:jsonObj.data.result.qa.question;
										response = "<p><b>您是不是要找：</b></p><ul><li ><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+jsonObj.data.result.qa.question+"');\" >"+title+"</a></li></ul>";
									}
									if(jsonObj.moreResults&&jsonObj.moreResults.length>0){
										$.each(jsonObj.moreResults , function(i, value){
											if("partyFAQ" == value.service){
												title = value.data.result.qa.question_hl?value.data.result.qa.question_hl:value.data.result.qa.question;
												tempResponse += "<li><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+value.data.result.qa.question+"');\" >"+title+"</a></li>";
											}
										});
									}
									
									answerType = jsonObj.data.result.qa.answerType;//是否有子列表subQaList
									if(answerType==1){//场景式问题,即上下文问答实现方式
										var qaJson = jsonObj.data.result.qa.subQaList;
										if(qaJson!=""&&qaJson!=undefined&&qaJson!=null){//存在子问题列表
											var childResponse = '';
											jQuery.each(qaJson, function (i, val) { 
												childResponse += "<li><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+val.question+"');\">"+val.question+"</a></li>";
											});
											response += "<p></p><ul>"+childResponse+"</ul>";
										}
									}								
								}
								
								if(hit&&tempResponse){
									response += "<p><b>更多相关信息：</b></p><ul>"+tempResponse+"</ul>";
								}else if(!hit&&tempResponse){
									response = "<p><b>您是不是要找：</b></p><ul>"+tempResponse+"</ul>";
								}
							}
							else if("mhFAQ" == jsonObj.service){//闽侯常见问题解答
								var hit = false;
								if("mhFAQ" == jsonObj.service&&jsonObj.score>=QAConfig.showPrecision){//命中精确
									response = jsonObj.answer.text;
									hit = true;
								}
								var tempResponse='';
								if("mhFAQ" == jsonObj.service){
									if(!hit){
										title = jsonObj.data.result.qa.question_hl?jsonObj.data.result.qa.question_hl:jsonObj.data.result.qa.question;
										response = "<p><b>您是不是要找：</b></p><ul><li ><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+jsonObj.data.result.qa.question+"');\" >"+title+"</a></li></ul>";
									}
									if(jsonObj.moreResults&&jsonObj.moreResults.length>0){
										$.each(jsonObj.moreResults , function(i, value){
											if("mhFAQ" == value.service){
												title = value.data.result.qa.question_hl?value.data.result.qa.question_hl:value.data.result.qa.question;
												tempResponse += "<li><a class='primary-chu primary-color' href='javascript:void(0);' onclick=\"QA.query('"+value.data.result.qa.question+"');\" >"+title+"</a></li>";
											}
										});
									}
								}
								if(hit&&tempResponse){
									response += "<p><b>更多相关信息：</b></p><ul>"+tempResponse+"</ul>";
								}else if(!hit&&tempResponse){
									response = "<p><b>您是不是要找：</b></p><ul>"+tempResponse+"</ul>";
								}
							}
							else if("chat" == jsonObj.service){//聊天
								if(jsonObj.score>=QAConfig.chatPrecision){
									response = jsonObj.answer.text;
								}
							}
							else if("mhChat" == jsonObj.service){//闽侯聊天
								if(jsonObj.score>=QAConfig.chatPrecision){
									response = jsonObj.answer.text;
								}
							}
							else{
								if(!response){
									response = jsonObj.answer.text;
								}
							}
							if(response){
								QA.showMessage("0",response);
							}else{
								response = "<p>很抱歉哦，您问的问题我不是很理解，您可以通过<a class=\"primary-chu primary-color showbox\" href=\"javascript:void(0);\" onclick=\"showMessage();\">留言咨询</a>进行提问，我们会尽快给你答复</p>";
								QA.showMessage("0", response);	
							}
							try{
								if(jsonObj.history){
									$("#historyObject").val(data);
								};
							}catch(e){
								
							}
						}catch(e){
							response = "<p>很抱歉哦，您问的问题我不是很理解，您可以通过<a class=\"primary-chu primary-color showbox\" href=\"javascript:void(0);\" onclick=\"showMessage();\">留言咨询</a>进行提问，我们会尽快给你答复</p>";
							QA.showMessage("0", response);
							try{console.log(e);}catch(e){}
						}
					}
					else{
						response = "<p>很抱歉哦，您问的问题我不是很理解，您可以通过<a class=\"primary-chu primary-color showbox\" href=\"javascript:void(0);\" onclick=\"showMessage();\">留言咨询</a>进行提问，我们会尽快给你答复</p>";
						QA.showMessage("0", response);
					}
	
				},
				error : function(e) {
					QA.showMessage("0","<span style='color:red;'>报歉，请求出错，请稍候重试!</span>");
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
		var robot = "";
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
			robot.show();
			//添加loading...
			var loading = $("#talk_robot").clone();
			loading.attr("id","robotLoadingBak");
			$(".date",loading).html(date);
			$(".talk_con",loading).html("<img data-th-src='@{/tpl/def/002/inteligence/images/loading.gif}' src='/pmc/tpl/def/002/inteligence/images/loading.gif' />&nbsp;正在处理...");
			$("#talk_box").append(loading);
			loading.show();
		}
		var currScrollHeight = $("#talk_box")[0].scrollHeight;
		if(currScrollHeight-scrollHeight>365){
			if(scrollHeight>555){
				currScrollHeight = scrollHeight-190;
			}else{
				currScrollHeight = 0;
			}
		}
		$("#talk_box").scrollTop( currScrollHeight);
		//显示更多详细内容
//		$('#more_btn'+index+'').click(function(e){
//			var x=$('#more_info'+index+'');
//			x.toggleClass('dis-block');
//			if(x.hasClass('dis-block')){
//				this.innerHTML='收起<i class="arrow_down arrow_up1"></i>';		
//			}
//			else{
//				this.innerHTML='查看详细信息<i class="arrow_down"></i>';
//			}
//			return;
//		});
	},
	//显示问题办理信息
	showQuestion:function(message){
		if(message.msgId==undefined){return;}
		var messageBlock = $(".guide").clone();
		var msgTitle = message.msgTitle;
		var temp = "";
		$("#questionTitle",messageBlock).html(msgTitle+"?");//标题
		if(message.status=="0"){
			$(".state",messageBlock).html("&nbsp;&nbsp;(未办理)");//状态
		}else{
			if(message.messagesAudit!=""&&message.messagesAudit!=null&&message.messagesAudit!=undefined){
				if('3'== message.messagesAudit.status){
					temp="正在办理";
				}else if('4'==message.messagesAudit.status){
					temp="已办理";
				}else if('5'==message.messagesAudit.status){
					temp="不办理";
				}else{
					temp="未办理";
				}
				$(".state",messageBlock).html("&nbsp;&nbsp;("+temp+")");
				$("#answer",messageBlock).html("答:&nbsp;"+message.messagesAudit.replyContent);
			}
		}
		QA.showMessage("0",messageBlock.remove().html());		
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
	//显示天气信息
	showWeatherMessage:function(weatherData){
		if(!weatherData){return;}
		var weatherBlock = $("#weather_block").clone();
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
		$("#weather_icon",weatherBlock).attr("src","/pmc/tpl/def/002/inteligence/images/weather/day/"+iconKey+".png");
		$("#weather_icon",weatherBlock).attr("data-th-src","@{/tpl/def/002/inteligence/images/weather/day/"+iconKey+".png");
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
			$("#weather_icon_"+i,weatherBlock).attr("src","/pmc/tpl/def/002/inteligence/images/weather/day/"+iconKey+".png");
			$("#weather_icon_"+i,weatherBlock).attr("data-th-src","@{/tpl/def/002/inteligence/images/weather/day/"+iconKey+".png");
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
		$('#moreBtnDown_'+index+'').click(function(e){
			var x=$('#weather_detail_'+index+'');
			x.toggleClass('dis-block');
			if(x.hasClass('dis-block')){
				this.innerHTML='收起<i class="arrow_down arrow_up1"></i>';		
			}
			else{
				this.innerHTML='查看今天详细信息<i class="arrow_down"></i>';
			}		
		});
		
		
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

/**
 * 显示留言表单
 */
function message(e){
	userId = $('#suserId').attr('value');
	checkLogin();
	if(userId!=""){
		var id = $(e).attr("reveal-model-id");
		$('#'+id).css("display","block");
		$("#TB_overlayBG").css({
			display:"block",height:$(document).height()
		});
		$(".box-content").css({
			left:($("body").width()-$("#"+id).outerWidth())/2+"px",
			top:($(window).height()-$("#"+id).height())/2+$(window).scrollTop()+"px"
		});
		$('body').css("overflow","hidden");
		$('html').addClass('visible');	
	}else{
		QA.showMessage("0","当前您还未登录,请先登录后再留言!");
	}
}

/**
 * 提交留言表单
 * @param e
 * @returns {Boolean}
 */
function submintQuestion(e){
	data=$('form').serializeObject();
	var title = $("input[name='title']").val() ;
	var content = $("textarea[name='content']").val(); 
	var msgId = $('#msgId').val();
	var cmtId = $("input[name='q_cmtId']").val() ;
	
	data.msgId = msgId;
	data.title = title;
	data.content = content;
	data.categoryCode = CMSConfig.categoryCode;
	data.mdrId = CMSConfig.mdrId;
	data.cmtId = cmtId;

	if(title==""||content=="")
		return false; 
	
	$.ajax({
		method : "post",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		url : "/pmc/party/question/add.json",
	    data : data,
	    dataType : "json",   
	    success : function(res){	
	    	res = JSON.parse(res);
	    	if(res.ret==0){	
	    		var response = "<p>恭喜你留言成功!</p><p>你的留言问题编号为："+res.data.msgId+"，验证码为"+res.data.verCode+"。请妥善保管用于查询留言回复情况。</p>";
	    		QA.showMessage("0",response);
	    		$("#TB_overlayBG").css("display","none");
	    		$(".box ").css("display","none");
	    		$("#showbox1").css("display","none");
	    		$("input[name='title']").val("") ;
	    		$("textarea[name='content']").val(""); 
	    	}else{
	    		$("#TB_overlayBG").css("display","none");
	    		$(".box ").css("display","none");
	    		$("#showbox1").css("display","none");
	    		$("input[name='title']").val("") ;
	    		$("textarea[name='content']").val(""); 
	    		var response = "<p>抱歉!您的留言未成功提交!请重试!</p>";
	    		QA.showMessage("0",response);
	    		
	    	}	            
	    },
	    error: function () {
	    	$("#TB_overlayBG").css("display","none");
    		$(".box ").css("display","none");
    		$("#showbox1").css("display","none");
    		$("input[name='title']").val("") ;
    		$("textarea[name='content']").val(""); 
	    	var response = "<p>抱歉!您的留言未成功提交!请重试!</p>";
    		QA.showMessage("0",response);
	    }
	});
}


function query(type) {
	if(tipContent==$("#q").val()){
		QA.showMessage("0","<span style='color:red;'>输入内容不能为空哦，请输入您想知道的问题，再发送提问哦。</span>");
		return;
	}
	if("1"==type){
		var event = arguments.callee.caller.arguments[0] || window.event;//消除浏览器差异  
		if (event.keyCode == 13) {
			QA.query();
			$('#q').val('');
			var e = window.event||arguments[0];
			e.returnValue = false;
			return false;
		}
	}else{
		QA.query();
		$('#q').val('');
	}
}


var eleList = ["levelmenu","levelmenu1","levelmenu2","levelmenu3"];

var cb = 'loginSuccess';

//显示当前菜单
function showCurrentMenu(agreeDiv,currentObj,event){
	if(!event){event=window.event;}
	var eventObj=event.srcElement?event.srcElement:event.target;
	//先隐藏所有ul
	var length=agreeDiv.length;
	for(var i=0;i<length;i++){
		if(eventObj.parentNode==agreeDiv[i] || eventObj.nodeName!="H5"){continue;}
		agreeDiv[i].className="unit";
	}
	if(eventObj.nodeName=="H5"){
		if(eventObj.parentNode.className=="unit"){
			eventObj.parentNode.className="unit current";
		}else{
			eventObj.parentNode.className="unit";
		}
	}
}

function checkLogin(){
	var url = Cfg.ssoUrl+'/sso_ws/getLogin'+
	'?host='+ encodeURIComponent(location.origin + Cfg.contextPath)+
	'&path='+ encodeURIComponent('/red.jsp' + (false ? ('?redUrl=' + encodeURIComponent(false+'/red.jsp?cb='+cb)) : '?cb='+cb) );
	var loginhtml=' <iframe src="'+url+'" style="height:428px;width:100%;" marginwidth="0" marginheight="0" frameborder="0" allowtransparency=""></iframe>';
	$('.loginflag').html(loginhtml);
	window[cb] = function() {
		//这里面写登录成功后你要执行的操作
		$("#TB_overlayBG").css("display","none");
		$(".box-content ").css("display","none");
		$('body').attr("style"," ");
		$('html').removeClass('visible');
		$('#login').attr("style","display:none");	
		$('#suserId').attr('value','login');
	}
}

$(function(){
	var clientwidth=document.documentElement.clientWidth;
	if(clientwidth>640){
		$(window).ready(function(){
			var height=document.documentElement.clientHeight;
			$('#frame_main').css('height',height-96);
			$('#talk_box').css('height',height-247);	
		});
		$(window).resize(function(){
				var height=document.documentElement.clientHeight;
				$('#frame_main').css('height',height-96);
				$('#talk_box').css('height',height-247);
		});
	}else{
		$(window).ready(function(){
			var height=document.documentElement.clientHeight;
			$('#frame_main').css('height',height-96);
			$('#talk_box').css('height',height-182);	
		});
		$(window).resize(function(){
				var height=document.documentElement.clientHeight;
				$('#frame_main').css('height',height-96);
				$('#talk_box').css('height',height-182);
		});
	}
	
//	//是否显示登录提示
	userId = $('#suserId').attr('value');
	if(userId==""||userId==undefined||userId==null){
		$('#login').attr("style","display:block");
	}else{
		$('#login').attr("style","display:none");
	}
	checkLogin();
//	var url = Cfg.ssoUrl+'/sso_ws/getLogin'+
//	'?host='+ encodeURIComponent(location.origin + Cfg.contextPath)+
//	'&path='+ encodeURIComponent('/red.jsp' + (false ? ('?redUrl=' + encodeURIComponent(false+'/red.jsp?cb='+cb)) : '?cb='+cb) );
//	var loginhtml=' <iframe src="'+url+'" style="height:428px;width:100%;" marginwidth="0" marginheight="0" frameborder="0" allowtransparency=""></iframe>';
//	$('.loginflag').html(loginhtml);
//	window[cb] = function() {
//		//这里面写登录成功后你要执行的操作
//		$("#TB_overlayBG").css("display","none");
//		$(".box-content ").css("display","none");
//		$('body').attr("style"," ");
//		$('html').removeClass('visible');
//		$('#login').attr("style","display:none");	
//		$('#suserId').attr('value','login');
//	}
	
	var a=$('#send_box').find('.evaluate-now');
	var b=a.find('.dis').find('.step1');
	b.click(function(){
		a.find('.dis').addClass('dis-none');
		a.find('.bad').removeClass('dis-none');	
		$('.evaluate-now').css("top","-55px");	
	});

	var bs=$('#frame_header').find('.bs-window');
	bs.click(function(){
	$(this).toggleClass('bs');
	$('#frame_main').toggleClass('width');
	$('#frame_main').toggleClass('maxwidth');
	$('#data_wap_logo').toggleClass('width');	
	$('#data_wap_logo').toggleClass('maxwidth');	
	});
	
	$('.cl-window').click(function(){
		window.opener=null;  
		window.open('about:blank','_self');  
		window.close();  
	});	
	var a=$('#send_box').find('.evaluate-now');
	var b=a.find('.dis').find('.step1');
	b.click(function(){
//		var isComment=b.attr("iscomment");
//		if(isComment=="1"){
//			QA.showMessage("0","谢谢，您已对本次服务做出过评价了!");
//		}else{
//			a.find('.dis').addClass('dis-none');
//			a.find('.bad').removeClass('dis-none');	
//		}
		
	})
});

//我的问题
function myQuestion(flag){
	userId = $('#suserId').attr('value');
	checkLogin();
	if(userId!=""){
		if(flag=="1"){
			$("#frame_int_3").css("display","block");
			$("#noLoginMyQa").css("display","none");
		}else{
			$("#noLoginMyQa").css("display","none");
		    $("#frame_int_3").css("display","block");
			$.ajax({//获取我的问题数据
				method: "post",
			    url: "/pmc/party/question/myQuestion.json",
			    data:  	{"mdrId":CMSConfig.mdrId},
			    dataType: "json",   
			    success: function(data){	
			    if(data!=null&&data!=undefined&&data!=""){
			     	 jQuery.each(data, function (i, val) { 
			     		var dataUnitInfo = $("#data_unit_info").clone();
				    	dataUnitInfo.attr("id","data_unit_info_"+i);
				    	dataUnitInfo.attr("style","display:block;");
				    	var qTitle = val.msgTitle;
				    	if(qTitle!=undefined&&qTitle.length>16){
				    		qTitle = qTitle.substr(0,16)+"...";
				    	}
				    	$(".titles",dataUnitInfo).html(qTitle+"<i class=\"turn-left\"></i>");  	
				    	$(".titles",dataUnitInfo).attr("title",val.msgTitle);  	
						if(val.status=="0"){
							$(".q-stauts",dataUnitInfo).html("(未办理)");//状态
						}else{
							if(val.messagesAudit!=""&&val.messagesAudit!=null&&val.messagesAudit!=undefined){
								if('3'== val.messagesAudit.status){
									temp="(正在办理)";
								}else if('4'==val.messagesAudit.status){
									temp="(已办理)";							
								}else if('5'==val.messagesAudit.status){
									temp="(不办理)";
								}else{
									temp="(未办理)";
								}
							 	$(".q-stauts",dataUnitInfo).html(val);
								$(".q-stauts",dataUnitInfo).html(temp);//状态
						    	$("#answers",dataUnitInfo).html("<span>答：</span>"+val.messagesAudit.replyContent);
							}
						}
						$("#levelmenu3").append(dataUnitInfo);			    	
					 });
			     	 
			     	 //显示更多
			     	 $("#levelmenu3").append("<a href=\"/pmc/party/question.htm\" class=\"right look-more\"  target=\"_blank\">查看更多&gt;&gt;</a> ");
			     	 $("#myQa").attr("onclick","myQuestion('1');");
			 	    function getEle(arrayId){
				    	return document.getElementById(arrayId);	
				    }	
					for(var i = 0; i < eleList.length; i++){
						init(getEle(eleList[i]));
						console.log(eleList[i]);
					}
					//初始化数组层
					function init(arrayDiv){
						if(!arrayDiv){return;}
						var divObj=arrayDiv.getElementsByTagName("div");
						var length=divObj.length;
						var agreeDiv=new Array();
						for(var i=0;i<length;i++){
							if(divObj[i].className.indexOf("unit")>=0){
								agreeDiv.push(divObj[i]);
								divObj[i].onclick=function(event){
									showCurrentMenu(agreeDiv,this,event);
								};
							}
						}
					}
					init();
			    }else{
			    	   $("#noLoginMyQa").html("当前,您还未提过任何个人问题!");
					   $("#noLoginMyQa").css("display","block");
			    }	  
			
			    }  
			});
		}	
	}else{
		   $("#frame_int_3").css("display","none");
		   $("#noLoginMyQa").html("您还未登录!登录后方可查看我的问题");
		   $("#noLoginMyQa").css("display","block");
	}
}
function help(){
	$("#noLoginMyQa").css("display","none");
}

function myQA(question){
	var t = $($(question).next()).children().attr("style");
	if(t=="display:none;"){
		$($(question).next()).children().attr("style","display:block;");
	}else{
		$($(question).next()).children().attr("style","display:none;");
	}
}
//对机器人服务评价
//function comment(flag){
//	var a=$('#send_box').find('.evaluate-now');
//	var b=a.find('.dis').find('.step1');
//	if(flag=="1"){
//		QA.showMessage("0","感谢您对机器人此次的评价!");
//		$("#pleased").attr("onclick","comment('3');");
//		b.attr("iscomment","1");
//	}else if(flag=="2"){
//		a.find('.bad').addClass('dis-none');
//		a.find('.dis').removeClass('dis-none');	
//		$("#pleased").attr("onclick","comment('3');");
//		b.attr("iscomment","1");
//		QA.showMessage("0","感谢您对机器人此次的评价!");
//	}else{
//		QA.showMessage("0","谢谢，您已对本次服务做出过评价了!");
//	}
//
//}

function isNullObj(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            return false;
        }
    }
    return true;
}

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
