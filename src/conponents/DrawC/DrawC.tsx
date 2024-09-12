import { FC, useContext, useState } from "react"
import React from "react"
import { Button, Drawer } from "antd"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../pages/manager/Remind/providers/ViahicleProvider"
interface DrawProps {
  button: React.ReactNode
  children: (data: { closeModal: any; data: any }) => React.ReactNode
  title: React.ReactNode
  width?: string | number
  data: any
}

const DrawC: FC<DrawProps> = ({
  button,
  children,
  title,
  width = "80%",
  data,
}) => {
  const [open, setOpen] = useState(false)

  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
    dispatch?.setViahicle?.([])
  }
  return (
    <>
      <div onClick={showDrawer}>{button}</div>
      {open && (
        <Drawer
          width={width}
          title={title}
          placement="right"
          onClose={onClose}
          open={open}
        >
          {children({ closeModal: onClose, data: data })}
        </Drawer>
      )}
    </>
  )
}

export default DrawC
