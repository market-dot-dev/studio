import Image from "next/image";

import {Flex, Button} from "@tremor/react";

export default function SignupPage(req: any) {
    
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
          Gitwallet
        </h1>
        <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
          Create & manage robust support tiers for your repos and ecosystems.<br />
        </p>
  
        <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
          <form method="post" action="/api/auth/signup"> {/* Change the action URL to your signup endpoint */}
            
            <Flex flexDirection="col" className="gap-4">
              <Flex>
                <label>Email</label>
                <input name="email" type="text" />
              </Flex>
            
              <Flex>
                <label>Password</label>
                <input name="password" type="password" />
              </Flex>
  
              <Flex>
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" />
              </Flex>
  
              <Button type="submit">Sign Up</Button>
            </Flex>
          </form>
        </div>
      </div>
    );
  }