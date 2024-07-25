import { roboto } from "@/ui/fonts";
import UpdateProfileForm from "@/ui/profile-settings/update-profile-form";
import UpdatePasswordForm from "@/ui/profile-settings/update-password-form";
import UpdateEmailForm from "@/ui/profile-settings/update-email-form";

export default function Profile() {
  return (
    <main className="">
      <div className="flex w-full items-center justify-between mb-4">
        <h1 className={`${roboto.className} text-2xl`}>Profile Settings</h1>
      </div>
      <div className="flex flex-col bg-[#3c3c3c] p-2 md:py-4 md:px-8 rounded-lg ">
        <div className="flex items-center flex-col md:flex-row justify-start mb-8 gap-8">
          <UpdateEmailForm />
          <UpdateProfileForm />
        </div>
        <div className="md:w-fit">
          <UpdatePasswordForm />
        </div>
      </div>
    </main>
  );
}
