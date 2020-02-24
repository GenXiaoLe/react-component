function foo1(arg) {
    console.log('foo1');
    return arg;
}

function foo2(arg) {
    console.log('foo2');
    return arg;
}

function foo3(arg) {
    console.log('foo3');
    return arg;
}

// foo1(foo2(foo3('omg')));

let compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)));

// 1
// function (...args) {
//     return foo1(foo2(...args))
// }

// 2
// function (...args) {
//     return foo1(foo2(foo3(...args)))
// }

// compose(foo1, foo2, foo3)

const _res = compose(foo1, foo2, foo3)('omg2');
console.log(_res);