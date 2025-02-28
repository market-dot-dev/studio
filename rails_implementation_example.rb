# Example Rails implementation for verifying a session with the Next.js app
# Place this in an appropriate location in your Rails app, such as lib/nextjs_auth.rb

require 'net/http'
require 'uri'
require 'json'

module NextjsAuth
  class SessionVerifier
    NEXTJS_AUTH_URL = 'https://market.dev/api/auth/verify-session'.freeze
    
    # Method 1: Verify session directly when the cookie can be shared
    # This works when both apps share the same parent domain (.market.dev)
    def self.verify_session(cookies)
      uri = URI.parse(NEXTJS_AUTH_URL)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      
      # Create the request
      request = Net::HTTP::Get.new(uri)
      
      # Forward the session cookie
      session_cookie = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token']
      request['Cookie'] = "#{cookies.to_header}" # Forward all cookies
      request['Accept'] = 'application/json'
      
      # Make the request with cookies
      response = http.request(request)
      
      # Parse the response
      if response.code == '200'
        JSON.parse(response.body)
      else
        { 'success' => false, 'message' => "Failed with status: #{response.code}" }
      end
    end
    
    # Method 2: Verify using explicit token
    # This is an alternative approach when cookie sharing isn't possible
    def self.verify_token(token)
      uri = URI.parse('https://market.dev/api/auth/verify')
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      
      # Create the request
      request = Net::HTTP::Post.new(uri)
      request['Content-Type'] = 'application/json'
      request.body = { token: token }.to_json
      
      # Make the request
      response = http.request(request)
      
      # Parse the response
      if response.code == '200'
        JSON.parse(response.body)
      else
        { 'success' => false, 'message' => "Failed with status: #{response.code}" }
      end
    end
  end
end

# Example controller concern that you can include in controllers that need authentication
module NextjsAuthentication
  extend ActiveSupport::Concern
  
  included do
    before_action :verify_nextjs_session
  end
  
  private
  
  def verify_nextjs_session
    # Attempt to verify the session
    result = NextjsAuth::SessionVerifier.verify_session(cookies)
    
    if result['success']
      # Store the user information in the current session
      session[:nextjs_user] = result['user']
    else
      # Redirect to the login page if not authenticated
      redirect_to "https://market.dev/login?redirect=#{CGI.escape(request.original_url)}"
    end
  end
  
  # Helper method to get the current user
  def current_user
    session[:nextjs_user]
  end
  
  # Helper to check if user is logged in
  def user_signed_in?
    session[:nextjs_user].present?
  end
end

# Example controller using the authentication
# class ExampleController < ApplicationController
#   include NextjsAuthentication
#   
#   def index
#     @user = current_user
#     # Your controller code...
#   end
# end 