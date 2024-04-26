import React from 'react';
import Image from 'next/image';

const ProductCard = ({ product }) => {

    const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div>
            <Image src={product.coverImage} alt={product.productName} width={240} height={135} />
            <p>{product.productName}</p>
            <p>{formattedDate}</p>
            <p>{product.numberOfViews}</p>
        </div>
    );
}

export default ProductCard;