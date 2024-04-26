const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {

    // create the users
    const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            username: 'alice',
            email: 'alice@prisma.io',
            password: 'password123',
            isAdmin: true,
        },
    });
    const bob = await prisma.user.upsert({
        where: { email: 'bob@prisma.io' },
        update: {},
        create: {
            username: 'bob',
            email: 'bob@prisma.io',
            password: 'password123',
            isAdmin: false,
        },
    });

    const categories = [
        {
            categoryName: 'Surveillance',
            categoryDescription: 'This category encompasses technologies and systems designed to observe, record, and analyse activities and events for security and safety purposes.',
            labelColor: "#CFC930",
            parentCategoryId: null,
        },
        {
            categoryName: 'Command & Control',
            categoryDescription: 'This category focuses on the management and coordination of operations for rapid deployment and resource management to enhance operational efficiency during critical situations.',
            labelColor: "#30CF36",
            parentCategoryId: null,
        },
        {
            categoryName: 'Emergency Response System',
            categoryDescription: 'This category involves the establishment of command structures and coordination networks to facilitate rapid and effective responses to emergencies and crises.',
            labelColor: "#30A9CF",
            parentCategoryId: null,
        },
        {
            categoryName: 'Resource Management',
            categoryDescription: 'This category involves the coordination and allocation of resources such as personnel, equipment, and supplies to support emergency response efforts and maintain operational readiness.',
            labelColor: "#C230CF",
            parentCategoryId: null,
        },
    ];

    // create the categories and update the parent category id
    const createdCategories = await Promise.all(
        categories.map(category => prisma.category.create({ data: category }))
    );

    const commandAndControlCategory = createdCategories.find(category => category.categoryName === 'Command & Control');

    const lastTwoCategories = createdCategories.slice(-2);
    await Promise.all(
        lastTwoCategories.map(category =>
            prisma.category.update({
                where: { id: category.id },
                data: { parentCategoryId: commandAndControlCategory.id },
            })
        )
    );

    // create the products
    const surveillanceCategory = createdCategories.find(category => category.categoryName === 'Surveillance');
    const ersCategory = createdCategories.find(category => category.categoryName === 'Emergency Response System');

    const products = [
        {
            productName: 'Drone Surveillance',
            productSummary: 'Our drone surveillance software is a cutting-edge solution designed to enhance aerial monitoring and surveillance capabilities for various applications. Leveraging advanced technologies, it provides real-time intelligence gathering, threat detection, and situational awareness in dynamic environments. With its user-friendly interface and customizable features, our software empowers users to efficiently manage drone fleets and analyze surveillance data for actionable insights.',
            coverImage: '/cover-images/drone_surveillance.jpg',
            categoryId: surveillanceCategory.id,
        },
        {
            productName: 'Firefighter ERS',
            productSummary: 'Firefighter Emergency Response System (ERS) is a comprehensive framework designed to facilitate rapid and effective emergency responses to various incidents, including fires, accidents, and other emergencies.',
            coverImage: '/cover-images/firefighter_ers.jpg',
            categoryId: ersCategory.id,
        },
        {
            productName: 'Agile Ops',
            productSummary: 'Agile Ops is a comprehensive platform designed to streamline reporting and deployment processes, ensuring efficient resource management and rapid response to emergency incidents. With its intuitive interface and powerful features, our software empowers SCDF personnel to effectively coordinate operations, generate insightful reports, and deploy resources with precision and speed.',
            coverImage: '/cover-images/agile_ops.jpg',
            categoryId: ersCategory.id,
        },
    ];

    const createdProducts = await Promise.all(
        products.map(product => prisma.product.create({ data: product }))
    );
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })