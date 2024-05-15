const { PrismaClient, MediaType, FeatureLayout } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {

    const password1 = await hash("Password123", 12);
    const password2 = await hash("P@ssw0rd", 12);

    // create the users
    const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            id: 'clvp8f1kv0000ooixz3hx0q12',
            username: 'alice',
            email: 'alice@prisma.io',
            password: password1,
            profilePic: '/profile-images/alice_profile_image.png',
            isAdmin: true,
        },
    });
    const bob = await prisma.user.upsert({
        where: { email: 'bob@prisma.io' },
        update: {},
        create: {
            username: 'bob',
            email: 'bob@prisma.io',
            password: password2,
            isAdmin: false,
        },
    });

    // create the categories and update the parent category id
    const categories = [
        {
            categoryName: 'Others',
            categoryDescription: 'This category stores all Research & Development (R&D) projects and miscellaneous products. Products without a properly assigned category will also be relocated here.',
            labelColor: "#CDCDC0",
            parentCategoryId: null,
        },
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
            numberOfViews: 143,
            coverImage: '/cover-images/firefighter_ers.jpg',
            categoryId: ersCategory.id,
        },
        {
            productName: 'Agile Ops',
            productSummary: 'Agile Ops is a comprehensive platform designed to streamline reporting and deployment processes, ensuring efficient resource management and rapid response to emergency incidents. With its intuitive interface and powerful features, our software empowers SCDF personnel to effectively coordinate operations, generate insightful reports, and deploy resources with precision and speed.',
            numberOfViews: 9375,
            coverImage: '/cover-images/agile_ops.jpg',
            categoryId: ersCategory.id,
        },
        {
            productName: "Mongolian Police E-Staging",
            productSummary: "Mongolian Police E-Staging is a robust Android application designed to modernize and enhance the operational efficiency of the Mongolian police force. With its user-friendly interface and powerful features, our app enables police personnel to effectively manage operations, generate detailed reports, and respond swiftly to incidents. It's an essential tool for resource management and emergency response coordination in the digital age.",
            coverImage: "/cover-images/e_staging.png",
            categoryId: ersCategory.id,
        }
    ];

    const createdProducts = await Promise.all(
        products.map(product => prisma.product.create({ data: product }))
    );

    // create recently viewed
    const droneSurveillance = createdProducts.find(product => product.productName === 'Drone Surveillance');
    const agileOps = createdProducts.find(product => product.productName === 'Agile Ops');
    const firefighterERS = createdProducts.find(product => product.productName === 'Firefighter ERS');

    const viewedProducts = [
        {
            userId: alice.id,
            productId: droneSurveillance.id,
        },
        {
            userId: alice.id,
            productId: agileOps.id,
        },
        {
            userId: alice.id,
            productId: firefighterERS.id,
        },
    ];

    const recentlyViewed = await Promise.all(
        viewedProducts.map(viewedProduct => prisma.productViewed.create({ data: viewedProduct }))
    );

    // create media files
    const files = [
        {
            fileName: 'drone_1.jpg',
            filePath: '/images/drone_1.jpg',
            mediaType: MediaType.IMAGE,
            productId: droneSurveillance.id,
        },
        {
            fileName: 'drone_2.jpg',
            filePath: '/images/drone_2.jpg',
            mediaType: MediaType.IMAGE,
            productId: droneSurveillance.id,
        },
        {
            fileName: 'drone_3.png',
            filePath: '/images/drone_3.png',
            mediaType: MediaType.IMAGE,
            productId: droneSurveillance.id,
        },
        {
            fileName: 'drone_4.png',
            filePath: '/images/drone_4.png',
            mediaType: MediaType.IMAGE,
            productId: droneSurveillance.id,
        },
        {
            fileName: 'drone_5.jpg',
            filePath: '/images/drone_5.jpg',
            mediaType: MediaType.IMAGE,
            productId: droneSurveillance.id,
        },
    ];

    const mediaFiles = await Promise.all(
        files.map(file => prisma.mediaFile.create({ data: file }))
    );

    const features = [
        {
            featureTitle: "Real-time Monitoring and Analysis",
            featureDescription: "Our software enables users to stream live video feeds from drone cameras and perform real-time analysis of surveillance data. It utilises AI-powered algorithms for object detection, tracking, and anomaly recognition, allowing operators to quickly identify and respond to security threats or suspicious activities.",
            featureImage: "/feature-images/feature_1.png",
            layout: FeatureLayout.IMAGE_SPLIT,
            productId: droneSurveillance.id,
        },
        {
            featureTitle: "Geofencing and Mission Planning",
            featureDescription: "Users can define custom geofenced areas and set up automated mission plans for drone patrols. The software offers intuitive tools for route planning, waypoint navigation, and mission scheduling, ensuring optimal coverage of target areas while adhering to safety regulations and operational requirements.",
            featureImage: "/feature-images/feature_2.png",
            layout: FeatureLayout.IMAGE_STACK,
            productId: droneSurveillance.id,
        },
        {
            featureTitle: "Data Visualization and Reporting",
            featureDescription: "Our software provides comprehensive data visualisation tools and reporting capabilities for post-mission analysis and decision-making. Users can visualise surveillance data on interactive maps, generate detailed reports, and extract valuable insights to support strategic planning, incident response, and risk assessment efforts.",
            layout: FeatureLayout.SPLIT,
            productId: droneSurveillance.id,
        },
    ];

    const productFeatures = await Promise.all(
        features.map(feature => prisma.feature.create({ data: feature }))
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