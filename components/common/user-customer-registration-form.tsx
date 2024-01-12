"use client";

import { User } from '@prisma/client';
import { TextInput } from '@tremor/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { getCurrentUserId } from "@/app/services/UserService";

interface UserRegistrationFormProps {
  submitting: boolean;
  userId: string | null | undefined;
  setUserId: (userId?: string) => void;
  setError: (error: string | null) => void;
}

const UserRegistrationForm = ({ submitting, userId, setUserId, setError }: UserRegistrationFormProps) => {
  const [userAttributes, setUserAttributes] = useState<Partial<User>>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedUser = { ...userAttributes, [name]: value } as User;
    setUserAttributes(updatedUser);
  };

  const handleSubmit = async () => {
    console.log('submitting user attributes', userAttributes);
    return true;
  }

  useEffect(() => {
    if (submitting && !userId) {
      handleSubmit()
        .then((success) => {
          if (success) {
            // FIXME: should be the following, instead of the stubbed method
            // register({ email: userAttributes.email }).then(setUserId).catch(console.error);
            getCurrentUserId().then(setUserId).catch(console.error);
          } else {
            setError('Error submitting user registration');
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [submitting]);
  
  if(userId) {
    return (<>
      <p>Already logged in</p>
    </>);
  } else return (
    <>
      <div className="items-center mb-4">
        <TextInput 
          name="name"
          onChange={handleInputChange}
          placeholder="Name" 
        />
      </div>
      <div className="items-center mb-4">
        <TextInput 
          name="email"
          onChange={handleInputChange}
          placeholder="Work Email" />
      </div>
      <div className="items-center">
        <TextInput 
          name="company"
          onChange={handleInputChange}
          placeholder="Company" />
      </div>
    </>
  );
}

export default UserRegistrationForm;