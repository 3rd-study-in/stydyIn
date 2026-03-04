import { useState } from 'react'

/**
 * 배열 항목을 추가/제거하는 범용 hook
 *
 * @param {Array}    initialItems  초기 항목 배열
 * @param {Function} keyFn         항목 고유 키 추출 함수 (기본값: item.id)
 * @returns {{ items, toggle, remove, setItems }}
 */
function useToggleList(initialItems = [], keyFn = (item) => item.id) {
  const [items, setItems] = useState(initialItems)

  // 있으면 제거, 없으면 추가
  const toggle = (item) =>
    setItems((prev) =>
      prev.some((i) => keyFn(i) === keyFn(item))
        ? prev.filter((i) => keyFn(i) !== keyFn(item))
        : [...prev, item]
    )

  // key 값으로 특정 항목 제거
  const remove = (key) =>
    setItems((prev) => prev.filter((i) => keyFn(i) !== key))

  return { items, toggle, remove, setItems }
}

export default useToggleList

// ── 사용 예시 ──────────────────────────────────────────────────────────────────
// import useToggleList from '@/shared/hooks/useToggleList'
//
// const { items: tags, toggle, remove, setItems } = useToggleList(initialTags)
//
// toggle({ id: 1, name: 'Python' })   → 없으면 추가, 있으면 제거
// remove(1)                           → id=1인 항목 제거
// setItems([])                        → 전체 초기화
//
// 커스텀 keyFn 예시:
// useToggleList(items, (item) => item.name)  → name 기준으로 중복 판단
