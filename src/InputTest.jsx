import { useState } from 'react'
import { Input } from './atoms/Input'

function InputTest() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('홍길동')

  return (
    <div className="p-10 flex flex-col gap-6">
      <Input 
        placeholder="스터디 제목 입력" 
        maxLength={50}
        value={text1}
        onChange={setText1}
      />

      <Input 
        label="이름" 
        required 
        value={text2}
        onChange={setText2}
      />

    </div>
  )
}

export default InputTest