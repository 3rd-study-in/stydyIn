// 이 코드는 일부러 포맷팅이 잘못되어 있습니다
// 저장하면 자동으로 고쳐지는지 확인하세요!

import React from "react"  // ❌ 큰따옴표, 세미콜론 없음

export const FormatTest = () => {  // ❌ 불필요한 공백
  const user = { name: "John", age: 30, city: "Seoul" }  // ❌ 공백 없음, 큰따옴표, 세미콜론 없음, 후행 쉼표 없음

  const longText = "This is a very long text that exceeds 80 characters and should be automatically wrapped by prettier when you save this file"  // ❌ 들여쓰기, 긴 줄

  const array = [1, 2, 3, 4, 5]  // ❌ 공백 없음, 후행 쉼표 없음

  return (  // ❌ 잘못된 들여쓰기
    <div>
      <h1>{user.name}</h1>
      <p>Age: {user.age}</p>
      <p>City: {user.city}</p>
      <p>{longText}</p>
      <ul>
        {array.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default FormatTest
