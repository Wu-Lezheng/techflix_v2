export { default } from "next-auth/middleware";

// TODO: add more protected pages if needed
export const config = {
    matcher: ["/create-user", "/api/:path*", "/category/:path*", "/favourites", "/home", "/search-results"]
};