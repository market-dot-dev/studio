# Cross-Domain Authentication Between Next.js and Rails

This document outlines how to share authentication between the Next.js app at market.dev and the Rails app at explore.market.dev.

## Overview

The approach uses the Next.js app (which uses NextAuth.js) as the primary authentication source, and provides API endpoints that the Rails app can use to verify a user's session.

## How It Works

1. Users log in on the Next.js app (market.dev)
2. NextAuth.js creates a session and stores it in a cookie with domain `.market.dev`
3. When users visit the Rails app (explore.market.dev), the Rails app can access and verify this cookie through one of two methods:
   - Direct cookie access (possible because both apps share the `.market.dev` domain)
   - API-based verification where the Rails app sends the token to the Next.js app for verification

## Implementation

### Next.js App (market.dev)

1. The Next.js app provides two verification endpoints:
   - `/api/auth/verify-session` - Verifies the session based on the cookie in the request
   - `/api/auth/verify` - Verifies a session token provided in the request body

2. The NextAuth.js configuration sets the cookie domain to `.market.dev` to allow access from all subdomains:

```typescript
const cookieDomain = `.${process.env.NEXT_PUBLIC_ROOT_HOST}`;

export const authOptions: NextAuthOptions = {
  // ...
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: cookieDomain,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  // ...
};
```

### Rails App (explore.market.dev)

1. The Rails app includes a module to verify the session with the Next.js app:

```ruby
require 'net/http'
require 'uri'
require 'json'

module NextjsAuth
  class SessionVerifier
    NEXTJS_AUTH_URL = 'https://market.dev/api/auth/verify-session'.freeze
    
    def self.verify_session(cookies)
      uri = URI.parse(NEXTJS_AUTH_URL)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      
      request = Net::HTTP::Get.new(uri)
      request['Cookie'] = "#{cookies.to_header}" # Forward all cookies
      request['Accept'] = 'application/json'
      
      response = http.request(request)
      
      if response.code == '200'
        JSON.parse(response.body)
      else
        { 'success' => false, 'message' => "Failed with status: #{response.code}" }
      end
    end
  end
end
```

2. A controller concern is included in controllers that need authentication:

```ruby
module NextjsAuthentication
  extend ActiveSupport::Concern
  
  included do
    before_action :verify_nextjs_session
  end
  
  private
  
  def verify_nextjs_session
    result = NextjsAuth::SessionVerifier.verify_session(cookies)
    
    if result['success']
      session[:nextjs_user] = result['user']
    else
      redirect_to "https://market.dev/login?redirect=#{CGI.escape(request.original_url)}"
    end
  end
  
  def current_user
    session[:nextjs_user]
  end
  
  def user_signed_in?
    session[:nextjs_user].present?
  end
end
```

## Setup Requirements

1. Both applications must be hosted on subdomains of the same parent domain (e.g., `.market.dev`)
2. The Next.js app must set its cookie domain to `.market.dev` (note the leading dot)
3. The Rails app must be configured to forward cookies when making requests to the verification endpoint

## Important Security Considerations

1. Use HTTPS for all communication between the apps
2. Set appropriate CORS headers to restrict access to allowed domains
3. Consider implementing additional security measures such as:
   - Rate limiting to prevent abuse
   - API keys for server-to-server communication
   - Token encryption for added security

## Troubleshooting

If authentication is not working:

1. Check browser developer tools to verify the cookie is being set with the correct domain
2. Ensure both apps are accessed via HTTPS (cookies with 'secure' flag require this)
3. Verify the NextAuth secret is properly set in environment variables
4. Check that CORS headers are properly configured
5. Verify the correct cookie name is being used (it may have the `__Secure-` prefix in production) 