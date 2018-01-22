import * as $ from 'jquery';
import * as split from 'split.js';
import { remote } from 'electron';

//窗口菜单
(function menu() {
    const win = remote.getCurrentWindow();
    const { Menu, MenuItem, dialog } = remote;

    const menu = new Menu();
    let jsFilePath: string;

    const openFile = new MenuItem({
        label: '打开程序', click() {
            dialog.showOpenDialog(win, { filters: [{ name: 'js', extensions: ['js'] }] }, function (filePaths) {
                if (filePaths.length > 0 && jsFilePath === undefined) {
                    localStorage['jsFilePath'] = jsFilePath = filePaths[0];
                    require(filePaths[0]);  //加载程序
                } else {
                    dialog.showErrorBox('错误', '不可重复打开');
                }
            });
        }
    });

    const restart = new MenuItem({
        label: '重新启动', visible: false, click() {
            if (jsFilePath) {
                localStorage['jsFilePath'] = jsFilePath;
                win.reload();
            } else {
                dialog.showErrorBox('错误', '请先打开一个js文件')
            }
        }
    });

    const openDev = new MenuItem({
        label: '打开调试', click() {
            win.webContents.openDevTools();
        }
    });

    menu.append(openFile);
    menu.append(restart);
    menu.append(openDev);

    win.setMenu(menu);
})();

//布局
(function layout() {
    split(['#table', '#chart'], {
        minSize: 0
    });
})();