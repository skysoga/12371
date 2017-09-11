<%@ page language="java" contentType="text/html;charset=UTF-8"%><%@ include file="/fpd/global.inc.jsp" %><%@ include file="../include/global.inc.jsp" %><%
	String caId = null;
	String siteId = null;
	Vo vo = new VoImpl();
	Vo article = vo;
	Vo catalog = vo;
	Vo parentCatalog = vo;
	Vo website = vo;
	List<? extends Vo> voList = null;
	List<? extends Vo> articleList = null;
	List<? extends Vo> catalogList = null;
	int currentPage = Utils.getInt(request, "page", 1);
	boolean isStatic = "static".equals(request.getParameter("preview"));
	boolean isEmbeded = "true".equals(request.getParameter("embeded"));
	if (request.getParameter("_skin") != null) { skin = request.getParameter("_skin"); skin = isEmpty(skin) ? "" : skin; }
	Pagination curPage = new Pagination();
	curPage.setPageSize(20);
	Vo originalCatalog = vo;
	FpdTypeData ftd = null;
	long timeTmp = System.currentTimeMillis();
	caId = request.getParameter("caId");
	String pageUrl = null;
	siteId = request.getParameter("siteId");
	Map<String,String> homeCatalogAliases = catalogService.getCatalogIndexAliases(caId);
	if(caId != null && caId.trim().length()>0){
		catalog = catalogService.getCatalogById(caId);
		if(catalog == null) {
			request.setAttribute("msg", "栏目不存在！");
			response.setStatus(404);
		}else{
			parentCatalog=catalogService.getCatalogById((String)catalog.get("caPid"));
			siteId = catalog.get("siteId");
			website = catalog.get("site");
			String linkUrl = catalog.get("originLink");
			pageUrl = linkUrl.replace(".htm", "_$0.htm");
		}
	}else{
		if(isStatic){
			catalog = vo;
			parentCatalog = vo;
			website = vo;
		}else{
			if(siteId != null){
				website = siteService.getSiteById(siteId);
			}
			if(website == null){
				request.setAttribute("msg", "站点不存在！");
				response.setStatus(404);
				return;
			}
		}
	}
	vo = article;
	Vo currArticle = article;
	Vo currCatalog = catalog;
	Vo site = website;
	Vo homeCatalog = (Vo)catalogService.getHomeCatalogByCaId(caId);
	if( homeCatalog == null ){ homeCatalog = new VoImpl(); }
%><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:cms>
<head>

<link id="cms_sys_link0" href="<%=contextPath+"/"%>fpd/global.css" rel="stylesheet" type="text/css"/>
<link id="cms_sys_link1" href="<%=contextPath+"/"%>fpd/data_module.css" rel="stylesheet" type="text/css"/>
<meta charset="UTF-8" />
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" >
<title>智能服务平台</title>
<link href="<%=basePath%>style/layout.css" rel="stylesheet" type="text/css" />
<link href="<%=basePath%>style/inteligence.css" rel="stylesheet" type="text/css" />
<script src="<%=basePath%>javascript/tab.exam.js" type="text/javascript"></script>
<script src="<%=basePath%>javascript/jquery-1.6.2.min.js" type="text/javascript"></script>
<script src="<%=basePath%>javascript/inteligence.js" type="text/javascript"></script>
<script type="text/javascript" >
function openMore() {
	window.location.href = 'search.jsp?sm=1';
}
function query(type) {
	if("限用100字简要描述您的问题，比如“申请办理结婚证的流程”"==$("#q").val()){
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
</script>
<style type="text/css" id="cms_sys_height">
#data_subnav{min-height:30px;_height:30px}
#mod_int .modcon{min-height:423px;_height:423px}
</style>
<script id="cms_sys_jscfg">var Cfg={ path:'<%=contextPath+"/"%>', baseDomains:'<%=baseDomains%>', contextPath:'<%=contextPath%>', basePath:'<%=basePath%>' }</script>
<script id="cms_sys_jstpl" src="<%=contextPath+"/"%>fpd/tpl.js"></script>
<script cms_sys_module="true" src="<%=contextPath+"/"%>fpd/module/js/jquery/jquery.js"></script>
<script cms_sys_module="true" src="<%=contextPath+"/"%>fpd/module/js/module.js"></script>
</head>
<body>
<div id="layout" class="wrapper">
	<div id="frame_1" class="cmspage clearfix">
		<div id="frame_header" class="header">
			<div id="data_wap_logo" class="row wap_logo">
				
				        	<img src="<%=basePath%>images/inteligence_logo.png">
				        
			</div>
		</div>	
		<div id="frame_main" class="main row">
			<div id="frame_content" class="content">
				<div id="frame_content_wrapper" class="content_wrapper clearfix">
					<div id="frame_chat_wrapper" class="chat_wrapper">
						<div id="data_chat_wrapper" class="max_height">
							
							                        <div class="talk_box" id="talk_box">
							                            <!--robot--> 
							                            <div class="talk_robot clearfix" id="talk_robot"> 
							                                <div class="photo_box"><p class="bg"><img src="<%=basePath%>images/inteligence_robot.gif"></p><p class="name">机器人</p></div>
							                                <div class="robot_box  clearfix">
							                                    <div class="robot">
							                                  
							                                 <div class="middle">
							                                    <div class="talk_con">
							                                    <ul>
							                                        <li>您好，我是“福建闽侯”政府门户网站智能机器人!<!--<span class="yellow">我还在成长中，但会很努力地做好每一次服务，</span>请问有什么可以帮助到您呢？ --></li>
							                                     
							                                    </ul>
							                                    <p class="desc">为了更好地解决您的问题，请输入简洁完整的语句，如：“办理结婚”</p>
							                                    </div>
							                                 </div>
							                                 
							                                 </div>
							                                 <div class="date">2014-02-18 15:07:51</div>
							                                 </div>         	
							                            </div>
							                             <!--visitor--> 
							                            <div class="talk_visitor clearfix" id="talk_visitor" style="display: none;"> 
							                                <div class="photo_box"><p class="bg"><img src="<%=basePath%>images/inteligence_me.gif"></p><p class="name">我</p></div>
							                                <div class="visitor_box  clearfix">
							                                    <div class="visitor">
							                                     <div class="middle">
							                                        <div class="talk_con">
							                                        <ul>
							                                            <li>申请办理结婚证的流程</li>
							                                        </ul>
							                                        </div>
							                                     </div>
							                                     </div>
							                                     <div class="date">2014-02-18 15:07:51</div>
							                                 </div>         	
							                            </div>
							                             <!--robot--> 
							                            <div class="talk_robot clearfix" id="robot_answer" style="display: none;"> 
							                                <div class="photo_box"><p class="bg"><img src="<%=basePath%>images/inteligence_robot.gif"></p><p class="name">机器人</p></div>
							                                <div class="robot_box  clearfix">
							                                    <div class="robot">
							                                     <div class="middle">
							                                        <div class="talk_con">
							                                        <ul>
							                                            <li>您好，我们在智能知识库中为您寻找到 1 条相关的信息：</li>
							                                            <li><strong>·标题：关于申请办理结婚证的流程？</strong></li>
							                                            <li>1、免费婚检在区妇幼，地址达道路市一医院旁，房管局门口；</li>
							                                            <li>2、在区市民中心民政窗口办理结婚登记，带双方身份证、户口本，结婚照3张即可。地址：晋安区区委大楼4层<span class="yellow detail"><a href="#">[详细]</a></span></li>
							                                         </ul>
							                                          <p class="choose">以上信息是否对您有帮助？<strong class="yellow detail"><a href="#">有帮助 </a></strong><strong class="yellow detail"><a href="#">无帮助 </a></strong></p>
							                                            <p>如果上述回答没能解决您的问题，您可以试着点击以下问题：</p>
							                                            <p><a href="#">？关于申请办理结婚证的流程？</a><span class="gray">（2013-8-6）</span></p>         
							                                        
							                                        </div>
							                                     </div>
							                                     </div>
							                                     <div class="date">2014-02-18 15:07:51</div>
							                                </div>         	
							                            </div>
							                             <!--visitor--> 
							                            <div class="talk_visitor clearfix" style="display: none;"> 
							                                <div class="photo_box"><p class="bg"><img src="<%=basePath%>images/inteligence_me.gif"></p><p class="name">我</p></div>
							                                <div class="visitor_box  clearfix">
							                                    <div class="visitor">
							                                     <div class="middle">
							                                        <div class="talk_con">
							                                        		天气预报
							                                        </div>
							                                     </div>
							                                     </div>
							                                     <div class="date">2014-02-18 15:07:51</div>
							                                </div>         	
							                            </div>
							                             <!--robot--> 
							                            <div class="talk_robot clearfix" style="display: none;"> 
							                                <div class="photo_box"><p class="bg"><img src="<%=basePath%>images/inteligence_robot.gif"></p><p class="name">机器人</p></div>
							                                <div class="robot_box  clearfix">
							                                    <div class="robot">
							                                     <div class="middle">
							                                        <div class="talk_con" id="weather_block">    
							                                            <div class="weather_wrapper">
							                                                <div class="today">
							                                                    <div class="time_info">
							                                                        <span class="city" id="cityName">福州</span>
							                                                        <span class="date" id="date">周日 09月28日 （实时：27℃）</span>
							                                                    </div>
							                                                    <div class="weather_info">
							                                                        <span class="icon"><img id="weather_icon" src="<%=basePath%>images/weather/day/01.png"></span>
							                                                        <span class="temperature" id="weather_temp">34 ~ 25℃</span>
							                                                        <span class="weather" id="weather">多云</span>
							                                                        <span class="wind" id="weather_wind">微风</span>
							                                                        <span class="air" id="pm25">空气质量： 71 良</span>
							                                                    </div>
							                                                </div>
							                                                <div class="future">
							                                                    <ul class="clearfix">
							                                                        <li>
							                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
							                                                              <tbody><tr>
							                                                                <td><span class="data" id="date_1">周一</span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="icon"><img id="weather_icon_1" src="<%=basePath%>images/weather/day/01.png"></span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="weather" id="weather_1">多云</span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="temperature" id="weather_temp_1">34 ~ 25℃</span></td>
							                                                              </tr>
							                                                            </tbody></table>
							                                                        </li>
							                                                        <li>
							                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
							                                                              <tbody><tr>
							                                                                <td><span class="data" id="date_2">周二</span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="icon"><img id="weather_icon_2" src="<%=basePath%>images/weather/day/01.png"></span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="weather" id="weather_2">阵雨</span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="temperature" id="weather_temp_2">34 ~ 25℃</span></td>
							                                                              </tr>
							                                                            </tbody></table>
							                                                        </li>
							                                                        <li>
							                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
							                                                              <tbody><tr>
							                                                                <td><span class="data" id="date_3">周三</span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="icon"><img id="weather_icon_3" src="<%=basePath%>images/weather/day/03.png"></span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="weather" id="weather_3">阵雨</span></td>
							                                                              </tr>
							                                                              <tr>
							                                                                <td><span class="temperature" id="weather_temp_3">34 ~ 25℃</span></td>
							                                                              </tr>
							                                                            </tbody></table>
							                                                        </li>
							                                                    </ul>
							                                                </div>
							                                                <div class="more_info">
							                                                    <a class="more_btn" id="moreBtnUp" style="display: block;" onclick="QA.toggleWeatherDetail(this)" infoid="weather_detail" targetid="moreBtnDown">查看今天详细数据<i class="arrow_down" id="arrow_down"></i></a>
							                                                    <div class="detail" id="weather_detail" style="display: none;" show="false">
							                                                        <ul class="small-block-grid-1 medium-block-grid-2 large-block-grid-2">
							                                                            <li id="tit_block">
							                                                                <div class="tit" id="tit_title">穿衣指数：炎热</div>
							                                                                <p id="tit_detail">天气炎热，建议着短衫、短裙、短裤、薄型T恤衫等清凉夏季服装。</p>
							                                                            </li>
							                                                            <li>
							                                                                <div class="tit">洗车指数：较适宜</div>
							                                                                <p>较适宜洗车，未来一天无雨，风力较小，擦洗一新的汽车至少能保持一天。</p>
							                                                            </li>
							                                                            <li>
							                                                                <div class="tit">旅游指数：较适宜</div>
							                                                                <p>天气较好，温度较高，天气较热，但有微风相伴，还是比较适宜旅游的，不过外出时要注意防暑防晒哦！</p>
							                                                            </li>
							                                                            <li>
							                                                                <div class="tit">感冒指数：少发</div>
							                                                                <p>各项气象条件适宜，发生感冒机率较低。但请避免长期处于空调房间中，以防感冒。</p>
							                                                            </li>
							                                                            <li>
							                                                                <div class="tit">运动指数：较适宜</div>
							                                                                <p>天气较好，户外运动请注意防晒，推荐您在室内进行低强度运动。</p>
							                                                            </li>
							                                                            <li>
							                                                                <div class="tit">紫外线强度：中等</div>
							                                                                <p>属中等强度紫外线辐射天气，外出时建议涂擦SPF高于15、PA+的防晒护肤品，戴帽子、太阳镜。</p>
							                                                            </li>
							                                                        </ul>
							                                                    </div>
							                                                    <a class="more_btn" id="moreBtnDown" style="display: none;" onclick="QA.toggleWeatherDetail(this)" infoid="weather_detail" targetid="moreBtnUp"><i class="arrow_up" id="arrow_up"></i></a>
							                                                </div>
							                                            </div>                            
							                                        </div>
							                                     </div>
							                                     </div>
							                                     <div class="date">2014-02-18 15:07:51</div>
							                                </div>         	
							                            </div>
							                        </div> 	
							                        <div class="send_box">
							                            <div class="send_line clearfix">
							                            	<input name="historyObject" id="historyObject" type="hidden" value="">
							                                <div class="send">
							                                  <textarea name="text-in" id="q" onkeydown="query(1);" onfocus="if(value=='限用100字简要描述您的问题，比如“申请办理结婚证的流程”') {value='';this.style.color='#666'}else{this.style.color='#666'};" onblur="if(value=='') {value='限用100字简要描述您的问题，比如“申请办理结婚证的流程”';this.style.color='#888';}else{this.style.color='#666'}" maxlength="150" value="限用100字简要描述您的问题，比如“申请办理结婚证的流程”">限用100字简要描述您的问题，比如“申请办理结婚证的流程”</textarea>
							                                </div>
							                                <span class="send_btn"><input onclick="query();" type="button" value="发送"></span>
							                            </div> 
							                        </div>
							                    
						</div>
					</div>				
					<div id="frame_side_info" class="side_info hidden-for-small">
						<div id="mod_int" class="int clearfix" tabid="int"><div class="tab clearfix">	<ul id="int" class="clearfix">		<li class="on" onclick="CmsTpl.over_tab(this);return false;"><div class="tl"><div class="tr"><div class="tc" <%timeTmp = System.currentTimeMillis();%><%  FpdTypeData fpd_1411991046062 = fpdTypeHelper.getFpdTypeData("list", "specificCaId"); DataWrapper dw_1411991046062 = fpd_1411991046062.getData(2, 25, "CA20110726308328", "", "false"); Vo catalog_1411991046062 = dw_1411991046062.getChannel();%><%="data_time=\"读取列表耗时："+(System.currentTimeMillis()-timeTmp)+"毫秒	开始时间："+timeTmp+"\""%>dataId="data_int_11"><a href="#" target="_blank">智能知识库</a></div></div></div></li>		<li onclick="CmsTpl.over_tab(this);return false;"><div class="tl"><div class="tr tr1"><div class="tc"><a href="#" target="_blank">帮助系统</a></div></div></div></li>	</ul></div><div id="int-page" class="modcon clearfix">
								<div id="frame_int_1" class="clearfix">
									<div id="data_int_11">
										<%
	out.print("<!-- 指定栏目start -->");
	timeTmp = System.currentTimeMillis();
	voList = dw_1411991046062.getList();
	catalog = catalog_1411991046062;
%>
										
										                              <div class="clearfix">
										                                <p class="desc">网站利用知识库技术，梳理、归纳互动交流常见问题以及公众关注的其他问题，整合区各部门、街道、社区的相关知识。公众提交问题时，系统会即时提示知识库中相同或者相近的问题，</p>
										                                <div class="znfw_r clearfix">
										                                  <ul id="serivce_search">
										                                      <%
	if( voList != null && !voList.isEmpty() ){
		Vo _itmpCatalog = catalog_1411991046062;
		int voLen = voList.size();
		for(int _i=0; _i<voLen; _i++){
			vo=voList.get(_i);
			if(vo != null){
				catalog = vo;
%> <li><a url="?catalogId=<%=(vo != null ? vo.get("caId") : null)%>"  title="<%=PageViewUtil.filter((vo != null ? vo.get("title") : null), "attr")%>" herf="javascript:void(0);"><%=PageViewUtil.truncate(PageViewUtil.filter((vo != null ? vo.get("title") : null), "attr"),10, null)%></a></li><%
			}
		}
		catalog = _itmpCatalog;
	}
%>
										                                    <!--<li><a href="#">教育领域</a></li>
										                                    <li><a href="#">就业领域</a></li>
										                                    <li><a href="#">社保领域</a></li>
										                                    <li><a href="#">交通领域</a></li>
										                                    <li><a href="#">证件办理</a></li>
										                                    <li><a href="#">住房领域</a></li>
										                                    <li><a href="#">交通领域</a></li>
										                                    <li><a href="#">证件办理</a></li>
										                                    <li><a href="#">资质认定</a></li>
										                                    <li><a href="#">婚育收养</a></li>
										                                    <li><a href="#">公共事业</a></li>
										                                    <li><a href="#">招商引资</a></li>
										                                    <li><a href="#">健康领域</a></li>
										                                    <li><a href="#">企业开设</a></li>
										                                    <li><a href="#">企业经营</a></li>
										                                    <li><a href="#">其它</a></li>-->
										                                  </ul>
										                                </div>
										                              </div>
										<script>
										    CmsTpl.require('moduleJs');
										    jQuery('#serivce_search a').click(function(){
										        jQuery('#data_int_12').empty().include(jQuery(this).attr('url'), 'search_content');
										    });
										</script>
										<%
	voList = null;
	catalog_1411991046062 = null;
	fpd_1411991046062 = null;
	catalog = currCatalog;
	out.print("<!-- 本块耗时："+(System.currentTimeMillis()-timeTmp)+"毫秒	结束时间："+timeTmp+" -->");
%><%out.print("<!-- 指定栏目end -->");%>
									</div>								
									<div id="data_int_12">
										<%
	out.print("<!-- 搜索结果start -->");
	timeTmp = System.currentTimeMillis();
 FpdTypeData fpd_1411991046359 = fpdTypeHelper.getFpdTypeData("list", "webSearch"); DataWrapper dw_1411991046359 = fpd_1411991046359.getData(0, 5, "pubDynArticle", "", "", "*:*", "S_domain:"+String.valueOf(param.get("catalogId")), "pubDate:desc", "id,title,pubDate");
	Vo catalog_1411991046359 = dw_1411991046359.getChannel();	voList = dw_1411991046359.getList();
	catalog = catalog_1411991046359;
	out.print("<!-- 读取列表耗时："+(System.currentTimeMillis()-timeTmp)+"毫秒	开始时间："+timeTmp+" -->");
%>
										
										                              <div class="infolist clearfix" id="search_content">
										                                  <ul class="auto_list">
										                                      <%
	if( voList != null && !voList.isEmpty() ){
		Vo _itmpCatalog = catalog_1411991046359;
		int voLen = voList.size();
		for(int _i=0; _i<voLen; _i++){
			vo=voList.get(_i);
			if(vo != null){
				catalog = catalog_1411991046359;
				article = vo;
%><li><span class="time">[<%=PageViewUtil.dateFormat((vo != null ? vo.get("pubDate") : null), "yyyy-MM")%>]</span><span class="title"><a title="<%=PageViewUtil.filter((vo != null ? vo.get("title") : null), "attr")%>" href="<%=(vo != null ? vo.get("link") : null)%>"><%=PageViewUtil.filter((vo != null ? vo.get("title") : null), "attr")%></a></span></li><%
			}
		}
		catalog = _itmpCatalog;
	}
%>
										                                    <!--<li><span class="time">[09-27]</span><span class="title"><a href="#">网站利用知识库技术，梳理、归纳互动交流常</a></span></li>
										                                    <li><span class="time">[09-27]</span><span class="title"><a href="#">网站利用知识库技术，梳理、归纳互动交流常</a></span></li>
										                                    <li><span class="time">[09-27]</span><span class="title"><a href="#">网站利用知识库技术，梳理、归纳互动交流常</a></span></li>
										                                    <li><span class="time">[09-27]</span><span class="title"><a href="#">网站利用知识库技术，梳理、归纳互动交流常</a></span></li>
										                                    <li><span class="time">[09-27]</span><span class="title"><a href="#">网站利用知识库技术，梳理、归纳互动交流常</a></span></li>-->
										                                  </ul>
										                                  <a class="right" href="wSearch.sp?act=scSearch&domain=<%=(param != null ? param.get("catalogId") : null)%>" target="_blank">查看更多&gt;&gt;</a>
										                            </div>
										                            
										<%
	voList = null;
	catalog_1411991046359 = null;
	fpd_1411991046359 = null;
	catalog = currCatalog;
	out.print("<!-- 本块耗时："+(System.currentTimeMillis()-timeTmp)+"毫秒	结束时间："+timeTmp+" -->");
%><%out.print("<!-- 搜索结果end -->");%>
									</div>
								</div>							
								<div id="frame_int_2" style="display:none;" >
									<div id="data_int_22">
										
										                              <div class="clearfix">
										                              <p class="desc">网站利用知识库技术，梳理、归纳互动交流常见问题以及公众关注的其他问题，整合区各部门、街道、社区的相关知识。公众提交问题时，系统会即时提示知识库中相同或者相近的问题，</p>
										                              </div>
										                            
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>	
		<div id="frame_footer" class="footer">
			<div id="data_subnav" style="height:30px;" class="subnav">
				
				            <script type="text/javascript">
				            function SetHome(obj){
				                try{
				                    obj.style.behavior='url(#default#homepage)';
				                    obj.setHomePage(window.location.href);                               
				                }catch(e){
				                    if(window.netscape){
				                        try{
				                            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				                        }catch(e){
				                            alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
				                        };
				                    }else{
				                        alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将'"+window.location.href+"'设置为首页。");
				                    };
				                };
				            }
				            </script>
				            <a href="/ar/20111110510498.htm" target="_blank">联系我们</a> | <a href="/ar/20111110195100.htm" target="_blank">使用帮助</a> | <a style="BEHAVIOR: url(#default#homepage);" onclick="SetHome(this)" href="javascript:void(0);">设为主页</a> | <a href="javascript:window.external.AddFavorite(window.location.href,'福建闽侯')" target="_self">加入收藏</a> | <a href="/ar/20111110876961.htm" target="_blank">RSS订阅服务</a> | <a href="/interact/writemail.htm?category=00000020&amp;mt=ldm" target="_blank">网站建议</a>
				        
			</div>		
			<div id="data_coyyright" class="copyright">
				版权所有 Copyright &copy; 2004-2014 闽侯县人民政府办公室<br>技术支持：闽侯县数字闽侯建设办公室<br>闽ICP备案12018076号-1
			</div>
		</div>
	</div>

</div>

<script type="text/javascript">
	</script> 

</body></html>