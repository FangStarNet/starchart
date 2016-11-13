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
 * @version 0.1.0.0, Nov 12, 2016 
 */

 var StarChart = {
    // data
    paths: [],
    // Paper.js Scope Global
    paper: undefined,
    // record every action
    actions: [],
    undoActions: [],
    // init canvas & path
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
            dir: 4
        });
    },
    /**
     * add point to path
     * @param {object} pathObj it's paper.Path, add point to this.
     * @param {decimal} len line length.
     * @param {string} dir direction [l: left; r: right].
     */
    addPoint: function (pathObj, len, dir) {
        var point = pathObj.point,
        path = pathObj.path,
        prevDir = pathObj.dir, // 1 (x, 0); 2 (0, y); 3 (-x, 0); 4 (0, -y)
        newPoint = {};

        switch (prevDir) {
            case 1:
                newPoint.x = point.x + len;
                newPoint.y = point.y;

                pathObj.dir = dir === 'l' ? 4: 2;
                break;
            case 2:
                newPoint.x = point.x;
                newPoint.y = point.y + len;

                pathObj.dir = dir === 'l' ? 1: 3;
                break;
            case 3:
                newPoint.x = point.x - len;
                newPoint.y = point.y ;

                pathObj.dir = dir === 'l' ? 2: 4;
                break;
            case 4:                
                newPoint.x = point.x;
                newPoint.y = point.y - len;

                pathObj.dir = dir === 'l' ? 3: 1;
                break;
            default:
                console.log('no this direction');
        }

        // draw
        path.add(new paper.Point(newPoint.x, newPoint.y));
        // add point to module data
        pathObj.point = newPoint;
    },
    redrawChart: function () {
        var pathObj = StarChart.paths[0];

        pathObj.path.removeSegments();
        pathObj.path.closed = false;

        // add origin point
        pathObj.path.add(new paper.Point(0, 0));

        pathObj.point = {
                x: 0, 
                y: 0
        };
        pathObj.dir = 4;

        for (var ii = StarChart.actions.length, i = 0; i < ii; i++) {
            var action = StarChart.actions[i];
            StarChart.addPoint(pathObj, action.len, action.dir);
        }

        pathObj.area = this.paths[0].path.area;
        // fit canvas
        pathObj.path.fitBounds(paper.view.bounds);
    },
    redo: function () {
        if (this.undoActions.length < 1) {
            return false;
        }

        var redoAction = this.undoActions.splice(this.undoActions.length - 1, 1);
        this.actions.push(redoAction[0]);

        this.redrawChart();
    },
    undo: function () {
        if (this.actions.length < 1) {
            return false;
        }

        var undoAction = this.actions.splice(this.actions.length - 1, 1);
        this.undoActions.push(undoAction[0]);

        this.redrawChart();
    },
    finished: function () {
        console.log(JSON.stringify(this.actions));
        alert('该户型套内面积为：' + parseFloat((this.paths[0].area / 10000).toFixed(5)) + '平方米' );
    }
 };