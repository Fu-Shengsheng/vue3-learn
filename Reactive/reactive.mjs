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
  // 包装副作用函数为effectFn，用来解决因分指切换导致的副作用函数无效执行问题
  function effectFn() {
    // 每次执行副作用函数前将其与依赖集合的关联关系清空
    // 执行副作用函数时会在get中重新建立最新的依赖关系
    cleanup(effectFn)
    // 当effectFn执行时，将其设置为当前的activeEffect
    activeEffect = effectFn
    fn()
  }
  // effectFn.deps 存储所有与该副作用函数关联的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}

function setProxy(data) {
  /** @type {Proxy} 
  * 响应式数据的代理对象，实现对代理对象的响应式能力设置
  */
  const obj = new Proxy(data, {
    // 当对象属性被读取时，设置响应式关联
    get(target, key) {
      console.log('get', key)
      track(target, key)
      return target[key]
    },
    // 当对象属性被更新时，根据响应式关联关系，执行对应的副作用函数
    set(target, key, value) {
      console.log('set', key)
      // 更新属性值
      target[key] = value
      trigger(target, key)
      return true
    }
  })
  return obj
}

// 收集依赖，追踪变化
function track(target, key) {
  // 如果没有副作用函数，则无需设置响应式关联，直接返回目标字段值
  if (!activeEffect) {
    return target[key]
  }

  // depsMap 存储了当前对象属性值与相关的副作用函数集合的对应关系
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
  // 将activeEffect添加到 key 的依赖集合中
  deps.add(activeEffect)
  // 将 key 的依赖集合存入 activeEffect 的 deps 列表中
  // 用来根据 activeEffect 查询当前副作用函数关联了多少依赖集合
  activeEffect.deps.push(deps)
}

// 发生变化时出发依赖的副作用函数执行
function trigger(target, key) {
  // 从全局的 bucket 拿到存储当前对象的字段 key 与其关联的副作用函数的 Map
  const depsMap = bucket.get(target)
  if (!depsMap) {
    return
  }
  // 根据 key 值获取对应的副作用函数集合
  const deps = depsMap.get(key)
  if (!deps) {
    return
  }
  // 基于 deps 创建新的用于遍历执行的副作用函数集合
  // 解决因 cleanup 导致的 Set 实例不断删除&新增从而进一步导致的遍历诗无限循环的问题
  const effectsToRun = new Set(deps)
  // 遍历执行集合中的副作用函数
  effectsToRun.forEach(effectFn => effectFn())
}

// 清除 effectFn 关联的依赖集合中对 effectFn 的关联关系
function cleanup(effectFn) {
  effectFn.deps.forEach(deps => deps.delete(effectFn))
  // 清空 effectFn 与外部依赖关系的关联
  effectFn.deps.length = 0
}

export default {
  setProxy,
  effect
}