export const getRootUrl = (subdomain: string = 'app', path: string = '/') => {
    const protocol = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ? 'http' : 'https';
    const host = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    console.log("URI: ", `${protocol}://${subdomain}.${host}`);
    const uri = `${protocol}://${subdomain}.${host}`;

    const url = new URL(path, uri);
    
    url.port = process.env.PORT || '';

    return url.toString();
}