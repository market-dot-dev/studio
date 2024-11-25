"use client";

import Link from "next/link";
import Image from "next/image";
import { TextInput, Button } from "@tremor/react";
import { UsersRound, UserRound, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

export default function OnboardingForm() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-8">
      <div className="flex justify-center">
        <Image
          src="/gw-logo-nav.png"
          alt="Gitwallet Logo"
          className="h-16 w-16 shrink-0"
          height={48}
          width={48}
        />
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Welcome to Gitwallet
        </h1>
        <h2 className="text-2xl font-normal text-gray-900">
          Tell us about your business
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="block text-gray-900">Business Name</label>
          <TextInput placeholder="" className="bg-white" />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-900">Domain</label>
          <div className="flex items-center justify-between gap-4 rounded-tremor-default border border-tremor-border bg-white shadow-tremor-input">
            <TextInput
              placeholder=""
              className="rounded-r-none border-none bg-white shadow-none focus:border focus:border-gray-900"
            />
            <span className="py-2 pr-3 text-sm text-gray-400">
              .gitwallet.co
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Your landing page will live here (you can change this later).
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-baseline justify-between text-gray-900">
            Logo
            <span className="ml-2 text-xs text-gray-500">Optional</span>
          </label>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-100 p-10 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="mx-auto flex flex-col items-center">
              <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
              <div className="mt-3 text-xs text-gray-500">
                <p>Drag & drop a .png or .jpg</p>
                <p>
                  or{" "}
                  <button
                    onClick={handleFilePicker}
                    className="cursor-pointer underline"
                  >
                    add a file
                  </button>
                </p>
              </div>
              {file && (
                <p className="mt-2 text-gray-600">Selected: {file.name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-900">
            Where are you based out of?
          </label>
          <TextInput
            placeholder="Toronto, Canada"
            className="bg-white text-gray-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-900">
            Are you a team or independent?
          </label>
          <div className="space-y-2">
            <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
              <div className="flex cursor-pointer items-center justify-between rounded-tremor-default border bg-white p-4 shadow-sm [&:has(input:checked)]:border-gray-800 [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-gray-800">
                <div className="flex items-center">
                  <UsersRound className="mr-3 h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-900">
                    We&apos;re a team
                  </span>
                </div>
                <input
                  type="radio"
                  name="team-type"
                  className="text-gray-500 checked:text-gray-900 focus:outline-none"
                />
              </div>
            </label>
            <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
              <div className="flex cursor-pointer items-center justify-between rounded-tremor-default border bg-white p-4 shadow-sm [&:has(input:checked)]:border-gray-800 [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-gray-800">
                <div className="flex items-center">
                  <UserRound className="mr-3 h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-900">
                    It&apos;s just me
                  </span>
                </div>
                <input
                  type="radio"
                  name="team-type"
                  className="text-gray-500 checked:text-gray-900"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end pt-6">
        <Link href="/design/wizard/offerings">
          <Button className="bg-gray-900 text-white hover:bg-gray-800">
            Next
          </Button>
        </Link>
      </div>
    </div>
  );
}
