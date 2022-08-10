import reactive from './reactive.mjs'
const data = {
  text: 'hello world',
  ok: true
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
function effFn() {
  let data = reactiveData.ok ? reactiveData.text : 'not'
  console.log(data)
}
reactive.effect(effFn)

function update1() {
  reactiveData.ok = false
}

function update2() {
  reactiveData.text = 'hello vue3'
}

update1()
update2()