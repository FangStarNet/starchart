/*
 * StarChat - 星图（Star Chart）是一套绘图方法论和工具集的统称，可用于精确 
 * 绘制直线型图形的二维轮廓，对于不规则的曲线型图形也能较直观地进行描述并绘制。
 * 目前主要的应用场景是房屋平面户型图的边测边绘.
 *
 * Copyright (C) 2016,  fangstar.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @file init bind event.
 * 
 * @author <a href="mailto:liliyuan@fangstar.net">Liyuan Li</a>
 * @version 0.1.0.0, Nov 12, 2016 
 */

 /**
  * @description 页面初始化非 canvas 事件
  */
 (function () {
 	$('#canvas').outerHeight($(window).height() - $('.action-panel').outerHeight());

 	// go start
 	$('.start-panel button.red').click(function () {
 		$('.start-panel').hide();
 		$('.action-panel').show();

 		StarChart.init();
 	});

 	// redo
 	$('.action-panel button.redo').click(function () {
 		StarChart.redo();
 	});

 	// undo
 	$('.action-panel button.undo').click(function () {
 		StarChart.undo();
 	});

 	// finish
 	$('.action-panel button.finish').click(function () {
 		StarChart.finished();
 	});

 	// add next line
 	$('.action-panel button.green.fn-right').click(function () {
 		addPoint(Tools.getLoR());
 	});

 	// get dir
 	$('.action-panel button.get-lor').click(function () {
 		$(this).text('LoR: ' + Tools.getLoR());
 	});

 	// go Demo1
 	$('.start-panel li').click(function () {
 		$('.start-panel').hide();
 		$('.action-panel').show();

 		// 使用尺子 & 左右
 		var mockActions = [{"len":14.2,"lor":"l"},{"len":26.3,"lor":"r"},{"len":111.5,"lor":"l"},{"len":27.5,"lor":"l"},{"len":66.5,"lor":"r"},{"len":38,"lor":"l"},{"len":41.5,"lor":"r"},{"len":185,"lor":"r"},{"len":180,"lor":"r"},{"len":249.5,"lor":"l"},{"len":670,"lor":"r"},{"len":112,"lor":"l"},{"len":33.3,"lor":"l"},{"len":36,"lor":"r"},{"len":91,"lor":"r"},{"len":268.5,"lor":"r"},{"len":579,"lor":"l"},{"len":23,"lor":"l"},{"len":446,"lor":"r"},{"len":348,"lor":"r"},{"len":310,"lor":"r"},{"len":266,"lor":"l"},{"len":29,"lor":"l"},{"len":266,"lor":"r"},{"len":262,"lor":"r"},{"len":255,"lor":"r"},{"len":170,"lor":"l"},{"len":16,"lor":"l"},{"len":189,"lor":"l"},{"len":281,"lor":"l"},{"len":235,"lor":"r"},{"len":118,"lor":"r"},{"len":376,"lor":"r"},{"len":324,"lor":"r"},{"len":67,"lor":"l"},{"len":75,"lor":"l"},{"len":67,"lor":"r"},{"len":336,"lor":"l"},{"len":100,"lor":"r"}];
 		// 使用上一版数据 & 指南针 [{"len":14.2,"lor":"l","alpha":281},{"len":26.3,"lor":"r","alpha":191},{"len":111.5,"lor":"l","alpha":280},{"len":27.5,"lor":"l","alpha":179},{"len":66.6,"lor":"r","alpha":80},{"len":38,"lor":"l","alpha":187},{"len":41.5,"lor":"r","alpha":110},{"len":185,"lor":"r","alpha":199},{"len":180,"lor":"r","alpha":290},{"len":249.5,"lor":"l","alpha":5},{"len":670,"lor":"r","alpha":278},{"len":112,"lor":"l","alpha":25},{"len":33.3,"lor":"l","alpha":302},{"len":36,"lor":"r","alpha":204},{"len":91,"lor":"r","alpha":301},{"len":268.5,"lor":"r","alpha":42},{"len":579,"lor":"l","alpha":124},{"len":23,"lor":"l","alpha":31},{"len":446,"lor":"r","alpha":295},{"len":348,"lor":"r","alpha":30},{"len":310,"lor":"r","alpha":120},{"len":266,"lor":"l","alpha":211},{"len":29,"lor":"l","alpha":120},{"len":266,"lor":"r","alpha":35},{"len":262,"lor":"r","alpha":123},{"len":255,"lor":"r","alpha":210},{"len":170,"lor":"l","alpha":298},{"len":16,"lor":"l","alpha":205},{"len":189,"lor":"l","alpha":122},{"len":281,"lor":"l","alpha":23},{"len":235,"lor":"r","alpha":309},{"len":118,"lor":"r","alpha":45},{"len":376,"lor":"r","alpha":146},{"len":324,"lor":"r","alpha":230},{"len":67,"lor":"l","alpha":319},{"len":75,"lor":"l","alpha":201},{"len":67,"lor":"r","alpha":118},{"len":336,"lor":"l","alpha":203},{"len":100,"lor":"","alpha":114}]
 		// 使用激光测距仪 & 指南针 [{"len":0.14,"lor":"l","alpha":282},{"len":0.266,"lor":"r","alpha":199},{"len":1.089,"lor":"l","alpha":288},{"len":0.28,"lor":"l","alpha":186},{"len":0.667,"lor":"r","alpha":93},{"len":0.386,"lor":"l","alpha":189},{"len":0.419,"lor":"r","alpha":105},{"len":1.851,"lor":"r","alpha":186},{"len":1.823,"lor":"r","alpha":274},{"len":2.448,"lor":"l","alpha":4},{"len":6.751,"lor":"r","alpha":281},{"len":1.019,"lor":"l","alpha":27},{"len":0.349,"lor":"l","alpha":296},{"len":0.368,"lor":"r","alpha":213},{"len":0.924,"lor":"r","alpha":299},{"len":2.722,"lor":"r","alpha":23},{"len":5.797,"lor":"l","alpha":119},{"len":0.244,"lor":"l","alpha":17},{"len":4.448,"lor":"r","alpha":296},{"len":3.525,"lor":"r","alpha":22},{"len":3.083,"lor":"r","alpha":115},{"len":2.662,"lor":"l","alpha":206},{"len":0.292,"lor":"l","alpha":113},{"len":2.777,"lor":"r","alpha":32},{"len":2.671,"lor":"r","alpha":111},{"len":2.492,"lor":"r","alpha":204},{"len":1.702,"lor":"l","alpha":306},{"len":0.173,"lor":"l","alpha":211},{"len":1.892,"lor":"l","alpha":116},{"len":2.82,"lor":"l","alpha":34},{"len":2.563,"lor":"r","alpha":327},{"len":1.071,"lor":"r","alpha":45},{"len":3.975,"lor":"r","alpha":123},{"len":3.257,"lor":"r","alpha":218},{"len":0.607,"lor":"l","alpha":282},{"len":0.633,"lor":"l","alpha":207},{"len":0.682,"lor":"r","alpha":117},{"len":3.334,"lor":"l","alpha":193},{"len":1.148,"lor":"r","alpha":109}];
 		StarChart.init();

 		for (var i = 0, j = 0; i < mockActions.length; i++) {
 			setTimeout(function () {
 				$('.action-panel input').val(mockActions[j].len);
 				if (mockActions[j].dir === 'l') {
 					$('.action-panel button.green.fn-left').addClass('active');
 					setTimeout(function () {
 						$('.action-panel button.green.fn-left').removeClass('active');
 					}, 500);
 				} else {
 					$('.action-panel button.green.fn-right').addClass('active');
 					setTimeout(function () {
 						$('.action-panel button.green.fn-right').removeClass('active');
 					}, 500);
 				}
 				StarChart.actions.push(mockActions[j++]);
 				StarChart.redrawChart();
 			}, 700 * i);
 			
 		};
 	});

 	var addPoint = function (dir) {
 		var len = $.trim($('.action-panel input').val());
 		if (!/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(len)) {
 			alert('请输入正确的长度');
 			return false;
 		}

 		if (StarChart.actions.length > 0) {
	 		StarChart.actions[StarChart.actions.length - 1].lor = dir;
 		}

 		StarChart.actions.push({
            'len': parseFloat(len),
            'lor': "",
            'alpha': Tools.lastAlpha
        });

 		StarChart.redrawChart();
 		$('.action-panel input').val('').focus();
 	};
 })();