// import global from 'global'

// debugger
const objNum = 5000 * 1024
const useType = 0
const curType = useType == 1 ? "【Set】" : "【WeakSet】"
let obj = []
for (let k = 0; k < objNum; k++) {
  obj[k] = {}
}

function usageSize() {
  const used = process.memoryUsage().heapUsed
  return Math.round((used / 1024 / 1024) * 100) / 100 + "M"
}

if (useType == 1) {
  global.gc()
  console.log(objNum + '个' + curType + '占用内存：' + usageSize())

  new Set([...obj])

  global.gc()
  console.log(objNum + '个' + curType + '占用内存：' + usageSize())

  obj = null
  global.gc()
  console.log(objNum + '个' + curType + '占用内存：' + usageSize())

  console.log("=====")
} else {
  global.gc()
  console.log(objNum + '个' + curType + '占用内存：' + usageSize())
  console.log('new weakset', obj)
  new WeakSet([...obj])
  console.log('created')
  global.gc()
  console.log(objNum + '个' + curType + '占用内存：' + usageSize())

  obj = null
  global.gc()
  console.log(objNum + '个' + curType + '占用内存：' + usageSize())

  console.log("=====")
}