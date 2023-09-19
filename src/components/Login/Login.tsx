import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, StarIcon } from "@heroicons/react/20/solid";
import { Search } from "@mui/icons-material";
import { Rating } from "@mui/material";
import image from "next/image";
import { Button } from "react-day-picker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { DatePicker } from "../DatePicker/DatePicker";
import { Poster } from "../Poster/Poster";
import { signIn } from "next-auth/react";

interface LoginProps {
  modalIsOpen: boolean;
  /**
   * Optional click handler
   */
  newAccount?: boolean;
  onClick?: () => void;
  closeModal: () => void;
}

type FormData = {
  username: string;
  password: string;
};

/**
 * Renders form for logging in and signing into application.
 */
export const Login = ({
  closeModal,
  modalIsOpen,
  newAccount = false,
}: LoginProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(!newAccount);
  const { handleSubmit, register } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isLoggingIn) {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          password: data.password,
          username: data.username,
        });
        if (result?.ok) closeModal();
      } catch (error) {}
    } else {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            password: data.password,
            username: data.username,
          }),
        });

        if (!res?.ok) {
          return;
        }

        await signIn("credentials", {
          redirect: false,
          username: data.username,
          password: data.password,
        });
        closeModal();
      } catch (error) {}
    }
  };

  return (
    <Dialog
      as="div"
      open={modalIsOpen}
      className="relative z-50"
      onClose={closeModal}
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative transform rounded-lg bg-[#18181b] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="relative flex flex-row pr-4 sm:block">
            <button
              type="button"
              className="start-end rounded-md bg-[#18181b] text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => closeModal()}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              {isLoggingIn ? "Sign in to your account" : "Create your account"}
            </h2>
          </div>
          <div className="">
            <form
              className="space-y-6"
              onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    {...register("username")}
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    {...register("password")}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {isLoggingIn ? "Sign in" : "Create Account"}
                </button>
              </div>
              {isLoggingIn && (
                <div>
                  <button
                    onClick={() => setIsLoggingIn(false)}
                    className="font-regular text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Need to create an account?
                  </button>
                </div>
              )}
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
