console.log('꼭 require가 위에 있을 필요는 없음')

module.exports = 'it`s me :)'

require('./var')

console.log('require.cache')
// 한번 require한 파일은 require.cache에 저장되므로, 다음번에 require 할땐 새로 안불러오고 cache에 있는걸 재사용함.
console.log(require.cache)
console.log("=============")
// require.main = 노드 실행시 첫 모듈을 가리킴. 여기선 require.main = require.js
console.log(require.main === module)
// 모듈 이름이 출력됨
console.log(require.main.filename)