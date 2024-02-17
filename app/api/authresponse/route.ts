export async function GET(req: Request, res: Response) {
    // if query parameter error is present, return error, else return success
    const {searchParams} = new URL(req.url);
    const error = searchParams.get("error");

    if (error) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    } else {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
}