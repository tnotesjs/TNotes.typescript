const ClassDecorator     = (...args: any[]) => {};
const ParameterDecorator = (...args: any[]) => {};
const PropertyDecorator  = (...args: any[]) => {};
const MethodDecorator    = (...args: any[]) => {};
const AccessorDecorator  = (...args: any[]) => {};

// 类装饰器
@ClassDecorator
class A {
  // 属性装饰器
  @PropertyDecorator
  name: string;

  // 方法装饰器
  @MethodDecorator
  fly(
    // 方法参数装饰器
    @ParameterDecorator
    x: number
  ) {}

  // 存取器装饰器
  @AccessorDecorator
  get egg() { return '' }
  set egg(e) { }
}
