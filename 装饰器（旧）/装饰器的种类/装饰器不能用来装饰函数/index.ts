function Decorator() {
  console.log('In Decorator');
}

@Decorator // ✖
// Decorators are not valid here.ts(1206)
function decorated() {
  console.log('in decorated');
}
