// const loaded = {
//   name: 'sasf',
//   age: 124,
//   address: 'asfkasof',
// }

// type expample = typeof loaded

// type C = Pick<expample, Exclude<keyof expample, 'name'>>

// const exap: C extends expample ? boolean : string = 'asf'

// console.log(exap)
// type Goose = {
//   weight: number
//   age: string
//   hegiht: number
// }

// type FilterObj<T, U> = {
//   [P in keyof T as Exclude<P, U>]: T[P]
// }
//用ts实现深拷贝
// function deepclone<T>(obj: T): T {
//   if (obj === null) return null
//   if (typeof obj !== 'object') return obj
//   if (obj instanceof RegExp) return new RegExp(obj) 
//   if (obj instanceof Date) return new Date(obj)
//   let newObj = new obj.constructor()
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       newObj[key] = deepclone(obj[key])
//     }
//   }
//   return newObj 
// }
// //把一个数组扁平化并去重
// function flat(arr: any[]): any[] {  
//   let result: any[] = []
//   let stack = [...arr]
//   while (stack.length) {
//     let item = stack.shift()
//     if (Array.isArray(item)) {
//       stack.push(...item)
//     } else {
//       if (!result.includes(item)) result.push(item)
//     }
//   }
//   return result
// }
// //方法二
// function flat2(arr: any[]): any[] {
//   return arr.reduce((pre, cur) => {
//     return pre.concat(Array.isArray(cur) ? flat2(cur) : cur)
//   }, [])
// }
// //方法三
// function flat3(arr: any[]): any[] {
//   while (arr.some(item => Array.isArray(item))) {
//     arr = [].concat(...arr)
//   }
//   return arr
// }

// //promise的实现
// class MyPromise {
//   status: string
//   value: any
//   reason: any
//   onFulfilledCallbacks: Function[]
//   onRejectedCallbacks: Function[]
//   constructor(executor: Function) {
//     this.status = 'pending'
//     this.value = undefined
//     this.reason = undefined
//     this.onFulfilledCallbacks = []
//     this.onRejectedCallbacks = []
//     const resolve = (value: any) => {
//       if (this.status === 'pending') {
//         this.status = 'fulfilled'
//         this.value = value
//         this.onFulfilledCallbacks.forEach(fn => fn())
//       }
//     }
//     const reject = (reason: any) => {
//       if (this.status === 'pending') {
//         this.status = 'rejected'
//         this.reason = reason
//         this.onRejectedCallbacks.forEach(fn => fn())
//       }
//     }
//     try {
//       executor(resolve, reject)
//     } catch (e) {
//       reject(e)
//     }
//   }
//   then(onFulfilled: Function, onRejected?: Function) {
//     if (this.status === 'fulfilled') {
//       onFulfilled(this.value)
//     }
//     if (this.status === 'rejected') {
//       onRejected(this.reason)
//     }
//     if (this.status === 'pending') {
//       this.onFulfilledCallbacks.push(() => {
//         onFulfilled(this.value)
//       })
//       this.onRejectedCallbacks.push(() => {
//         onRejected(this.reason)
//       })
//     }
//   }
// }
//用迭代器实现async await
// function asyncToGenerator(generatorFunc: Function) {
//   return function () {
//     const gen = generatorFunc.apply(this, arguments)
//     return new Promise((resolve, reject) => {
//       function step(key: string, arg: any) {
//         let generatorResult
//         try {
//           generatorResult = gen[key](arg)
//         } catch (error) {
//           return reject(error)
//         }
//         const { value, done } = generatorResult
//         if (done) {
//           return resolve(value)
//         } else {
//           return Promise.resolve(value).then(
//             function (value) {
//               step('next', value)
//             },
//             function (err) {
//               step('throw', err)
//             }
//           )
//         }
//       }
//       step('next', undefined)
//     })
//   }
// }