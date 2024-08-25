"use client";
import { ExclamationCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleUpdateUserAttributes } from "@/lib/cognitoActions";
import useAuthUser from "@/app/hooks/use-auth-user";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { loadFile } from "@/utils/loadFile";

export default function UpdateProfileForm() {
  const user = useAuthUser();
  const [status, dispatch] = useFormState(handleUpdateUserAttributes, "");
  const profileImageRef = useRef<HTMLInputElement>(null);
  const uploadedImageRef = useRef<HTMLImageElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormDataChanged, setIsFormDataChanged] = useState(false);
  const [newImageUploaded, setNewImageUploaded] = useState<boolean>(false);

  const onFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.target;
    if (target.files) {
      loadFile(target, uploadedImageRef);
      setNewImageUploaded(true);
      setIsFormDataChanged(true);
    }
  };

  const handleReset = () => {
    console.log("reset");
    if (profileImageRef.current) profileImageRef.current.value = "";
    if (uploadedImageRef.current) uploadedImageRef.current.src = "";
    setNewImageUploaded(false);
    setIsFormDataChanged(false);
  };
  const onProfileClick = () => {
    profileImageRef?.current?.click();
  };

  console.log(formRef?.current?.dataset);
  return (
    <form
      ref={formRef}
      className="rounded p-4 w-full bg-ternary"
      action={dispatch}
    >
      <div className="rounded-md  p-4 md:p-6">
        <div className="mb-4">
          <div
            onClick={onProfileClick}
            className="relative h-[120px] w-[120px] flex justify-center items-center mx-auto aspect-square"
          >
            {user?.picture && !newImageUploaded ? (
              <Image
                fill
                className="object-cover cursor-pointer  rounded-[50%]"
                src={user?.picture || ""}
                alt="profile image"
              />
            ) : (
              <>
                <Image
                  fill
                  className={`object-cover cursor-pointer  rounded-[50%] ${
                    newImageUploaded ? "" : "hidden"
                  }`}
                  src={""}
                  ref={uploadedImageRef}
                  alt="uploaded image"
                />
                <div
                  className={`inline cursor-pointer rounded-[50%] ${
                    newImageUploaded ? "hidden" : ""
                  }`}
                >
                  <UserIcon height={80} width={80} />
                </div>
              </>
            )}

            <div className="absolute group z-10 h-[120px] w-[120px] rounded-[50%] bg-transparent hover:bg-[rgba(0,0,0,0.32)] ">
              <CameraIcon
                color="white"
                className="absolute invisible h-full left-0 right-0 mx-auto text-center group-hover:visible"
                width={25}
              />
            </div>
          </div>
          <input
            ref={profileImageRef}
            name="profileImage"
            id="profileImage"
            onChange={onFileUpload}
            type="file"
            hidden
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2  block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                ref={nameRef}
                id="name"
                type="text"
                name="name"
                minLength={4}
                onChange={(e) => {
                  if (e.target.value !== user?.name) {
                    setIsFormDataChanged(true);
                  }
                }}
                placeholder="Enter your name"
                required
                defaultValue={user?.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500  peer-focus:text-gray-900 " />
            </div>
            <div>
              <input
                id="current_name"
                className=""
                type="hidden"
                name="current_name"
                defaultValue={user?.name}
              />
            </div>
          </div>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === "error" && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">
                There was an error updating name.
              </p>
            </>
          )}
          {status === "success" && (
            <p className="text-sm text-green-500">
              Name has been updated successfully.
            </p>
          )}
        </div>
      </div>

      <div className="mt-1 flex justify-center gap-4">
        <UpdateButton />
        <ResetButton
          handleReset={handleReset}
          formDataChanged={isFormDataChanged}
        />
      </div>
    </form>
  );
}

function UpdateButton() {
  const { pending } = useFormStatus();
  return <Button aria-disabled={pending}>Update</Button>;
}
function ResetButton({ ...props }) {
  const { formDataChanged, handleReset } = props;
  return (
    <Button type="reset" onClick={handleReset} aria-disabled={!formDataChanged}>
      Reset
    </Button>
  );
}
