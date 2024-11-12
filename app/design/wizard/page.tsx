"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { UserRound, UsersRound, Upload } from "lucide-react";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const stepTitles = [
    "Is it just you or are you in a team?",
    "Step 1: Business Information",
    "Step 2: What You're Selling",
    "Confirmation",
  ];
  const [formData, setFormData] = useState({
    userType: "",
    sellingOptions: [],
    otherSelling: "",
    businessName: "",
    businessImage: null,
    githubOrg: "",
  });
  const [isStepValid, setIsStepValid] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    validateStep();
  }, [formData, step]);

  const validateStep = () => {
    switch (step) {
      case 1:
        setIsStepValid(!!formData.userType);
        break;
      case 2:
        setIsStepValid(!!formData.businessName);
        break;
      case 3:
        setIsStepValid(
          formData.sellingOptions.length > 0 || !!formData.otherSelling,
        );
        break;
      default:
        setIsStepValid(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      sellingOptions: prev.sellingOptions.includes(option)
        ? prev.sellingOptions.filter((item) => item !== option)
        : [...prev.sellingOptions, option],
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, businessImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    handleNext();
  };

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "30%" : "-30%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "30%" : "-30%",
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  };

  return (
    <div className="flex min-h-screen justify-center bg-stone-100 px-6 py-12 text-stone-900">
      <div className="w-full max-w-lg">
        <div>
          <LayoutGroup>
            {step === 1 ? (
              <motion.div
                className="mt-4 flex flex-col items-center"
                layoutId="logo"
              >
                <div className="mb-9 flex flex-col items-center gap-6">
                  <div className="flex items-end">
                    <img
                      src="/gw-logo-nav.png"
                      alt="Gitwallet Logo"
                      className="h-16 w-16 shrink-0"
                    />
                    <img
                      src="/bc-avatar.jpg?height=48&width=48"
                      alt="User"
                      className="z-10 -mb-1 -ml-8 h-9 w-9 rounded-full border-[3px] border-stone-100"
                    />
                  </div>
                  {/* <p className="text-center text-sm text-stone-500">
                    Welcome to Gitwallet, let's get you set up
                  </p> */}
                </div>
                <h2 className="mb-4 text-balance text-center text-4xl font-bold tracking-tight">
                  {stepTitles[step - 1]}
                </h2>
              </motion.div>
            ) : step <= totalSteps ? (
              <motion.div className="mt-4 flex justify-center space-x-2" layout>
                {[...Array(totalSteps)].map((_, index) => (
                  <motion.div
                    key={index}
                    layoutId={index === 0 ? "logo" : `step-${index}`}
                    className={`h-2 w-2 rounded-full ${
                      index + 1 <= step ? "bg-stone-900" : "bg-stone-300"
                    }`}
                  />
                ))}
              </motion.div>
            ) : null}
          </LayoutGroup>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <AnimatePresence custom={direction} mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={stepVariants}
                  initial={false}
                  animate="center"
                  exit="exit"
                  transition={transition}
                >
                  <div className="flex max-w-3xl grid-cols-1 flex-col gap-6 md:grid-cols-2">
                    <label className="group relative block cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="individual"
                        checked={formData.userType === "individual"}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            userType: "individual",
                          }))
                        }
                        className="peer sr-only"
                      />
                      <div className="flex justify-between items-center gap-6 rounded-lg bg-white p-6 shadow ring-1 ring-black/5 transition-all duration-200 hover:border-blue-200 peer-checked:border-marketing-swamp">
                        <div className="">
                          <div className="mb-4">
                            <UserRound className="h-6 w-6 text-stone-400" />
                          </div>
                          <h3 className="text-xl font-semibold">
                            Independent Developers
                          </h3>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-stone-300 transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-500">
                          <div className="h-3 w-3 rounded-full bg-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"></div>
                        </div>
                      </div>
                    </label>

                    <label className="group relative block cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="team"
                        checked={formData.userType === "team"}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, userType: "team" }))
                        }
                        className="peer sr-only"
                      />
                      <div className="rounded-lg border-2 p-6 transition-all duration-200 hover:border-blue-200 peer-checked:border-blue-500 peer-checked:shadow-lg">
                        <div className="mb-4">
                          <UsersRound className="h-7 w-7 text-stone-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">
                          Development Shops
                        </h3>
                        <p className="mb-6 text-stone-500">
                          Scale up & manage your business
                        </p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="businessName"
                        className="block text-sm font-medium text-stone-700"
                      >
                        Business Name
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="businessImage"
                        className="block text-sm font-medium text-stone-700"
                      >
                        Business Image
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <input
                          id="businessImage"
                          name="businessImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("businessImage").click()
                          }
                          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <Upload className="mr-2 inline-block h-4 w-4" />
                          Upload Image
                        </button>
                        {formData.businessImage && (
                          <img
                            src={formData.businessImage}
                            alt="Business"
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="githubOrg"
                        className="block text-sm font-medium text-stone-700"
                      >
                        GitHub Organization
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          id="githubOrg"
                          name="githubOrg"
                          value={formData.githubOrg}
                          onChange={handleInputChange}
                          className="block w-full flex-1 rounded-none rounded-l-md border-stone-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm"
                        />
                        <button
                          type="button"
                          className="inline-flex items-center rounded-r-md border border-l-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-500"
                        >
                          <Github className="h-5 w-5" />
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                >
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-stone-700">
                      What are you selling?
                    </label>
                    {["Physical Products", "Digital Products", "Services"].map(
                      (option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            id={option}
                            checked={formData.sellingOptions.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                            className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={option}
                            className="ml-2 block text-sm text-stone-900"
                          >
                            {option}
                          </label>
                        </div>
                      ),
                    )}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="nothingYet"
                        checked={formData.sellingOptions.includes(
                          "Nothing yet",
                        )}
                        onChange={() => handleCheckboxChange("Nothing yet")}
                        className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="nothingYet"
                        className="ml-2 block text-sm text-stone-900"
                      >
                        Nothing yet
                      </label>
                    </div>
                    <textarea
                      placeholder="Other (please specify)"
                      name="otherSelling"
                      value={formData.otherSelling}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                >
                  <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-bold">You're all set!</h2>
                    <p>Thank you for completing the onboarding process.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
        <div className="flex justify-between">
          {step > 1 && step <= totalSteps && (
            <button
              type="button"
              onClick={handlePrevious}
              className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Previous
            </button>
          )}
          {step < totalSteps && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid}
              className={`justify-self-end rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                !isStepValid && "cursor-not-allowed opacity-50"
              }`}
            >
              Next
            </button>
          )}
          {step === totalSteps && (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isStepValid}
              className={`rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                !isStepValid && "cursor-not-allowed opacity-50"
              }`}
            >
              Submit
            </button>
          )}
          {step > totalSteps && (
            <button
              type="button"
              onClick={() => console.log("Onboarding completed")}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
