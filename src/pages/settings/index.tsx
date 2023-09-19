import { type NextPage } from "next";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/Button/Button";
import { type User } from "next-auth";
import { useSession } from "next-auth/react";
import { ProfilePicture } from "~/components/ProfilePicture/ProfilePicture";
import { useForm, type SubmitHandler } from "react-hook-form";
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/utils/api";

enum BUTTON_SIZES {
  xs = "px-2 py-1 text-xs",
  sm = "px-2 py-1 text-sm",
  md = "px-2.5 py-1.5 text-sm",
}

type Inputs = {
  name: string;
};

const SettingsComponent = ({ user }: { user: User }) => {
  const { update } = useSession();
  const { register, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues: {
      name: user.name ?? "",
    },
  });
  const u = api.user.update.useMutation({ onError: () => alert('error burh'), onSuccess: () => update()});
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { name } = data;
    u.mutate({ name, username: user?.name ?? ''  });
    setValue("name", name);
  };

  return (
    <div className="mx-auto bg-[#14181c] px-4 py-4 sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                This information will be displayed publicly so be careful what
                you share.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                        trywatchd.com/
                      </span>
                      <input
                        {...register("name")}
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="janesmith"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    {user?.image ? (
                      <ProfilePicture size={"list"} url={user?.image} />
                    ) : (
                      <UserCircleIcon
                        className="h-12 w-12 text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                    <Button
                      className={""}
                      onClick={() => update()}
                      label={"Change"}
                      size={BUTTON_SIZES.md}
                      variant={"secondary"}
                    />
                    <UploadButton
                      className=""
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res?.length > 0)
                          void update({ image: res[0]?.url });
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button
              className={""}
              label={"Cancel"}
              size={BUTTON_SIZES.md}
              variant={"secondary"}
            />

            <Button
              submit
              className={""}
              label={"Submit"}
              size={BUTTON_SIZES.md}
              variant={"primary"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const Settings: NextPage = () => {
  const { data: sessionData } = useSession();
  return sessionData?.user && <SettingsComponent user={sessionData?.user} />;
};

export default Settings;
