export const defaultColorList = [
  '#4076FD',
  '#31DB9A',
  '#FA8F61',
  '#EC5B5B',
  '#1BD5E7',
  '#F9D441',
  '#975FE4',
  '#3A9EFF',
  '#438AFD',
  '#49E5DC',
  '#E57368',
  '#EEED1D',
  '#4FD769',
  '#F8AE4A',
  '#D86074',
  '#7411FC',
]

import { lineToolTipFunc, lineXAxisFunc, lineYAxisFunc, lineSeriesFunc } from './line'
export function lineGene(el, data, options = {}) {
  const { grid = {} } = options
  const myChart = window.echarts.init(el)
  const { xData, yData } = data

  const option = {
    backgroundColor: 'transparent',
    color: defaultColorList,
    legend: {
      right: 10,
      top: 10,
    },
    tooltip: lineToolTipFunc(defaultColorList),
    grid: {
      top: 30,
      bottom: 20,
      containLabel: true,
      ...grid,
    },
    xAxis: lineXAxisFunc(xData),
    yAxis: lineYAxisFunc(),
    series: lineSeriesFunc(yData, defaultColorList, window.echarts),
  }
  myChart.setOption(option, true)
  return myChart
}

export function lineNormalGene(el, data, options = {}) {
  const { showLegend = true, grid = {} } = options
  const myChart = window.echarts.init(el)
  const { xData, yData, config = {} } = data
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    ...legendGene({
      top: 10,
      bottom: 50,
      itemHeight: 2,
    }),
    color: defaultColorList,
    grid: {
      left: 50,
      top: 50,
      bottom: 20,
      right: 50,
      ...grid,
    },
    ...axisGene('category', xData, options),
    ...config,
  }
  if (!showLegend) {
    delete option.legend
  }
  option.series = yData.map((item) => {
    return {
      name: item.name,
      data: item.value,
      type: 'line',
      lineStyle: {
        ...item.lineStyle,
      },
      smooth: true, //这句是让曲线变平滑的
    }
  })
  myChart.setOption(option, true)
  return myChart
}

import { pieSeriesFunc, pieDispatchAction, graphicGene } from './pie'
export function pieNormalGene(el, data, options = {}) {
  const { dispatchAction, graphicConfig, grid = {} } = options
  const myChart = window.echarts.init(el, null, { devicePixelRatio: 2.5 })
  const option = {
    tooltip: { trigger: 'item' },
    title: {
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 20,
      },
    },
    grid: {
      ...grid,
    },
    series: pieSeriesFunc(defaultColorList, data, options, myChart),
  }

  if (graphicConfig) {
    option.graphic = graphicGene(graphicConfig)
  }
  myChart.setOption(option, true)
  if (dispatchAction) {
    pieDispatchAction(myChart)
  }
  window.addEventListener('resize', function () {
    myChart.resize()
  })
  return myChart
}

export function barGene(el, data, options = {}) {
  const {
    showLegend = true,
    stack,
    type = 'category',
    grid = {},
    normal = false, // 柱状图上方显示数值
    yAxis = false, // 格式化y轴显示
    tooltip = true, // 是否展示 tooltip
  } = options
  const myChart = window.echarts.init(el)
  const { xData = [], yData = [] } = data
  const option = {
    ...legendGene({
      top: 10,
      bottom: 50,
    }),
    color: defaultColorList,
    grid: {
      left: 60,
      top: 50,
      bottom: 20,
      right: 50,
      ...grid,
    },
    ...axisGene(type, xData),
  }
  if (!showLegend) {
    delete option.legend
  }
  option.series = yData.map((item) => {
    return {
      name: item.name,
      data: item.value,
      type: item.type || 'bar',
      barWidth: type === 'category' ? 20 : 12,
      barMinHeight: 5,
      itemStyle: {
        borderRadius: type === 'category' ? [6, 6, 0, 0] : [6, 6, 6, 6],
        normal: normal ? getBarNormal() : {},
      },
    }
  })
  if (stack) {
    option.series.forEach((item) => {
      item.stack = stack
    })
  }

  if (tooltip) {
    option.tooltip = {
      trigger: 'axis',
    }
  }

  if (yAxis) {
    option.yAxis = {
      type: 'value',
      //设置y轴显示为%
      axisLabel: {
        show: true,
        interval: 'auto',
        formatter: '{value} %',
      },
      show: true,
    }
  }
  myChart.setOption(option, true)
  return myChart
}

function getBarNormal() {
  return {
    label: {
      show: true, //开启显示
      position: 'top', //在上方显示
      formatter: (data) => {
        return data.data.toFixed(2) + '%'
      }, //显示百分号
      textStyle: {
        //数值样式
        color: '#666',
        fontSize: 16,
      },
    },
  }
}

function textVerticle(value) {
  return value.split('').join('\n')
}

function axisGene(type, data, options = {}) {
  let { xAxisLine = true, yAxisLine = false } = options
  const { xAxisTick = true, xLableVerticle = false } = options
  const xType = type
  let yType
  let yData = []
  const lineColor = '#E8E8E8'
  let xLineStyle = {
    color: '#D9D9D9',
  }
  let yLineStyle = {
    type: 'dashed',
    color: lineColor,
    width: 1,
  }
  let splitLine = true
  if (type === 'category') {
    yType = 'value'
  } else {
    yType = 'category'
    const tem = xLineStyle
    xLineStyle = yLineStyle
    yLineStyle = tem
    const showTem = xAxisLine
    xAxisLine = yAxisLine
    yAxisLine = showTem
    splitLine = false
    yData = data
  }
  const axisLabel = {
    fontSize: 12,
    color: '#666',
  }
  const xAxisLabel = {
    ...axisLabel,
  }
  if (xLableVerticle) {
    xAxisLabel.interval = 0
    xAxisLabel.formatter = textVerticle
  }
  return {
    xAxis: {
      type: xType,
      data,
      axisTick: {
        show: xAxisTick, // 刻度线
        alignWithLabel: true,
      },
      axisLabel: xAxisLabel,
      axisLine: {
        show: xAxisLine,
        lineStyle: xLineStyle,
      },
    },
    yAxis: {
      data: yData,
      type: yType,
      axisLabel: {
        ...axisLabel,
      },
      // 坐标线
      axisLine: {
        show: yAxisLine,
        lineStyle: yLineStyle,
      },
      // 刻度
      axisTick: {
        show: false,
      },
      // 中间分割线
      splitLine: {
        show: splitLine,
        lineStyle: yLineStyle,
      },
    },
  }
}

export function barSimpleGene(el, data, colorTarget = 'bar') {
  const myChart = window.echarts.init(el)
  const isBar1 = colorTarget === 'bar1'
  data.sort((a, b) => a.value - b.value)
  const option = {
    ...legendGene({
      bottom: 0,
      left: 0,
    }),
    color: defaultColorList,
    grid: {
      left: 0,
      right: isBar1 ? '15%' : 0,
      top: -130,
      bottom: -105,
    },
    xAxis: {
      show: false,
      type: 'value',
    },
    yAxis: {
      show: false,
      type: 'category',
      data: [''],
    },
  }
  option.legend.data = data.map((item) => item.name)
  option.series = data.map((item, index) => {
    const z = data.length - index
    const isLast = index === data.length - 1
    const isSpeceil = isLast && isBar1
    let position = 'inside'
    if (isSpeceil) {
      position = 'right'
    } else if (index) {
      position = 'insideRight'
    } else {
      position = 'inside'
    }
    return {
      name: item.name,
      type: 'bar',
      barWidth: 20,
      barMinHeight: 5,
      borderRadius: 20,
      color: defaultColorList[index],
      itemStyle: {
        borderRadius: 20,
      },
      stack: false,
      barGap: '-100%',
      z,
      label: {
        color: isSpeceil ? '#333' : '#666',
        show: !isSpeceil,
        verticleAlign: 'middle',
        position,
      },
      emphasis: {
        focus: 'series',
      },
      data: [item.value],
    }
  })
  myChart.setOption(option, true)
  return myChart
}

export function pieGene(el, data, options) {
  const {
    title = {},
    itemStyle = {},
    seriesLabel = {
      position: 'inside',
      formatter: '{d}%',
      color: '#fff',
      ...options.seriesLabel,
    },
    avoidLabelOverlap = true,
  } = options
  const myChart = window.echarts.init(el)
  const option = {
    color: defaultColorList,
    title,
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap,
        emphasis: {
          label: {
            formatter: '{b}',
            show: true,
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
        itemStyle,
        label: seriesLabel,
        labelLine: { show: false },
        data,
      },
    ],
  }
  myChart.setOption(option, true)
  return myChart
}

export function rateToText(obj) {
  for (const key in obj) {
    if (key === 'rate' || key.includes('_rate')) {
      obj[`${key}_text`] = (obj[key] * 100).toFixed(2)
    }
  }
}

function legendGene(options) {
  return {
    legend: {
      icon: 'rect',
      right: 'left',
      itemHeight: 10, //icon图形大小
      itemWidth: 10,
      textStyle: {
        fontSize: 12,
        color: '#666',
      },
      ...options,
    },
  }
}
