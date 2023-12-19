import Image from "next/image";

import {Flex, Button} from "@tremor/react";
import { cookies } from 'next/headers';


export default function LoginPage(req : any) {

  const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0]
  
  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      <Image
        alt="Platforms Starter Kit"
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/logo.png"
      />
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        Support site log in
      </h1>
      

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <Flex flexDirection="col" className="gap-4">
          <Flex>
            <label>Email</label>
            <input name="email" type="text" />
          </Flex>
        
          <Button type="submit">Sign in</Button>
        </Flex>
      </form>
      </div>
    </div>
  );
}
