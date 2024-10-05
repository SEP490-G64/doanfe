import Image from "next/image";
import React from "react";
import { FaPlus } from "react-icons/fa6";

function UploadImage() {
    return (
        <div className="border-gray-300 relative w-full rounded-lg border-2 border-dashed p-6" id="dropzone">
            <input type="file" className="absolute inset-0 z-50 h-full w-full opacity-0" />
            <div className="text-center">
                <FaPlus size={60} className="m-auto" />
                <label htmlFor="file-upload" className="relative cursor-pointer">
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="text-gray-500 mt-1 text-xs">PNG, JPG, GIF up to 10MB</p>
            </div>

            {/* <Image className="m-auto" src={"/images/no-image.png"} alt="product-image" width={180} height={180} /> */}
        </div>
    );
}

export default UploadImage;
