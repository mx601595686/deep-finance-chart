window.$ = window.jQuery = require('jquery');
const echarts = require('echarts');
const split = require('split.js');
const { remote } = require('electron');
require('datatables.net')();

const win = remote.getCurrentWindow();
const { Menu, MenuItem, dialog } = remote;

window.df = {};

//打开JS文件
let jsFilePath;
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

    const openFile = new MenuItem({
        label: '打开程序', click() {
            dialog.showOpenDialog(win, { filters: [{ name: 'js', extensions: ['js'] }] }, function (filePaths = []) {
                if (filePaths.length > 0) {
                    openJS(filePaths[0]);
                }
            });
        }
    });

    setTimeout(() => {  //重新运行之前保存的js文件
        const jsFilePath = sessionStorage['jsFilePath'];
        if (jsFilePath) {
            sessionStorage.removeItem('jsFilePath')
            openJS(jsFilePath);
        }
    }, 1);

    const restart = new MenuItem({
        label: '重新运行', click() {
            if (jsFilePath) {
                sessionStorage['jsFilePath'] = jsFilePath;
                win.reload();
            } else {
                dialog.showErrorBox('请先打开一个js文件', '');
            }
        }
    });

    const openDev = new MenuItem({
        label: '打开调试', click() {
            win.webContents.openDevTools();
        }
    });

    let alwaysOnTop = win.isAlwaysOnTop();
    const fixWindow = new MenuItem({
        label: '固定或取消固定窗口',
        click() {
            if (alwaysOnTop) {
                alwaysOnTop = false;
                win.setAlwaysOnTop(false);
            } else {
                alwaysOnTop = true;
                win.setAlwaysOnTop(true);
            }
        }
    });

    menu.append(openFile);
    menu.append(restart);
    menu.append(openDev);
    menu.append(fixWindow);

    win.setMenu(menu);
})();

//窗口大小变化回调列表
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
    window.df.loadTableData = function (func) {
        $('#table .loading').show();

        func().then(({ columns, data, onRowClick }) => {
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

            $('#table .loading').hide();
        }).catch(err => {
            $('#table .loading').hide();
            throw err;
        });
    }
})();

//图表加载数据
(function chart() {
    const charts = echarts.init($('#chart')[0]);

    window.df.loadChartData = function (func) {
        charts.clear();
        charts.showLoading();

        func().then(obj => {
            charts.setOption(obj, true);
            charts.hideLoading();
        }).catch(err => {
            charts.hideLoading();
            throw err;
        });
    }

    let timer;
    $(window).resize(function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            charts.resize();
        }, 500);
    });

    split_resize.push(function () {
        charts.resize();
    });
})();

