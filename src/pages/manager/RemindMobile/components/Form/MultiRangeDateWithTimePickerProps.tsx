import React, { useState, useEffect } from "react"
import { DatePicker, TimePicker, Button, Space, Row, Col, message } from "antd"
import { CloseOutlined } from "@ant-design/icons" // Import icon "X"
import moment from "moment"
// import 'antd/dist/antd.css';

const { RangePicker } = DatePicker

export interface DateTimeRange {
  start: number // timestamp
  end: number // timestamp
  time: string // time in HH:mm:ss
}

interface MultiRangeDateWithTimePickerProps {
  initialValues?: DateTimeRange[] // Giá trị ban đầu
}

const MultiRangeDateWithTimePicker: React.FC<
  MultiRangeDateWithTimePickerProps
> = ({ initialValues }) => {
  const [dateRanges, setDateRanges] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([]) // State để lưu lỗi

  useEffect(() => {
    if (initialValues) {
      const initialRanges = initialValues.map((item) => ({
        range: [moment(item.start), moment(item.end)], // Chuyển timestamp thành moment
        time: moment(item.time, "HH:mm:ss"), // Chuyển HH:mm:ss thành moment
      }))
      setDateRanges(initialRanges)
      setErrors(
        initialRanges.map(() => ({ rangeError: false, timeError: false })),
      ) // Khởi tạo state errors
    }
  }, [initialValues])

  const addRange = () => {
    setDateRanges([...dateRanges, { range: null, time: null }])
    setErrors([...errors, { rangeError: false, timeError: false }]) // Thêm error cho trường mới
  }

  const handleRangeChange = (index: number, range: any) => {
    const newRanges = [...dateRanges]
    newRanges[index].range = range
    setDateRanges(newRanges)

    const newErrors = [...errors]
    newErrors[index].rangeError = false // Xóa lỗi khi chọn ngày
    setErrors(newErrors)
  }

  const handleTimeChange = (index: number, time: any) => {
    const newRanges = [...dateRanges]
    newRanges[index].time = time
    setDateRanges(newRanges)

    const newErrors = [...errors]
    newErrors[index].timeError = false // Xóa lỗi khi chọn giờ
    setErrors(newErrors)
  }

  const removeRange = (index: number) => {
    const newRanges = dateRanges.filter((_, i) => i !== index)
    const newErrors = errors.filter((_, i) => i !== index)
    setDateRanges(newRanges)
    setErrors(newErrors)
  }

  const validateForm = () => {
    const newErrors = dateRanges.map((item) => ({
      rangeError: !item.range, // Kiểm tra nếu không chọn ngày
      timeError: !item.time, // Kiểm tra nếu không chọn giờ
    }))
    setErrors(newErrors)

    return newErrors.every((error) => !error.rangeError && !error.timeError)
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const selectedRangesWithTime = dateRanges
        .map((item) => {
          if (item.range && item.time) {
            // Lấy timestamp cho ngày bắt đầu và kết thúc
            const startTimeStamp = moment(item.range[0]).valueOf() // timestamp cho start date
            const endTimeStamp = moment(item.range[1]).valueOf() // timestamp cho end date

            // Format time theo HH:mm:ss
            const formattedTime = item.time.format("HH:mm")

            return {
              start: startTimeStamp,
              end: endTimeStamp,
              time: formattedTime,
            }
          }
          return null
        })
        .filter(Boolean) // Lọc các giá trị null

      console.log("Dữ liệu submit:", selectedRangesWithTime)
      message.success("Submit thành công!")
    } else {
      message.error("Vui lòng chọn đầy đủ ngày và giờ cho tất cả các trường!")
    }
  }

  return (
    <Space direction="vertical" size={12} className="ml-7 mb-10">
      {dateRanges.map((item, index) => (
        <Row key={index} gutter={16} align="middle">
          <Col>
            <RangePicker
              onChange={(range) => handleRangeChange(index, range)}
              value={item.range}
              placeholder={["Chọn ngày bắt đầu", "Chọn ngày kết thúc"]}
              style={errors[index]?.rangeError ? { borderColor: "red" } : {}}
            />
            {errors[index]?.rangeError && (
              <div style={{ color: "red" }}>Vui lòng chọn ngày</div>
            )}
          </Col>
          <Col>
            <TimePicker
              onChange={(time) => handleTimeChange(index, time)}
              value={item.time}
              placeholder="Chọn giờ"
              style={errors[index]?.timeError ? { borderColor: "red" } : {}}
              format="HH:mm:ss"
            />
            {errors[index]?.timeError && (
              <div style={{ color: "red" }}>Vui lòng chọn giờ</div>
            )}
          </Col>
          <Col>
            <Button
              type="link"
              icon={<CloseOutlined />}
              onClick={() => removeRange(index)}
              danger
            />
          </Col>
        </Row>
      ))}

      <Button type="dashed" onClick={addRange}>
        Thêm thời gian nhắc nhở
      </Button>

      {/* <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button> */}
    </Space>
  )
}

export default MultiRangeDateWithTimePicker
