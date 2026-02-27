function CategoryIcon({ icon: Icon, label, className = '' }) {
  return (
    <div className={`flex flex-col items-center w-[70px] ${className}`}>
      <div className="w-[70px] h-[70px] rounded-[12px] bg-bg-muted flex items-center justify-center">
        <Icon className="w-[60px] h-[60px]" />
      </div>
      <span className="mt-[13px] text-sm text-text">{label}</span>
    </div>
  )
}

export default CategoryIcon