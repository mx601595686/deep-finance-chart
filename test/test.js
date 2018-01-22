
window.df.loadTableData(["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"], [[1, 20, 36, 10, 10, 20],[2, 20, 36, 10, 10, 20],[3, 20, 36, 10, 10, 20]], (data) => {
    console.log(data);
});

window.df.loadChartData({
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