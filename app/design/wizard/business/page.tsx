"use client";

import Image from "next/image";
import { TextInput, Button } from "@tremor/react";
import { UsersRound, UserRound, Image as ImageIcon } from "lucide-react";
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
    <div className="w-full max-w-lg space-y-8">
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
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
          Welcome to Gitwallet
        </h1>
        <h2 className="text-2xl font-normal text-stone-900">
          Tell us about your business
        </h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-stone-900">Business Name</label>
          <TextInput
            placeholder=""
            className="border-0 bg-white shadow-sm ring-1 ring-black/10"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-stone-900">Domain</label>
          <TextInput
            placeholder=""
            className="border-0 bg-white shadow-sm ring-1 ring-black/10"
          />
          <p className="text-sm text-stone-500">
            Your landing page will live here (you can change this later).
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-baseline justify-between text-stone-900">
            Logo
            <span className="ml-2 text-xs text-stone-500">Optional</span>
          </label>
          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-100 p-10 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="mx-auto flex flex-col items-center">
              <ImageIcon className="mx-auto h-6 w-6 text-stone-400" />
              <div className="mt-3 text-xs text-stone-500">
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
                <p className="mt-2 text-stone-600">Selected: {file.name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-stone-900">
            Where are you based out of?
          </label>
          <TextInput
            placeholder="Toronto, Canada"
            className="border-0 bg-white shadow-sm ring-1 ring-black/10"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-stone-900">
            Are you a team or independent?
          </label>
          <div className="space-y-2">
            <label className="block w-full">
              <div className="flex cursor-pointer items-center justify-between rounded-tremor-default bg-white p-3 shadow-sm ring-1 ring-black/10 hover:bg-stone-50">
                <div className="flex items-center">
                  <UsersRound className="mr-3 h-5 w-5 text-stone-500" />
                  <span className="text-stone-900">We&apos;re a team</span>
                </div>
                <input
                  type="radio"
                  name="team-type"
                  className="text-stone-500 checked:text-stone-900"
                />
              </div>
            </label>
            <label className="block w-full">
              <div className="flex cursor-pointer items-center justify-between rounded-tremor-default bg-white p-3 shadow-sm ring-1 ring-black/10 hover:bg-stone-50">
                <div className="flex items-center">
                  <UserRound className="mr-3 h-5 w-5 text-stone-500" />
                  <span className="text-stone-900">It&apos;s just me</span>
                </div>
                <input
                  type="radio"
                  name="team-type"
                  className="text-stone-500 checked:text-stone-900"
                  defaultChecked
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="light" className="text-stone-600">
          Back
        </Button>
        <Button className="bg-stone-900 text-white hover:bg-stone-800">
          Next
        </Button>
      </div>
    </div>
  );
}
