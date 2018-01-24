
window.df.loadTableData(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                columns: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
                data: [[1, 20, 36, 10, 10, 20], [2, 20, 36, 10, 10, 20], [3, 20, 36, 10, 10, 20]],
                onRowClick(data) {
                    console.log(data);
                }
            });
        }, 3000);
    });
});

window.df.loadChartData(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        }, 3000);
    });
});