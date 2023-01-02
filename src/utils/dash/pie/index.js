export function pieSeriesFunc(colorList, datas, options, myChart) {
  const {
    labelPadding = [-30, 15, -20, 15],
    labelColor = '#000',
    labelVisiable = true,
    labelPosition = 'outside',
    concatName = true,
  } = options
  datas = datas.map((item) => ({
    ...item,
    labelLine: { show: true },
    label: { show: labelVisiable },
  }))
  return datas.map(function () {
    return {
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['40%', '80%'],
      itemStyle: {
        normal: {
          color: (params) => colorList[params.dataIndex],
        },
      },
      label: {
        show: labelVisiable,
        color: labelColor,
        position: labelPosition,
        formatter: function (params) {
          if (params.value > 0) {
            if (concatName) {
              return params.name + ':' + params.percent + '%'
            } else {
              return params.percent + '%'
            }
          } else {
            params.data.labelLine.show = false
            params.data.label.show = false
          }
        },
        fontSize: 12,
        rich: {
          hr: {
            backgroundColor: 't',
          },
          a: {
            verticalAlign: 'bottom',
          },
        },
        padding: labelPadding,
      },
      labelLine: {
        normal: {
          length: 20,
          length2: 30,
          lineStyle: {
            width: 1,
          },
        },
      },
      labelLayout: function (params) {
        const isLeft = params.labelRect.x < myChart.getWidth() / 2
        const points = params.labelLinePoints
        points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width
        return {
          labelLinePoints: points,
        }
      },
      data: datas,
    }
  })
}

// 圆心内容
export function graphicGene(graphicConfig) {
  const graphic = []
  if (graphicConfig.desc) {
    graphic.push({
      type: 'text',
      left: 'center',
      top: '40%',
      style: {
        text: graphicConfig.desc,
        textAlign: 'center',
        marginBottom: 5,
        fill: '#fff',
        fontSize: 16,
      },
    })
  }
  if (graphicConfig.title) {
    graphic.push({
      type: 'text',
      left: 'center',
      top: graphic.length ? '50%' : '45%',
      style: {
        text: graphicConfig.title,
        textAlign: 'center',
        fill: '#fff',
        fontSize: 18,
      },
    })
  }
  return graphic
}

export function pieDispatchAction(myChart) {
  let index = 0
  function fun() {
    setInterval(function () {
      myChart.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0,
        dataIndex: index,
      })
      // 显示提示框
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: index,
      })
      // 取消高亮指定的数据图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: index == 0 ? 5 : index - 1,
      })
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index,
      })
      index++
      if (index > 6) {
        index = 0
      }
    }, 3000)
  }
  fun()
  setTimeout(function () {
    fun()
  }, 5000)
}
