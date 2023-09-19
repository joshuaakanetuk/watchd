import React, { useState, type ReactNode } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Search } from "./WatchModalSearch";
import { type SingleValue } from "react-select";
import { Poster } from "../Poster/Poster";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";

import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { DatePicker } from "../DatePicker/DatePicker";
import { Button } from "../Button/Button";
import { DayPicker } from "react-day-picker";
import { api } from "~/utils/api";

const image = "https://image.tmdb.org/t/p/w342";
interface WatchModalProps {
  label?: string;
  modalIsOpen: boolean;
  children?: ReactNode;
  closeModal: () => void;
}

enum INPUT_VARIANTS {
  text = "text",
  search = "search",
}

enum BUTTON_SIZES {
  xs = "px-2 py-1 text-xs",
  sm = "px-2 py-1 text-sm",
  md = "px-2.5 py-1.5 text-sm",
}

type Option = {
  poster: string;
  year: string;
  label: string;
  value: number;
  id: string;
  type: string;
};

type FormData = {
  rating: number;
  review: string;
  tmdbId: string;
  dateCreated: Date;
};

/**
 * Primary UI component for user interaction
 */
export const WatchModal = ({ modalIsOpen, closeModal }: WatchModalProps) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const [media, setMedia] = useState<Option>();

  const utils = api.useContext();
  const mutation = api.example.createWatch.useMutation();
  api.media.get.useQuery({ id: String(media?.value), type: media?.type == 'tv' ? 'tv' : 'film'}, { enabled: !!media });
  const handleOnClick =  (newValue: SingleValue<Option>) => {
    if (newValue) {
      setMedia(newValue);
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      mutation.mutate({ ...data, rating: Number(data.rating) });
      void utils.user.getProfile.invalidate();
      closeModal();
    } catch (error) {}
  };
  return (
    <Dialog
      as="div"
      open={modalIsOpen}
      className="relative z-50"
      onClose={closeModal}
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      {/* Container for modal */}
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
          <div className="flex flex-col gap-3">
            <Search handleOnClick={handleOnClick} />
            {media && (
              <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
                <input
                  {...register("tmdbId")}
                  className="hidden"
                  value={media?.id}
                />
                <div className="flex flex-row gap-4 text-white">
                  <div className="flex flex-row">
                    <Poster
                      url={image + media?.poster}
                      size="default"
                      progress={0}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-4">
                    <span className="font-[Lora] text-2xl font-bold">
                      {media?.label + " (" + media?.year + ")"}
                    </span>
                    <Controller
                      control={control}
                      name="dateCreated"
                      defaultValue={undefined}
                      render={({ field }) => (
                        <DatePicker {...control} {...field} />
                      )}
                    />
                    <textarea
                      {...register("review")}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />

                    <Controller
                      control={control}
                      name="rating"
                      defaultValue={0}
                      render={({ field: { value, onChange } }) => (
                        <Rating
                          value={value}
                          precision={1}
                          readOnly={false}
                          onChange={onChange}
                          emptyIcon={
                            <StarIcon style={{ fill: "white", opacity: 0.7 }} />
                          }
                        />
                      )}
                    />
                    <Button
                      className={""}
                      submit
                      label={"Save"}
                      size={BUTTON_SIZES.xs}
                      variant={"primary"}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
