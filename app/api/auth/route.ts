export async function POST(req: Request) {
    const res = await req.json();
    const sessionToken = res.data?.accessToken;

    if (!sessionToken) {
        return Response.json(
            { message: "SessionToken Not Found!" },
            {
                status: 400,
            }
        );
    }

    return Response.json(res.data, {
        status: 200,
        headers: { "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure` },
    });
}
