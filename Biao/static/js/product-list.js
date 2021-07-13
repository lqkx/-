jQuery(document).ready(function($) {
	//pc filter
	var filterLeft  	= $('.filter-nav-left'),
        filterRight 	= $('.filter-nav-right'),
		filterContent   = $('.new-filters .filter-list'),
		filterColumn	= $('.new-filters .filter-list ul li,.filter-list-mobile ul li'),
		quickSelectItem = $('.quick-selected-box ul li'),
		filterDefault   = $('.quick-filter .quick-selected-box button span'),
        filterUsed      = $('.category-products .filters-used ul li');

	//filter显示不全时左右滚动
    setInterval(function(){
        filterLeft.animate({"left":"1.5%",},800).animate({"left":"1.2%",},800);
        filterRight.animate({"right":"1.5%",},800).animate({"right":"1.2%",},800);
    },1000);
    filterLeft.on('click',function () {
        filterContent.animate({scrollLeft:0},800);
    });
    filterRight.on('click',function () {
        filterContent.animate({scrollLeft:800},800);
    });

    //腕表快速筛选
    quickSelectItem.each(function () {
        $(this).click(function () {
            var selectFilerItem = $(this).attr('class');
            filterDefault.html($('.quick-selected-box ul li.'+selectFilerItem+' a').html());
            window.localStorage.setItem(selectFilerItem,'1');
        });

        var selectedFilerItem = $(this).attr('class');
        if(window.localStorage.getItem(selectedFilerItem)){
            filterDefault.html($('.quick-selected-box ul li.'+selectedFilerItem+' a').html());
            window.localStorage.removeItem(selectedFilerItem);
        }
    });

    //filter选择状态和更新特色多选item链接
    filterColumn.each(function () {
		var colAttributeCode = $(this).attr('class'),
            filterColumnItem = $(this).children().find('dt'),
            filterSelectVal  = getUrlParam(colAttributeCode);

		if(colAttributeCode == 'gender'){
            filterColumnItem.each(function () {
                var attributeCodeValue= $(this).attr('data-attribute-value');
                if(filterSelectVal && filterSelectVal == attributeCodeValue){
                    $(this).addClass('selected').addClass('disabled').siblings().addClass('disabled');
                }
            });
        }else{
            var featureUrl = getFeatureUrl(colAttributeCode);
            filterColumnItem.each(function () {
                var attributeCodeValue= $(this).attr('data-attribute-value');
                if(filterSelectVal) {
                    var featureValue = filterSelectVal.split("_");
                    for(var i = 0; i < featureValue.length; i++) {
                        if(featureValue[i] == attributeCodeValue){
                            $(this).addClass('selected').addClass('disabled');
                        }
                    }
                    if(attributeCodeValue==0 || filterSelectVal==0){
                        var featureItemUrl = colAttributeCode + '=' + attributeCodeValue;
                    }else {
                        var featureItemUrl = colAttributeCode + '=' + filterSelectVal + '_' + attributeCodeValue;
                    }
                    $(this).children('a').attr('href', featureUrl + featureItemUrl);
                }
            });

        }
    });

    //更新除了性别以外已选择筛选条件删除链接
    filterUsed.each(function () {
        var featuredVal = $(this).attr('data-attribute-value');
        var filterName  = $(this).attr('data-filter-name');
        var url = window.location.href;
        var url_last = url.split('?')[1];
        if(url_last){
            var removeUrl = '';
            var url_parameter = url_last.split("&");
            for(var i = 0; i < url_parameter.length; i++) {
                var filterSelectVal = url_parameter[i].split("=")[1];
                var featureValue = filterSelectVal.split("_");
                if(featureValue.length > 1){
                    var code = url_parameter[i].split("=")[0];
                    var codeName = '';
                    switch(code)
                    {
                        case 'filtermovement':
                            codeName = '机芯';
                            break;
                        case 'bracelet_colorisbracelet_label':
                            codeName = '表带';
                            break;
                        case 'reference_shape':
                            codeName = '表壳形状';
                            break;
                        case 'reference_size':
                            codeName = '表盘大小';
                            break;
                        case 'reference_dial_color_label':
                            codeName = '表盘颜色';
                            break;
                        case 'feature':
                            codeName = '特色';
                            break;
                    }
                    if(codeName == filterName) {
                        for (var j = 0; j < featureValue.length; j++) {
                            if (featureValue[j] != featuredVal) {
                                removeUrl += featureValue[j] + '_';
                            }
                        }
                        var featureUrl = getFeatureUrl(code);
                        removeUrl = removeUrl.substring(0, removeUrl.length - 1);
                        var removeItemUrl = code +'='+ removeUrl;
                        $(this).children().find('a.btn_remove').attr('href', featureUrl + removeItemUrl);
                    }
                }
            }
        }

    });


    //mobile filter and sort
	$('.mobile-filter-tab').click(function () {
		$(this).toggleClass('open');
		$('.mobile-filter-tab-content').slideToggle();
		$('.mobile-sort-tab-content').hide();
		$('.mobile-sort-tab').removeClass('open');
	});
	$('.mobile-sort-tab').click(function () {
		$(this).toggleClass('open');
		$('.mobile-sort-tab-content').slideToggle();
		$('.mobile-filter-tab-content').hide();
		$('.mobile-filter-tab').removeClass('open');
	});
	$('.narrow-by-list dt').each(function () {
		$(this).click(function () {
			$(this).toggleClass('open');
			$(this).next().slideToggle();
		});
	});

});

//获得URL参数值方法
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//获得去除feature参数后的URL
function getFeatureUrl(code) {
    var url = window.location.href;
    var newUrl = url.split('?')[0]+'?';
    var url_last = url.split('?')[1];
    if(url_last){
        var url_parameter = url.split('?')[1].split("&");
        for(var i = 0; i < url_parameter.length; i++) {
            if(url_parameter[i].split("=")[0]!=code){
                newUrl += url_parameter[i].split("=")[0]+'='+url_parameter[i].split("=")[1]+'&';
            }
        }
    }
    return newUrl;
}
