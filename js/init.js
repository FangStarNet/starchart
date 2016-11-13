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

 	// add left line
 	$('.action-panel button.green.fn-left').click(function () {
 		addPoint('l');
 	});

 	// add right line
 	$('.action-panel button.green.fn-right').click(function () {
 		addPoint('r');
 	});

 	// go Demo1
 	$('.start-panel li').click(function () {
 		$('.start-panel').hide();
 		$('.action-panel').show();

 		var mockActions = [{"len":14.2,"dir":"l"},{"len":26.3,"dir":"r"},{"len":111.5,"dir":"l"},{"len":27.5,"dir":"l"},{"len":66.5,"dir":"r"},{"len":38,"dir":"l"},{"len":41.5,"dir":"r"},{"len":185,"dir":"r"},{"len":180,"dir":"r"},{"len":249.5,"dir":"l"},{"len":670,"dir":"r"},{"len":112,"dir":"l"},{"len":33.3,"dir":"l"},{"len":36,"dir":"r"},{"len":91,"dir":"r"},{"len":268.5,"dir":"r"},{"len":579,"dir":"l"},{"len":23,"dir":"l"},{"len":446,"dir":"r"},{"len":348,"dir":"r"},{"len":310,"dir":"r"},{"len":266,"dir":"l"},{"len":29,"dir":"l"},{"len":266,"dir":"r"},{"len":262,"dir":"r"},{"len":255,"dir":"r"},{"len":170,"dir":"l"},{"len":16,"dir":"l"},{"len":189,"dir":"l"},{"len":281,"dir":"l"},{"len":235,"dir":"r"},{"len":118,"dir":"r"},{"len":376,"dir":"r"},{"len":324,"dir":"r"},{"len":67,"dir":"l"},{"len":75,"dir":"l"},{"len":67,"dir":"r"},{"len":336,"dir":"l"},{"len":100,"dir":"r"}];
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

 		StarChart.actions.push({
            'len': parseFloat(len),
            'dir': dir
        });

 		StarChart.redrawChart();
 		$('.action-panel input').val('').focus();
 	};
 })();