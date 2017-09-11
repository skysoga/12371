// JavaScript Document
$(function(){
	$(".close-reveal-modal").click(function(e){
		var e = e || window.event;
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
	    }
		$("#TB_overlayBG").css("display","none");
		$(".box-content ").css("display","none");
		$('body').attr("style"," ");
		$('html').removeClass('visible');
	});
	$('#TB_overlayBG').click(function(){
			$("#TB_overlayBG").css("display","none");
			$(".box-content").css("display","none");
			$('body').attr("style"," ");
			$('html').removeClass('visible');
		});
	$('.click-block').each(function(){
		$(this).click(function(e){
		if($(this).parents("div").hasClass("box-content")){
			$(this).parents(".box-content").fadeOut("slow",function(){
				$(this).parents(".box-content").hide();
			});
			var e = e || window.event;
			if(e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			var id = $(this).attr("reveal-model-id");
			$('#'+id).css("display","block");
			$("#TB_overlayBG").css({
				display:"block",height:$(document).height()
			});
			$(".box-content").css({
				left:($("body").width()-$("#"+id).outerWidth())/2-20+"px",
				top:($(window).height()-$(".box-content").height())/2+$(window).scrollTop()+"px"
			});
			$('body').css("overflow","hidden");
			$('html').addClass('visible');
		}else{
			var e = e || window.event;
			if(e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			var id = $(this).attr("reveal-model-id");
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
		}
		})
	})
})