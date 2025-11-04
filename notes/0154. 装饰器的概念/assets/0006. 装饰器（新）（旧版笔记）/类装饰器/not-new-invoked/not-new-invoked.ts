function functionCallable(
  value:any, {kind}:any
):any {
  if (kind === 'class') {
    return function (...args:any) {
      if (new.target !== undefined) {
        throw new TypeError('This function can’t be new-invoked');
      }
      return new value(...args);
    }
  }
}

@functionCallable
class Person {
  nick_name:string;
  constructor(name:string) {
    this.nick_name = name;
  }
}

// @ts-ignore
const up = Person('Tdahuyou');
console.log(up.nick_name) // 'Tdahuyou'

const up2 = new Person('Tdahuyou'); // ❌
// .../not-new-invoked.ts:7
// throw new TypeError('This function can’t be new-invoked');
//       ^
// TypeError: This function can’t be new-invoked