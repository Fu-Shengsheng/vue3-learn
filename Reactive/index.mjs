import reactive from './reactive.mjs'
const data = {
  text: 'hello world',
  tag: {
    des: 'temp'
  }
}

const reactiveData = reactive.setProxy(data)

function reacFn1() {
  console.log('reacFn1')
  console.log(reactiveData.text)
}

function reacFn2() {
  console.log('reacFn2')
  const a = reactiveData.text
}

const effectList = [reacFn1, reacFn2]
effectList.forEach(fn => reactive.effect(fn))

function update() {
  reactiveData.text = 'hello vue3'
}

update()