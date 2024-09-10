import { FC } from "react";

interface CardCarProps {
  id?: number;
  license_plate: string;
  license: string;
  icons: any;
  weight?: string;
  isGPS?: boolean;
  showCheckbox?: boolean; // Hiển thị checkbox khi thả chuột
  checked?: boolean; // Trạng thái checkbox
  onCheckChange?: (checked: boolean) => void; // Hàm xử lý thay đổi checkbox
}

const CardCar: FC<CardCarProps> = ({
  license_plate,
  icons,
  weight,
  isGPS,
  showCheckbox,
  checked,
  onCheckChange,
}) => {
  return (
    <div className="item flex gap-10 items-center min-h-16">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckChange?.(e.target.checked)}
        />
      )}  
      {
        isGPS ? <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/109363404/365693590-2a89a2d4-db29-483f-9b54-3bfee4322816.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240909%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240909T143314Z&X-Amz-Expires=300&X-Amz-Signature=9b22f78ad2a7070fd53a4af2542b70c5f53edc5e285d222743aca3cfe3035ab3&X-Amz-SignedHeaders=host&actor_id=109363404&key_id=0&repo_id=854359927" alt="" />:
        <img src="" alt="" />
      }
      <div className="item-infor">
        <b>{license_plate}</b> (<span>{weight}</span>)
        <div className="flex gap-5">
          <span>Đang nhắc nhở</span>
        </div>
      </div>
    </div>
  );
};

export default CardCar;
