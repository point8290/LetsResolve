"use client";

import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleArticleCreate, handleArticleUpdate } from "@/lib/articleAction";
import {
  ArrowRightIcon,
  DocumentIcon,
  AtSymbolIcon,
  FolderIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Article from "@/lib/model/Article";
import { useEffect, useRef } from "react";

export default function ArticleForm({
  isEditForm,
  article,
}: {
  isEditForm: boolean;
  article: Article | undefined;
}) {
  const [errorMessage, dispatch] = useFormState(
    async (prevState: string | undefined, formData: FormData) => {
      if (isEditForm) {
        return await handleArticleUpdate(
          prevState,
          formData,
          article?.ArticleId || ""
        );
      } else {
        return await handleArticleCreate(prevState, formData);
      }
    },
    undefined
  );
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const authorRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const updateFormData = (article: Article) => {
      if (titleRef.current) titleRef.current.value = article.Title;
      if (descriptionRef.current)
        descriptionRef.current.value = article.Description || "";
      if (authorRef.current) authorRef.current.value = article.Author;
    };
    if (article) {
      updateFormData(article);
    }
  });

  return (
    <form
      action={dispatch}
      className="md:w-1/2 md:px-0 px-4 mt-8 mx-auto space-y-3"
    >
      <div className="flex-1 rounded-lg bg-ternary px-6 pb-4 pt-8">
        <h1 className={`mb-3 font-semibold text-center text-xl`}>
          {isEditForm ? "Edit Article" : "Create a article"}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="title"
            >
              Title
            </label>
            <div className="relative">
              <input
                className="peer block  w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="title"
                type="text"
                name="title"
                minLength={4}
                placeholder="Enter title"
                required
                ref={titleRef}
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="email"
            >
              Author
            </label>
            <div className="relative">
              <input
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="email"
                type="email"
                name="author"
                ref={authorRef}
                placeholder="Enter email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="description"
            >
              Description
            </label>
            <div className="relative">
              <textarea
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="description"
                name="description"
                ref={descriptionRef}
                placeholder="Enter description"
                required
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="attachment"
            >
              Attachments
            </label>
            <div className="relative">
              <input
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="attachments"
                type="file"
                name="attachments"
              />
              <FolderIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <SubmitArticleButton isEditForm={isEditForm} />
        <div className="flex h-8 items-end space-x-1">
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function SubmitArticleButton({ isEditForm }: { isEditForm: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {isEditForm ? "Edit Article" : "Create Article"}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
