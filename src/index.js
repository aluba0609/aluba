// import $ from "jquery"
require('./index.css')
console.log($)
console.log(window.$)
import logo from '../img/a.png'
console.log(logo)

let img=new Image()
img.src=logo
document.body.appendChild(img)
//expose-loader暴露全局的loader 内敛loader
//pre 前面执行的loader  normal 普通的loader  内敛loader  后置loader postloader









// require('./index.css')

// let a=require('./a.js')
// console.log(a)
// console.log(1)

// class AB {
//     constructor(){
//         this.a=1
//     }
// }
// let ab=new AB();
// console.log(ab)