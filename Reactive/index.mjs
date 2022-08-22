import reactive from './reactive.mjs'
const data = {
  text: 'hello world',
  ok: true,
  count: 0
}

const reactiveData = reactive.setProxy(data)

// function reacFn1() {
//   console.log('reacFn1')
//   console.log(reactiveData.text)
// }

// function reacFn2() {
//   console.log('reacFn2')
//   const a = reactiveData.text
// }

// const effectList = [reacFn1, reacFn2]
// effectList.forEach(fn => reactive.effect(fn))
// function effFn() {
//   let data = reactiveData.ok ? reactiveData.text : 'not'
//   console.log(data)
// }
// reactive.effect(effFn)

// function update1() {
//   reactiveData.ok = false
// }

// function update2() {
//   reactiveData.text = 'hello vue3'
// }

// update1()
// update2()

// ------- effect 的嵌套 --------
// function effectFn1() {
//   console.log('effectFn1 run')
//   reactive.effect(effectFn2)
//   console.log(reactiveData.text)
// }

// function effectFn2() {
//   console.log('effectFn2 run')
//   console.log(reactiveData.ok)
// }

// reactive.effect(effectFn1)
// update2()

// ------- 自身递归调用的 effectFn --------
reactive.effect(() => reactiveData.count++)