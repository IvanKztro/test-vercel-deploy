import {
  PUBLIC_API_VERSION,
  PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN,
  PUBLIC_SHOPIFY_STORE_NAME,
} from "$env/static/public";

export async function shopifyFetch({ query, variables }: any) {
  const endpoint = `https://${PUBLIC_SHOPIFY_STORE_NAME}.myshopify.com/api/${PUBLIC_API_VERSION}/graphql.json`;
  const key = PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
      },
      body: { query, variables } && JSON.stringify({ query, variables }),
    });

    return {
      status: result.status,
      body: await result.json(),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      error: "Error receiving data",
    };
  }
}

export async function deleteCustomerAccessToken(accessToken: string) {
  const mutation = `
    mutation {
      customerAccessTokenDelete(customerAccessToken: "${accessToken}") {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;

  return await shopifyFetch({ mutation });
}
