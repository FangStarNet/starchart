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

 	// get dir
 	$('.action-panel button.get-lor').click(function () {
 		$(this).text('LoR: ' + Tools.getLoR());
 	});

 	// go Demo1
 	$('.start-panel li').click(function () {
 		$('.start-panel').hide();
 		$('.action-panel').show();

 		var mockActions = [{"len":14.2,"lor":"l"},{"len":26.3,"lor":"r"},{"len":111.5,"lor":"l"},{"len":27.5,"lor":"l"},{"len":66.5,"lor":"r"},{"len":38,"lor":"l"},{"len":41.5,"lor":"r"},{"len":185,"lor":"r"},{"len":180,"lor":"r"},{"len":249.5,"lor":"l"},{"len":670,"lor":"r"},{"len":112,"lor":"l"},{"len":33.3,"lor":"l"},{"len":36,"lor":"r"},{"len":91,"lor":"r"},{"len":268.5,"lor":"r"},{"len":579,"lor":"l"},{"len":23,"lor":"l"},{"len":446,"lor":"r"},{"len":348,"lor":"r"},{"len":310,"lor":"r"},{"len":266,"lor":"l"},{"len":29,"lor":"l"},{"len":266,"lor":"r"},{"len":262,"lor":"r"},{"len":255,"lor":"r"},{"len":170,"lor":"l"},{"len":16,"lor":"l"},{"len":189,"lor":"l"},{"len":281,"lor":"l"},{"len":235,"lor":"r"},{"len":118,"lor":"r"},{"len":376,"lor":"r"},{"len":324,"lor":"r"},{"len":67,"lor":"l"},{"len":75,"lor":"l"},{"len":67,"lor":"r"},{"len":336,"lor":"l"},{"len":100,"lor":"r"}];
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
            'dir': dir,
            'alpha': Tools.lastAlpha
        });

 		StarChart.redrawChart();
 		$('.action-panel input').val('').focus();
 	};
 })();