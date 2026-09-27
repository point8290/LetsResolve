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
} from "@heroicons/react/24/outline";
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
    <form action={dispatch} className="mx-auto mt-8 max-w-xl px-4 md:px-0">
      <div className="card p-6">
        <h1 className="font-display text-xl font-semibold text-typography">
          {isEditForm ? "Edit article" : "Create an article"}
        </h1>

        <div className="mt-5 w-full space-y-4">
          <div>
            <label className="field-label" htmlFor="title">
              Title
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="title"
                type="text"
                name="title"
                minLength={4}
                placeholder="Enter title"
                required
                ref={titleRef}
              />
              <DocumentIcon className="field-icon" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="email">
              Author
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="email"
                type="email"
                name="author"
                ref={authorRef}
                placeholder="Enter email address"
                required
              />
              <AtSymbolIcon className="field-icon" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="description">
              Description
            </label>
            <div className="relative">
              <textarea
                className="peer field-textarea pl-10"
                id="description"
                name="description"
                ref={descriptionRef}
                placeholder="Enter description"
                rows={5}
                required
              />
              <DocumentTextIcon className="field-icon top-6" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="attachment">
              Attachments
            </label>
            <div className="relative">
              <input
                className="peer field-input file:mr-3 file:rounded-md file:border-0 file:bg-shadow file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-typography"
                id="attachments"
                type="file"
                name="attachments"
              />
              <FolderIcon className="field-icon" />
            </div>
          </div>
        </div>

        <SubmitArticleButton isEditForm={isEditForm} />
        <div
          className="mt-3 flex min-h-[20px] items-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <div className="form-error">
              <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function SubmitArticleButton({ isEditForm }: { isEditForm: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      {isEditForm ? "Save changes" : "Create article"}
      <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
