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
 * @file Star Chart Draw.
 * 
 * @author <a href="mailto:liliyuan@fangstar.net">Liyuan Li</a>
 * @version 0.2.0.1, Nov 19, 2016 
 */

var StarChart = {
    // every path data
    paths: [],
    // Paper.js Scope Global
    paper: undefined,
    // record every action data
    actions: [],
    // record undo data
    undoActions: [],
    pathStack: [],
    allPaths: [],
    /**
     * init canvas & paths
     */
    init: function () {
        // Get a reference to the canvas object
        var canvas = document.getElementById('canvas');
        // Create an empty project and a view for the canvas:
        paper.setup(canvas);
        this.paper = paper;

        // New Path
        var firstPath = new paper.Path({
            center: paper.view.center
        });
        // Give the stroke a color
        firstPath.strokeColor = '#999';

        this.paths.push({
            path: firstPath,
            point: {
                x: 0,
                y: 0
            },
            dir: 4 // 1 (x, 0); 2 (0, y); 3 (-x, 0); 4 (0, -y)
        });
    },
    /**
     * 根据上一条线的长度和方向获取当前坐标
     * @param {object} prevPoint 上一个坐标点
     * @param {int} prevDir 上一个方向： 1 (x, 0); 2 (0, y); 3 (-x, 0); 4 (0, -y).
     * @param {decimal} len line length.
     * @param {string} lor [l: left; r: right].
     * @returns {object} 新坐标
     */
    getNewPoint: function (prevPoint, prevDir, len, lor) {
        var newPoint = {},
                newDir = 0;

        switch (prevDir) {
            case 1:
                newPoint.x = prevPoint.x + len;
                newPoint.y = prevPoint.y;

                newDir = lor === 'l' ? 4 : 2;
                break;
            case 2:
                newPoint.x = prevPoint.x;
                newPoint.y = prevPoint.y + len;

                newDir = lor === 'l' ? 1 : 3;
                break;
            case 3:
                newPoint.x = prevPoint.x - len;
                newPoint.y = prevPoint.y;

                newDir = lor === 'l' ? 2 : 4;
                break;
            case 4:
                newPoint.x = prevPoint.x;
                newPoint.y = prevPoint.y - len;

                newDir = lor === 'l' ? 3 : 1;
                break;
            default:
                console.log('no this direction');
        }

        return {
            point: newPoint,
            dir: newDir
        };
    },
    /**
     * add point to path
     * @param {object} pathObj it's paper.Path, add point to this.
     * @param {decimal} len line length.
     * @param {string} dir direction [l: left; r: right].
     */
    addPoint: function (pathObj, len, lor) {
        var data = this.getNewPoint(pathObj.point, pathObj.dir, len, lor);

        // draw
        pathObj.path.add(new paper.Point(data.point.x, data.point.y));
        // update current point and dir to module data
        pathObj.point = data.point;
        pathObj.dir = data.dir;
    },
    /**
     * 重新绘制整个图形
     */
    redrawChart: function () {
        var pathObj = StarChart.paths[0];

        // clear path
        pathObj.path.removeSegments();

        // add origin point
        pathObj.path.add(new paper.Point(0, 0));

        pathObj.point = {
            x: 0,
            y: 0
        };
        pathObj.dir = 4;

        // add every point
        for (var ii = StarChart.actions.length, i = 0; i < ii; i++) {
            var action = StarChart.actions[i];
            StarChart.addPoint(pathObj, action.len, action.lor);
        };
        pathObj.area = this.paths[0].path.area;

        // fit canvas
        pathObj.path.fitBounds(paper.view.bounds);

        // 操作按钮控制
        this._actionBtn();
    },
    /**
     * 根据当前数据模型，控制按钮的展现与否
     */
    _actionBtn: function () {
        if(StarChart.actions.length === 0) {
            $('button.finish, button.undo, button.reverse').hide();
        } else if (StarChart.actions.length === 1) {
            $('button.finish, button.undo').show();
            $('button.reverse').hide();
        } else {
            $('button.finish, button.undo, button.reverse').show();
        }
    },
    /**
     * 恢复撤销的操作
     */
    redo: function () {
        if (this.undoActions.length < 1) {
            return false;
        }

        var redoAction = this.undoActions.splice(this.undoActions.length - 1, 1);
        this.actions.push(redoAction[0]);

        this.redrawChart();
    },
    /**
     * 撤销上一步操作
     */
    undo: function () {
        if (this.actions.length < 1) {
            return false;
        }

        var undoAction = this.actions.splice(this.actions.length - 1, 1);
        this.undoActions.push(undoAction[0]);

        this.redrawChart();
    },
    /**
     * 完成户型图的绘制
     */
    finished: function () {
        $('textarea').text(JSON.stringify(this.actions));
        console.log(JSON.stringify(this.actions));
        alert('该户型套内面积为：' + Math.abs(this.paths[0].area) + '平方米');
    },
    copy: function (array) {
        var str = JSON.stringify(array);

        return JSON.parse(str);
    },
    genAllPath: function (segments, paths) {
        for (var ii = segments.length, i = 0; i < ii; i++) {
            for (var j = 0, jj = paths.length; j < jj; j++) {
                var deepPath = StarChart.copy(paths[j]);
                paths[j].push({
                    'len': segments[i].len,
                    'lor': 'l'
                });

                deepPath.push({
                    'len': segments[i].len,
                    'lor': 'r'
                });
                paths.push(deepPath);
            }
            ;
            if (paths.length === 0) {
                paths.push([
                    {
                        'len': segments[i].len,
                        'lor': 'l'
                    }]);
                paths.push([
                    {
                        'len': segments[i].len,
                        'lor': 'r'
                    }]);
            }
            segments.splice(0, 1);
            return StarChart.genAllPath(segments, paths);
        }
        ;
        return paths;
    },
    genPaths: function (lor, segments) {
        this.pathStack.push({
            'len': segments.shift(),
            'lor': lor
        });

        if (segments.length === 0) {
            this.allPaths.push(StarChart.copy(this.pathStack));

            this.pathStack.pop();

            return false;
        }

        this.genPaths('l', segments);

        this.genPaths('r', segments);

        this.pathStack.pop();
    },
    getPointsByPath: function (path) {
        var prevObj = {
            dir: 4,
            point: {
                x: 0,
                y: 0
            }},
                points = [{
                        x: 0,
                        y: 0
                    }];

        for (var jj = path.length, j = 0; j < jj; j++) {
            var data = this.getNewPoint(prevObj.point, prevObj.dir, path[j].len, path[j].lor)
            prevObj.point = data.point;
            prevObj.dir = data.dir;
            points.push(data.point);
        }

        return points;
    },
    isInstersect: function (path) {
        var points = this.getPointsByPath(path);
        return this.lineCrossLine(points);
    },
    lineCrossLine: function (points) {
        var paperPath1 = new this.paper.Path(),
                paperPath2 = new this.paper.Path();

        paperPath1.removeSegments();
        paperPath1.add(new this.paper.Point(points[points.length - 1].x, points[points.length - 1].y),
                new this.paper.Point(points[points.length - 2].x, points[points.length - 2].y));
        for (var i = points.length - 1; i >= 4; i--) {
            paperPath2.removeSegments();
            paperPath2.add(new this.paper.Point(points[i - 3].x, points[i - 3].y), new this.paper.Point(points[i - 4].x, points[i - 4].y))

            if (paperPath1.getIntersections(paperPath2).length > 0) {
                return true;
            }
        }

        points.pop();

        if (points.length < 2) {
            return false;
        }

        return StarChart.lineCrossLine(points);
    },
    _removeOverDis: function (path) {
        var points = this.getPointsByPath(path);
        // remove |star point - end point| > 500
        var paperPath = new this.paper.Path();
        paperPath.add(new this.paper.Point(points[points.length - 1].x, points[points.length - 1].y),
                new this.paper.Point(points[0].x, points[0].y));
        var len = paperPath.getLength();

        paperPath.removeSegments();
        if (len > 200 || len < 196) {
            return true;
        }
        return false;
    },
    removeSegments: function () {
        var mockData = [{"len": 14.2, "lor": "l"}, {"len": 26.3, "lor": "r"}, {"len": 111.5, "lor": "l"}, {"len": 27.5, "lor": "l"}, {"len": 66.5, "lor": "r"}, {"len": 38, "lor": "l"}, {"len": 41.5, "lor": "r"}, {"len": 185, "lor": "r"}, {"len": 180, "lor": "r"}, {"len": 249.5, "lor": "l"}, {"len": 670, "lor": "r"}, {"len": 112, "lor": "l"}, {"len": 33.3, "lor": "l"}, {"len": 36, "lor": "r"}, {"len": 91, "lor": "r"}, {"len": 268.5, "lor": "r"}, {"len": 579, "lor": "l"}, {"len": 23, "lor": "l"}, {"len": 446, "lor": "r"}, {"len": 348, "lor": "r"}, {"len": 310, "lor": "r"}, {"len": 266, "lor": "l"}, {"len": 29, "lor": "l"}, {"len": 266, "lor": "r"}, {"len": 262, "lor": "r"}, {"len": 255, "lor": "r"}, {"len": 170, "lor": "l"}, {"len": 16, "lor": "l"}, {"len": 189, "lor": "l"}, {"len": 281, "lor": "l"}, {"len": 235, "lor": "r"}, {"len": 118, "lor": "r"}, {"len": 376, "lor": "r"}, {"len": 324, "lor": "r"}, {"len": 67, "lor": "l"}, {"len": 75, "lor": "l"}, {"len": 67, "lor": "r"}, {"len": 336, "lor": "l"}, {"len": 100, "lor": "r"}];
        mockData.splice(10, 29);
        allPath = StarChart.genAllPath(mockData, []);

        for (var i = allPath.length - 1; i >= 0; i--) {
            if (StarChart._removeOverDis(allPath[i])) {
                allPath.splice(i, 1);
                continue;
            }

            // remove instersect
            if (StarChart.isInstersect(allPath[i])) {
                allPath.splice(i, 1);
            }
        }
    },
    /**
     * 添加一面墙
     * @param {float} len 墙的长度
     */
    addWall: function (len) {
        // 数据正确性校验
        var curLoR = Tools.getLoR();

        if (Tools.beta > 5 || Tools.beta < -5) {
            if (Tools.beta === -720) {
                alert('init device, pls try again');
                return false;
            }
            alert('请保持水平测距' + Tools.beta);
            return false;
        }

        if (StarChart.actions.length > 0) {
            if (curLoR === 'm') {
                alert('请保持与上一面墙垂直');
                return false;
            }

            // 把当前方向付给上一条线段
            StarChart.actions[StarChart.actions.length - 1].lor = curLoR;

            // 有线段后展现操作按钮
            $('button.finish, button.undo, button.reverse').show();
        }

        // 模型数据填充
        StarChart.actions.push({
            'len': parseFloat(len),
            'lor': "",
            'alpha': Tools.alpha
        });

        // draw chart
        StarChart.redrawChart();
    }
};

/**
 * 辅助绘图的工具
 */
var Tools = {
    alpha: -1, // 指南针 0 ~ 360
    beta: -720, // 测距仪水平位置 -180 ~ 180
    // 在首页实时展现 alpha & beta 数值
    _showAlphaBeta: function (alpha, beta) {
        $('#device').html('alpha: ' + alpha + '<br>' + 'beta: ' + beta);
    },
    // 初始化获取 alpha & beta
    initDevice: function () {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (event) {
                Tools.alpha = Math.ceil(360 - event.alpha);
                Tools.beta = event.beta;
                Tools._showAlphaBeta(event.alpha, event.beta);
                Tools.markCurrentLR();
            }, false);
        } else {
            $('#device').html('你个破手机');
        }
    },
    /**
     * 根据上一个 alpha 和当前的 alpha 获取左中右
     * @returns {String} 两个 alpha 值之间的左右中
     */
    getLoR: function () {
        const MIDDLE = "m";
        const RIGHT = "r";
        const LEFT = "l";

        var startAngle = StarChart.actions.length === 0 ? Tools.alpha : StarChart.actions[StarChart.actions.length - 1].alpha,
                endAngle = Tools.alpha;

        var delta = endAngle - startAngle;
        
        // TODO: 应加大角度，以防连续测量同一线段的墙面
        if (delta > 0 && delta < 180) {
            return RIGHT;
        } else if (delta > 0 && delta > 180) {
            return LEFT;
        } else if (delta < 0 && delta > -180) {
            return LEFT;
        } else if (delta < 0 && delta < -180 ) {
            return RIGHT;
        } else {
            return MIDDLE;
        }
    },
    /**
     * 标识上一个墙体和当前手机水平位置的左右
     */
    markCurrentLR: function () {
        var lor = Tools.getLoR();
        if (lor === 'l') {
            $('.left').addClass('red-hover');
            $('.right').removeClass('red-hover');
        } else if (lor === 'r') {
            $('.right').addClass('red-hover');
            $('.left').removeClass('red-hover');
        } else {
            $('.right').removeClass('red-hover');
            $('.left').removeClass('red-hover');
        }
    }
};
Tools.initDevice();