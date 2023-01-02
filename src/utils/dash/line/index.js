export function lineToolTipFunc(colorList) {
  return {
    trigger: 'axis',
    formatter: function (params) {
      let html = ''
      params.forEach((v) => {
        html += `<div style="color: #fff;font-size: 14px;line-height: 24px">
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span>
              ${v.name}
              <span style="color:${colorList[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}</span>
              次`
      })
      return html
    },
    extraCssText: 'background: #636476; border-radius: 0;color: #333;', //tooltip提示框
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: '#ffffff',
        shadowColor: '#636476',
        shadowBlur: 5,
      },
    },
  }
}

export function lineXAxisFunc(xData) {
  return [
    {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: '#fff',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#D9D9D9', // x轴颜色
        },
      },
      data: xData,
    },
  ]
}

export function lineYAxisFunc() {
  return [
    {
      type: 'value',
      name: '单位：分数',
      axisLabel: {
        textStyle: {
          color: '#fff',
        },
      },
      nameTextStyle: {
        color: '#666',
        fontSize: 12,
        lineHeight: 40,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#E9E9E9',
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
  ]
}

export function lineSeriesFunc(yData, colorList, echarts) {
  const hexToRgba = (hex, opacity) => {
    let rgbaColor = ''
    const reg = /^#[\da-f]{6}$/i
    if (reg.test(hex)) {
      rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt(
        '0x' + hex.slice(5, 7),
      )},${opacity})`
    }
    return rgbaColor
  }
  return [
    {
      type: 'line',
      smooth: true,
      symbolSize: 8,
      zlevel: 3,
      lineStyle: {
        normal: {
          color: colorList[0],
          shadowBlur: 3,
          shadowColor: hexToRgba(colorList[0], 0.5),
          shadowOffsetY: 8,
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: hexToRgba(colorList[0], 0.3),
              },
              {
                offset: 1,
                color: hexToRgba(colorList[0], 0.1),
              },
            ],
            false,
          ),
          shadowColor: hexToRgba(colorList[0], 0.1),
          shadowBlur: 10,
        },
      },
      data: yData[0].value,
    },
  ]
}
