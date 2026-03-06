import { match } from "assert";
import {withAuth} from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks:{
            authorized({req, token}) {
                const { pathname } = req.nextUrl;
                if(
                    pathname.startsWith('/api/auth') ||
                    pathname === '/login' ||
                    pathname === '/register'
                ){
                    return true;
                }
                if(pathname ==='/' || pathname.startsWith('/api/video')){
                    return true;
                }

                return !!token; //double exclamation to convert token to boolean. If token exists, it returns true, otherwise false.
            },
        }
    }
);

export const config = {
    /*
    mathch all routes except the ones mentioned in the matcher array. 
    _neext/static,
    _next/image,
    favicon.ico,
    public folder
    */
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)'
    ]
}