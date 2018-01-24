# deep-finance-chart

使用 echarts 做的一个数据可视化工具

![deep-finance](./img/logo/logo_128.png)

第一版，做的非常粗糙，仅仅具有最基本的功能，一个表格与一个图表。
可以直接拖拽一个`js`文件到窗口中来运行程序。

* `window.df.loadTableData(func: () => Promise<{ columns: string[], data: any[][], onRowClick?: (data: any[]) => void }>)` 向表格中添加数据。`columns`：列名，`data`：每一行的数据，`onRowClick`：点击某行后的回调，传递该行数据。

* `window.df.loadChartData(func: () => Promise<any>)` 更新图表。传入的方法返回echarts图表配置