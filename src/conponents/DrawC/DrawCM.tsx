import { FC, useContext, useState } from "react"
import React from "react"
import { Button, Drawer } from "antd"
import "./drawMobile.css"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../pages/manager/RemindMobile/providers/ViahicleProvider"
interface DrawProps {
  button: React.ReactNode
  children: (data: { closeModal: any; data: any }) => React.ReactNode
  title: React.ReactNode
  width?: string | number
  data: any
}

const DrawCM: FC<DrawProps> = ({
  button,
  children,
  title,
  width = "100%",
  data,
}) => {
  const [open, setOpen] = useState(true)

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
      <div className="drawMobile" onClick={showDrawer}>
        {button}
      </div>
      {open && (
        <Drawer
          style={{ width: "100% !important" }}
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

export default DrawCM
