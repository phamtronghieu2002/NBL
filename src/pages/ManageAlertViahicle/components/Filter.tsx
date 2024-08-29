import { FC } from "react"
import { Select } from "antd"
import { FilterOutlined } from "@ant-design/icons"
interface FilterViahicleProps {
  onFilter: (data: any) => void
}

const FilterViahicle: FC<FilterViahicleProps> = ({ onFilter }) => {
  const onChange = (value: string) => {
    onFilter(value)
  }

  const onSearch = (value: string) => {
    onFilter(value)
  }
  return (
    <div className="flex justify-end items-center mb-4">
      <label htmlFor="">
        <FilterOutlined />
      </label>
      <Select
        defaultValue={"3"}
        className="w-[130px]"
        showSearch
        placeholder="Select a person"
        optionFilterProp="label"
        onChange={onChange}
        onSearch={onSearch}
        options={[
          {
            value: "1",
            label: "Có gps",
          },
          {
            value: "0",
            label: "Không có gps",
          },
          {
            value: "3",
            label: "Tất cả",
          },
        ]}
      />
    </div>
  )
}

export default FilterViahicle
