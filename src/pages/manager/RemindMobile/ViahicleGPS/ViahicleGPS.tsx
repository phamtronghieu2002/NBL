import { FC, useState, useRef, useEffect } from "react"
import React from "react"
import { Button } from "antd"
import { ViahicleType } from "../../../../interface/interface"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../providers/ViahicleProvider"
import { TableCM } from "../../../../conponents/TableCM/TableCM"
import CardCar from "../components/Card/CardCar"
import ModalCreateRemindMobile from "../../../../conponents/modals/ModalCreateRemindMobile"
import { PlusCircleOutlined } from "@ant-design/icons"

interface ViahicleGPSType {
  viahicles: ViahicleType[]
}

const ViahicleGPS: FC<ViahicleGPSType> = ({ viahicles }) => {
  const { dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  const [selectedItems, setSelectedItems] = useState<any>([])
  const [showCheckbox, setShowCheckbox] = useState(false) // Hiển thị checkbox khi thả chuột
  const [isSelecting, setIsSelecting] = useState(false) // Trạng thái nhấn giữ chuột
  const [selectAll, setSelectAll] = useState(false) // Trạng thái chọn tất cả

  const containerRef = useRef<HTMLDivElement>(null)

  // Hàm handle khi check/uncheck checkbox
  const handleCheck = (id: number, checked: boolean) => {
    setSelectedItems((prevSelected: any) =>
      checked
        ? [...prevSelected, id]
        : prevSelected.filter((itemId: any) => itemId !== id),
    )
  }

  // Bắt đầu chọn khi nhấn giữ chuột
  const handleMouseDown = (id: number) => {
    setIsSelecting(true) // Bắt đầu quá trình chọn item
  }

  // Kết thúc chọn khi thả chuột
  const handleMouseUp = (id: number) => {
    if (isSelecting) {
      setShowCheckbox(true) // Hiển thị checkbox sau khi thả chuột
      handleCheck(id, true) // Chọn item ngay khi thả chuột
    }
    setIsSelecting(false) // Kết thúc quá trình chọn
  }

  // Xử lý click ra ngoài, ẩn checkbox và reset trạng thái
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setShowCheckbox(false) // Ẩn checkbox khi click ra ngoài
      setSelectedItems([]) // Reset các item đã chọn
      setSelectAll(false) // Reset nút "Chọn tất cả"
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Xử lý nút reload
  const onReload = () => {
    dispatch.freshKey()
  }

  // Xử lý khi bấm nút "Chọn tất cả"
  const handleSelectAll = () => {
    if (selectAll) {
      // Nếu đã chọn tất cả, bỏ chọn
      setSelectedItems([])
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả item
      setSelectedItems(viahicles.map((item) => item.id))
    }
    setSelectAll(!selectAll) // Đảo trạng thái "Chọn tất cả"
    setShowCheckbox(true) // Hiển thị checkbox khi chọn tất cả
  }

  return (
    <div
      className="mt-5"
      onMouseUp={() => setIsSelecting(false)} // Kết thúc quá trình chọn nhiều item
      ref={containerRef} // Tham chiếu container để xử lý click ra ngoài
    >
      <ModalCreateRemindMobile
        button={
          <Button type="primary" className="ml-2" icon={<PlusCircleOutlined />}>
            Thêm
          </Button>
        }
      />

      {/* Nút Chọn Tất Cả */}
      {showCheckbox && ( // Chỉ hiển thị nút "Chọn tất cả" khi checkbox đang được hiển thị
        <Button onClick={handleSelectAll} style={{ marginBottom: 16 }}>
          {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </Button>
      )}

      <TableCM
        checkBox
        title="123"
        hiddenTitle={true}
        onReload={onReload}
        search={{
          width: 200,
          onSearch(q) {
            dispatch.setKeyword(q)
          },
          limitSearchLegth: 3,
        }}
        right={<></>}
        props={{}}
      >
        {viahicles.map((item: any) => {
          return (
            <div
              key={item.id}
              onMouseDown={() => handleMouseDown(item.id)} // Nhấn chuột để bắt đầu chọn
              onMouseUp={() => handleMouseUp(item.id)} // Thả chuột để hiển thị checkbox và chọn item
              className="item-container"
            >
              <CardCar
                weight="Ô tô có tải trọng 5000 tấn"
                isGPS
                {...item}
                showCheckbox={showCheckbox} // Hiển thị checkbox khi người dùng nhấn giữ và thả chuột
                checked={selectedItems.includes(item.id)} // Trạng thái checkbox
                onCheckChange={(checked) => handleCheck(item.id, checked)} // Xử lý thay đổi trạng thái checkbox
              />
            </div>
          )
        })}
      </TableCM>
    </div>
  )
}

export default ViahicleGPS
