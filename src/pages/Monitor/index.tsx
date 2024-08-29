import { memo } from "react"

export const MonitorMemo: React.FC = memo(() => {
  return (
    <>
      <div className="h-full flex flex-col relative overflow-hidden">
          xin chao
          <div>
       
          </div>
      </div>
    </>
  )
})

export const Monitor: React.FC = memo(() => {
  return <MonitorMemo />
})
