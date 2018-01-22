window.$ = window.jQuery = require('jquery');
const echarts = require('echarts');
const split = require('split.js');
const { remote } = require('electron');
require('datatables.net')();

const win = remote.getCurrentWindow();
const { Menu, MenuItem, dialog } = remote;

window.df = {};

let jsFilePath;

//打开JS文件
function openJS(path) {
    if (jsFilePath == null) {
        if (path) {
            jsFilePath = path;
            require(path);  //加载程序
        }
    } else {
        dialog.showErrorBox('不可以重复加载js文件', '');
    }
}

//拖拽打开js
(function dragJs() {
    document.ondragover = function (e) {
        e.preventDefault();  //只有在ondragover中阻止默认行为才能触发 ondrop 而不是 ondragleave
    };
    document.ondrop = function (e) {
        e.preventDefault();  //阻止 document.ondrop的默认行为  *** 在新窗口中打开拖进的图片
    };

    document.body.ondrop = function (e) {
        e.preventDefault()
        let file = e.dataTransfer.files[0];
        if (file && /\.js$/.test(file.path)) {
            openJS(file.path);
        }
    }
})();

//窗口菜单
(function menu() {


    const menu = new Menu();
    let jsFilePath;

    const openFile = new MenuItem({
        label: '打开程序', click() {
            dialog.showOpenDialog(win, { filters: [{ name: 'js', extensions: ['js'] }] }, function (filePaths) {
                if (filePaths.length > 0) {
                    openJS(filePaths[0]);
                }
            });
        }
    });

    const openDev = new MenuItem({
        label: '打开调试', click() {
            win.webContents.openDevTools();
        }
    });

    menu.append(openFile);
    menu.append(openDev);

    win.setMenu(menu);
})();

//大小变化回调列表
let split_resize = [];
//布局
(function layout() {
    split_instance = split(['#table', '#chart'], {
        minSize: 0,
        onDragEnd() {
            split_resize.forEach(item => item())
        }
    });
})();

//数据表格
(function table() {
    /* $('#table table').DataTable({
        data: [["Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800"]],
        columns: [
            { title: "Name" },
            { title: "Position" },
            { title: "Office" },
            { title: "Extn." },
            { title: "Start date" },
            { title: "Salary" }
        ]
    }); */

    //向表中添加数据
    window.df.loadTableData = function (columns, data, onRowClick) {
        const table = $('#table table').DataTable({
            data,
            columns: columns.map(item => ({ title: item }))
        });

        if (onRowClick) {
            $('#table table').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }

                let data = table.row(this).data();
                onRowClick(data);
            });
        }
    }
})();

//图表加载数据
let charts;
(function chart() {
    if (charts == null)
        charts = echarts.init($('#chart')[0]);

    window.df.loadChartData = function (obj) {
        charts.setOption(obj);
    }

    let timer;
    $(window).resize(function () {
        if (charts) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                charts.resize();
            }, 10);
        }
    });

    split_resize.push(function () {
        if (charts)
            charts.resize();
    });
})();

