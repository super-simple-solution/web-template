export default function (selectPageReq: any) {
  /*分页*/
  const pageNum = ref(1)
  const pageSize = ref(10)
  const pagePrev = (val: number) => {
    pageNum.value = val
    selectPageReq()
  }
  const pageNext = (val: number) => {
    pageSize.value = val
    selectPageReq()
  }

  return {
    pageNum,
    pageSize,
    pagePrev,
    pageNext,
  }
}
