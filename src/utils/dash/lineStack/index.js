import { defaultColorList as colorList } from '../index'
export function lineStackGene(el, data, options = {}) {
  const { grid = {}, legendData = [], backgroundColor = '#FBFCFC', axisLabel = {} } = options
  const myChart = window.echarts.init(el)
  const { xData, seriesData } = data

  const option = {
    backgroundColor,
    color: colorList,
    legend: legendData,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },

    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      ...grid,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisLabel,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel,
      },
    ],
    series: seriesData,
  }
  myChart.setOption(option, true)
  return myChart
}
