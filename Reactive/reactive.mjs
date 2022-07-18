// 存储响应式数据对象属性与副作用函数集合（Map类型）关联关系的桶
const bucket = new WeakMap()

// 存储当前需要注册的副作用函数
let activeEffect

/**
 * 注册副作用函数
 *
 * @param {Function} fn - 要注册的目标副作用函数
 */
function effect(fn) {
  // 暂存副作用函数
  activeEffect = fn
  // 执行一次副作用函数，触发 getter 从而触发注册
  fn()
}

function setProxy(data) {
  /** @type {Proxy} 
  * 响应式数据的代理对象，实现对代理对象的响应式能力设置
  */
  const obj = new Proxy(data, {
    // 当对象属性被读取时，设置响应式关联
    get(target, key) {
      console.log('get')
      // 如果没有副作用函数，则无需设置响应式关联，直接返回目标字段值
      if (!activeEffect) {
        return target[key]
      }

      // depsMap 存储了当前对象属性值
      let depsMap = bucket.get(target)
      if (!depsMap) {
        depsMap = new Map()
        bucket.set(target, depsMap)
      }

      // deps 存储了对象属性与副作用函数之间的关联关系
      let deps = depsMap.get(key)
      if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
      }
      deps.add(activeEffect)

      return target[key]
    },
    // 当对象属性被更新时，根据响应式关联关系，执行对应的副作用函数
    set(target, key, value) {
      console.log('set')
      // 更新属性值
      target[key] = value
      // 
      const depsMap = bucket.get(target)
      if (!depsMap) {
        return
      }
      const deps = depsMap.get(key)
      if (!deps) {
        return
      }
      deps.forEach(effectFn => effectFn())
      return true
    }
  })
  return obj
}



export default {
  setProxy,
  effect
}