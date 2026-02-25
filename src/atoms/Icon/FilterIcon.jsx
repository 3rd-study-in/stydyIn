import FilterSvg from '../../asset/icons/common/icon-filter.svg?react'

function FilterIcon({ color = '#47494D', size = 20 }) {
  return <FilterSvg width={size} height={size} style={{ color }} aria-hidden="true" />
}

export default FilterIcon
