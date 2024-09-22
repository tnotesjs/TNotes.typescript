function countInstances(value:any, context:any) {
  let instanceCount = 0;

  return class extends value {
    constructor(...args:any[]) {
      super(...args);
      instanceCount++;
      this.count = instanceCount;
    }
  };
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