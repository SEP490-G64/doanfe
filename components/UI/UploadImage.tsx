import { uploadFile } from "@/services/fileServices";
import Image from "next/image";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";

function UploadImage({
    sessionToken,
    urlImage,
    setValue,
}: {
    sessionToken: string;
    urlImage: string | undefined;
    setValue: any;
}) {
    const [isWrongType, setIsWrongType] = useState(false);
    const [isTooHeavy, setIsTooHeavy] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(urlImage);

    const uploadImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await uploadFile(formData, sessionToken);

            if (response && response.message === "200 OK") {
                setImageUrl(response.data);
                setValue("urlImage", response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const re = /(\.jpg|\.jpeg|\.png)$/i;
        if (file) {
            if (!re.exec(file.name)) setIsWrongType(true);
            else {
                setIsWrongType(false);
                if (file.size > 10240000) setIsTooHeavy(true);
                else {
                    setIsTooHeavy(false);
                    uploadImage(file);
                }
            }
        }
    };
    return (
        <div className="border-gray-300 relative w-full rounded-lg border-2 border-dashed p-6" id="dropzone">
            <input
                id="file-upload"
                name="file-upload"
                type="file"
                onChange={(e) => handleChange(e)}
                className="absolute inset-0 z-50 size-full cursor-pointer opacity-0"
            />
            {!imageUrl && (
                <div className="text-center">
                    <FaPlus size={60} className="m-auto" />
                    <label htmlFor="file-upload" className="relative"></label>
                    <p className="text-gray-500 mt-1 text-xs">PNG, JPG, JPEG up to 10MB</p>
                    {isWrongType && <p className="mt-1 text-xs text-danger">File không hợp lệ</p>}
                    {isTooHeavy && (
                        <p className="mt-1 text-xs text-danger">Vui lòng chọn file có dung lượng nhỏ hơn 10MB</p>
                    )}
                </div>
            )}

            {imageUrl && (
                <Image
                    className="m-auto"
                    src={imageUrl}
                    alt="product-image"
                    loader={() => imageUrl}
                    onError={() => {
                        setImageUrl("/images/no-image.png");
                    }}
                    width={180}
                    height={180}
                />
            )}
        </div>
    );
}

export default UploadImage;
