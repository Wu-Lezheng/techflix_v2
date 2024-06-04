
export async function GET(req, { params }) {

    const slug = params.slug;

    if (!slug) {
        return null;
    }

    return slug;

}