"use client";
import { ExclamationCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleUpdateUserAttributes } from "@/lib/cognitoActions";
import useAuthUser from "@/app/hooks/use-auth-user";
import { useRef, useState, ChangeEvent } from "react";
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
    if (profileImageRef.current) profileImageRef.current.value = "";
    if (uploadedImageRef.current) uploadedImageRef.current.src = "";
    setNewImageUploaded(false);
    setIsFormDataChanged(false);
  };
  const onProfileClick = () => {
    profileImageRef?.current?.click();
  };

  return (
    <form ref={formRef} className="card p-6" action={dispatch}>
      <div className="mb-6">
        <div
          onClick={onProfileClick}
          className="group relative mx-auto flex h-[110px] w-[110px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-accent-soft"
        >
          {user?.picture && !newImageUploaded ? (
            <Image
              fill
              className="object-cover"
              src={user?.picture || ""}
              alt="profile image"
            />
          ) : (
            <>
              <Image
                fill
                className={`object-cover ${newImageUploaded ? "" : "hidden"}`}
                src={""}
                ref={uploadedImageRef}
                alt="uploaded image"
              />
              <UserIcon
                className={`h-14 w-14 text-accent ${newImageUploaded ? "hidden" : ""}`}
              />
            </>
          )}

          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
            <CameraIcon className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
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

      <div>
        <label htmlFor="name" className="field-label">
          Name
        </label>
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
            className="peer field-input"
          />
          <UserIcon className="field-icon" />
        </div>
        <input
          id="current_name"
          type="hidden"
          name="current_name"
          defaultValue={user?.name}
        />
      </div>

      <div
        className="mt-3 flex min-h-[20px] items-center"
        aria-live="polite"
        aria-atomic="true"
      >
        {status === "error" && (
          <div className="form-error">
            <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
            <p>There was an error updating name.</p>
          </div>
        )}
        {status === "success" && (
          <p className="form-success">Name has been updated successfully.</p>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-3">
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
    <Button
      type="reset"
      variant="ghost"
      onClick={handleReset}
      aria-disabled={!formDataChanged}
      className="border border-separator"
    >
      Reset
    </Button>
  );
}
