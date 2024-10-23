"use client";

import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {sendResetRequest} from "@/services/authServices";
import { ForgotPasswordBody, ForgotPasswordType } from "@/lib/schemaValidate/authSchema";

function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordType>({
        resolver: zodResolver(ForgotPasswordBody),
        defaultValues: {
            email: ""
        },
    });

    const onSubmit = async (request: ForgotPasswordType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await sendResetRequest({ email: request.email }); // Đảm bảo gửi đúng định dạng

            if (response && response.message === "200 OK") {
                toast.success("Yêu cầu đặt lại mật khẩu đã được gửi, vui lòng check email");
            }
        } catch (error) {
            console.log(error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">Email nhận mã (tài khoản đăng
                        nhập của bạn)</label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Nhập email nhận mã"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className="mt-1 block w-full text-sm text-rose-500">{errors.email.message}</span>
                        )}

                        <span className="absolute right-4 top-4">
                            <svg
                                className="fill-current"
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g opacity="0.5">
                                    <path
                                        d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                        fill=""
                                    />
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="mb-5">
                    <input
                        type="submit"
                        value="Gửi yêu cầu"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-primary/90"
                    />
                </div>

                <div className="mt-6 text-center">
                    <p>
                        <Link href="/login" className="text-primary">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </div>
                <div className="mt-6 text-center">
                    <p>
                        Chưa có tài khoản?{" "}
                        <Link href="/register" className="text-primary">
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}

export default ForgotPasswordForm;
