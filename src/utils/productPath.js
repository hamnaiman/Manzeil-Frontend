export const productPath=product=>"/product/"+encodeURIComponent(product.slug||product._id||product.product);
