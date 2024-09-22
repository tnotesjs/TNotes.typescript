function countInstances(value:any, context:any) {
  let instanceCount = 0;

  const wrapper = function (...args:any[]) {
    instanceCount++;
    const instance = new value(...args);
    instance.count = instanceCount;
    return instance;
  } as unknown as typeof MyClass;

  wrapper.prototype = value.prototype; // A
  return wrapper;
}

@countInstances
class MyClass {}

const inst1 = new MyClass();
const inst2 = new MyClass();
const inst3 = new MyClass();

console.log(
  inst1 instanceof MyClass,
  inst2 instanceof MyClass,
  inst3 instanceof MyClass
) // true true true

// @ts-ignore
console.log(inst1.count, inst2.count, inst3.count) // 1 2 3