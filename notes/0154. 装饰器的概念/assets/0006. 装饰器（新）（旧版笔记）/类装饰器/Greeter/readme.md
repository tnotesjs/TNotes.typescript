为了可以直接使用 ts-node 来运行 Greeter.ts 文件，需要关闭 noImplicitAny 配置，否则会报错。

```bash
$ ts-node "/Users/huyouda/Desktop/yuque-public/装饰器（新）/类装饰器/Greeter.ts"
# /usr/local/lib/node_modules/ts-node/src/index.ts:859
#     return new TSError(diagnosticText, diagnosticCodes, diagnostics);
#            ^
# TSError: ⨯ Unable to compile TypeScript:
# 装饰器（新）/类装饰器/Greeter.ts:1:18 - error TS7006: Parameter 'value' implicitly has an 'any' type.

# 1 function Greeter(value, context) {
#                    ~~~~~
# 装饰器（新）/类装饰器/Greeter.ts:1:25 - error TS7006: Parameter 'context' implicitly has an 'any' type.

# 1 function Greeter(value, context) {
#                           ~~~~~~~

#     at createTSError (/usr/local/lib/node_modules/ts-node/src/index.ts:859:12)
#     at reportTSError (/usr/local/lib/node_modules/ts-node/src/index.ts:863:19)
#     at getOutput (/usr/local/lib/node_modules/ts-node/src/index.ts:1077:36)
#     at Object.compile (/usr/local/lib/node_modules/ts-node/src/index.ts:1433:41)
#     at Module.m._compile (/usr/local/lib/node_modules/ts-node/src/index.ts:1617:30)
#     at Module._extensions..js (node:internal/modules/cjs/loader:1435:10)
#     at Object.require.extensions.<computed> [as .ts] (/usr/local/lib/node_modules/ts-node/src/index.ts:1621:12)
#     at Module.load (node:internal/modules/cjs/loader:1207:32)
#     at Function.Module._load (node:internal/modules/cjs/loader:1023:12)
#     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:135:12) {
#   diagnosticCodes: [ 7006, 7006 ]
# }
$ ts-node "/Users/huyouda/Desktop/yuque-public/装饰器（新）/类装饰器/Greeter.ts"
# 你好
```