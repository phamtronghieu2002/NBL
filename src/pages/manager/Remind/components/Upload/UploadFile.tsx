import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal, Table } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import * as XLSX from 'xlsx';

interface UploadExelProps {
  setIsUpload: any
}

const UploadExel: React.FC<UploadExelProps> = ({ setIsUpload }) => {
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const handlePreview = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (typeof data === 'string') {
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Generate columns for the Ant Design table
        const columns = jsonData[0].map((col: string, index: number) => ({
          title: col,
          dataIndex: `col${index}`,
          key: `col${index}`,
        }));

        // Generate data for the Ant Design table
        const dataSource = jsonData.slice(1).map((row: any[], rowIndex: number) => {
          const rowData: { [key: string]: any } = { key: rowIndex };
          row.forEach((cell, cellIndex) => {
            rowData[`col${cellIndex}`] = cell;
          });
          return rowData;
        });

        setTableColumns(columns);
        setTableData(dataSource);

        // Set the upload state to true after successful preview
        setIsUpload(true);

        Modal.info({
          title: `Preview of ${file.name}`,
          content: (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{ y: 400 }}
            />
          ),
          width: 800,
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const props: UploadProps = {
    beforeUpload: (file: RcFile) => {
      const isExcel =
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('You can only upload Excel files!');
        return Upload.LIST_IGNORE;
      }
      handlePreview(file); // Preview the file directly after selection
      return false; // Prevent automatic upload
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Tải file Excel lên</Button>
    </Upload>
  );
};

export default UploadExel;
