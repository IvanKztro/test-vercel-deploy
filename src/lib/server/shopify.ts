import {
  API_VERSION,
  SHOPIFY_STOREFRONT_API_TOKEN,
  SHOPIFY_STORE_NAME,
  SHOPIFY_API_KEY,
  SHOPIFY_ADMIN_API_TOKEN,
} from "$env/static/private";

export async function shopifyFetch({ query, variables }: any) {
  const endpoint = `https://${SHOPIFY_STORE_NAME}.myshopify.com/api/${API_VERSION}/graphql.json`;
  const key = SHOPIFY_STOREFRONT_API_TOKEN;

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

export async function getAllProducts() {
  return shopifyFetch({
    query: `{
      products(sortKey: TITLE, first: 250) {
          edges{
            node {
                id
                handle
                availableForSale
                title
                description
                descriptionHtml
                productType
                vendor
                options {
                    id
                    name
                    values
                }
                priceRange {
                    maxVariantPrice {
                        amount
                        currencyCode
                    }
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                }
                variants(first: 250) {
                    pageInfo {
                        hasNextPage
                        hasPreviousPage
                    }
                    edges {
                        node {
                            id
                            title
                            sku
                            availableForSale
                            requiresShipping
                            selectedOptions {
                                name
                                value
                            }
                            priceV2 {
                                amount
                                currencyCode
                            }
                            compareAtPriceV2 {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
                images(first: 250) {
                    pageInfo {
                        hasNextPage
                        hasPreviousPage
                    }
                    edges {
                        node {
                        originalSrc
                        altText
                        width
                        height
                        }
                    }
                }
            }
        }
      }
    }`,
  });
}

export async function getAllCollections() {
  return shopifyFetch({
    query: `{
        collections(first: 250) {
             edges {
                node {
                    handle
                    products(
                        first: 250,
                        sortKey: TITLE

                    ) {
                        edges{
                            node {
                                id
                                handle
                                availableForSale
                                title
                                description
                                descriptionHtml
                                productType
                                tags
                                totalInventory
                                options {
                                    id
                                    name
                                    values
                                }
                                priceRange {
                                    maxVariantPrice {
                                        amount
                                        currencyCode
                                    }
                                    minVariantPrice {
                                        amount
                                        currencyCode
                                    }
                                }
                                variants(first: 250) {
                                    pageInfo {
                                        hasNextPage
                                        hasPreviousPage
                                    }
                                    edges {
                                        node {
                                            id
                                            title
                                            sku
                                            availableForSale
                                            requiresShipping
                                            barcode
                                            quantityAvailable
                                            currentlyNotInStock
                                            selectedOptions {
                                                name
                                                value
                                            }
                                            priceV2 {
                                                amount
                                                currencyCode
                                            }
                                            compareAtPriceV2 {
                                                amount
                                                currencyCode
                                            }
                                        }
                                    }
                                }
                                images(first: 250) {
                                    pageInfo {
                                        hasNextPage
                                        hasPreviousPage
                                    }
                                    edges {
                                        node {
                                            originalSrc
                                            altText
                                            width
                                            height
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }`,
  });
}

export async function getCheckoutByID(checkoutId: string) {
  return shopifyFetch({
    query: `
      query GetCart($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            completedAt
            createdAt
            customAttributes {
              key
              value
            }
            orderStatusUrl
            updatedAt
            webUrl
            id
            ready
            requiresShipping
            email
            totalPriceV2 {
              amount
              currencyCode
            }
            order {
              currentTotalPrice {
                amount
                currencyCode
              }
              currentTotalTax {
                amount
                currencyCode
              }
              customerUrl
              email
              id
              fulfillmentStatus
              orderNumber
              processedAt
              statusUrl
              totalPrice {
                amount
                currencyCode

              }

            }
          }
        }
      }
    `,
    variables: { checkoutId },
  });
}

export async function loadCart(cartId: string) {
  return shopifyFetch({
    query: `
        query GetCart($cartId: ID!) {
          cart(id: $cartId) {
            checkoutUrl
              estimatedCost {
                  totalAmount {
                  amount
                  }
              }
              lines(first: 250) {
                  edges {
                  node {
                      id
                      quantity
                      estimatedCost {
                      subtotalAmount {
                          amount
                          currencyCode
                      }
                      totalAmount {
                          amount
                          currencyCode
                      }
                      }
                      merchandise {
                      ... on ProductVariant {
                          id
                          title
                          product {
                              images(first: 250) {
                                  edges {
                                    node {
                                      originalSrc
                                      altText
                                      width
                                      height
                                    }
                                  }
                                }
                              title
                          }
                      }
                      }
                  }
                  }
              }
            }
        }
      `,
    variables: { cartId },
  });
}

export async function testtt() {
  const query = `
          mutation {
            paymentCreate(input: {checkoutId: "gid://shopify/Checkout/cd613ce472567c78d99d8a1b308ddf3b?key=48e795d4d2530dccdbe2fa392b747517", payment: {amount: "10.00", gateway: "manual", test: true}}) {
              payment {
                id
              }
            }
          }
        `;

  const res = await shopifyFetch({ query });

  return res;
}

export async function getProduct(handle: string) {
  return shopifyFetch({
    query: ` 
        query getProduct($handle: String!) {
          productByHandle(handle: $handle) {
            id
            handle
            availableForSale
            title
            description
            descriptionHtml
            productType
            options {
              id
              name
              values
            }
            priceRange {
              maxVariantPrice {
                  amount
                  currencyCode
              }
              minVariantPrice {
                  amount
                  currencyCode
              }
            }
            variants(first: 250) {
              pageInfo {
                  hasNextPage
                  hasPreviousPage
              }
              edges {
                  node {
                    id
                    title
                    sku
                    availableForSale
                    requiresShipping
                    selectedOptions {
                        name
                        value
                    }
                    priceV2 {
                        amount
                        currencyCode
                    }
                    compareAtPriceV2 {
                        amount
                        currencyCode
                    }




                    storeAvailability(first: 250) {
                        edges {
                          node {
                            available 
                            pickUpTime 
                            location {
                              id
                              name
                            }
                          }
                        }
                    }




                     
                     
                  }
              }
            }
            images(first: 250) {
              pageInfo {
                  hasNextPage
                  hasPreviousPage
              }
              edges {
                node {
                  originalSrc
                  altText
                  width
                  height
                }
              }
            }
          }
        }
    `,
    variables: {
      handle,
    },
  });
}

export async function completeCheckoutWithCreditCardV2(
  checkoutId: string,
  payment: any
) {
  const mutation = `
    mutation checkoutCompleteWithCreditCardV2($checkoutId: ID!, $payment: CreditCardPaymentInputV2!) {
      checkoutCompleteWithCreditCardV2(checkoutId: $checkoutId, payment: $payment) {
        checkout {
          completedAt
          createdAt
          currencyCode
          email
          id
          lineItemsSubtotalPrice {
            amount
            currencyCode
          }
          order {
            id
            orderNumber
            statusUrl
            currencyCode
            currentSubtotalPrice {
              amount
              currencyCode
            }
            currentTotalPrice {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
          }

        }
        checkoutUserErrors {
          code
          field
          message
        }
        payment {
          amount {
            amount
            currencyCode
          }
          id
          nextActionUrl
         
        }
      }
    }
  `;

  const variables = {
    checkoutId,
    payment,
  };

  const res = await shopifyFetch({ query: mutation, variables });

  return res;
}

export async function createPayment() {
  const query = `
    mutation {
      paymentCreate(
        input: {
          amount: "10.00"
          idempotencyKey: "a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20"
          paymentType: CREDIT_CARD
        }
      ) {
        payment {
          id
          amount
          status
        }
        userErrors {
          field
          message
        }
      }
    }

  `;

  const res = await shopifyFetch({ query });

  return res;
}

export async function createCheckout(checkoutData: any) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          completedAt
          createdAt
          currencyCode
          email
          id
          orderStatusUrl
          updatedAt
          webUrl
          customAttributes {
            key
            value
          }
          order {
            currentTotalPrice {
              amount
              currencyCode
            }
            currentTotalTax {
              amount
              currencyCode
            }
            customerUrl
            email
            id
            orderNumber
            processedAt
            statusUrl
            totalPrice {
              amount
              currencyCode

            }

          }

        }
        checkoutUserErrors {
          code
          field
          message
        }
        queueToken
      }
    }
  `;

  const variables = {
    input: checkoutData,
  };
  const res = await shopifyFetch({ query, variables });

  return res;
}

export async function createCart(lineItems: any) {
  return shopifyFetch({
    query: `
      mutation calculateCart($lineItems: [CartLineInput!]) {
        cartCreate(input: { lines: $lineItems }) {
          cart {
            checkoutUrl
            totalQuantity
            createdAt
            id
          }
        }
      }
    `,
    variables: {
      lineItems: lineItems,
    },
  });
}

export async function updateCart({ cartId, lineId, variantId, quantity }: any) {
  return shopifyFetch({
    query: `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      cartId: cartId,
      lines: [
        {
          id: lineId,
          merchandiseId: variantId,
          quantity: quantity,
        },
      ],
    },
  });
}

export async function addToCart({ cartId, variantId }: any) {
  return shopifyFetch({
    query: `
      mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            lines(first: 250) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,

    variables: {
      cartId: cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity: 1,
        },
      ],
    },
  });
}

export async function createCustomer(customerData: any) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          acceptsMarketing
          email
          phone
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    input: customerData,
  };

  const response = await shopifyFetch({ query, variables });

  if (
    response?.body?.data?.customerCreate?.customerUserErrors?.length > 0 ||
    response?.body?.errors?.length > 0
  ) {
    let userError;

    if (
      response?.body?.data?.customerCreate?.customeruserErrors &&
      response?.body?.data?.customerCreate?.customeruserErrors?.length > 0
    ) {
      userError = response?.body?.data?.customerCreate?.customeruserErrors[0];
    } else if (response?.body?.errors && response?.body?.errors?.length > 0) {
      userError = response?.body?.errors[0];
    } else {
      userError = { message: "Usuario existente o intentos excedidos" };
    }

    return { status: 400, error: userError.message };
  } else {
    return { ...response?.body?.data?.customerCreate };
  }
}

export async function deleteCustomer(id: string) {
  const endpoint = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/${API_VERSION}/customers/${id}.json`;

  const response = await fetch(endpoint, {
    credentials: "include",
    method: "DELETE",
    headers: {
      Authorization: `Basic ${btoa(
        `${SHOPIFY_API_KEY}:${SHOPIFY_ADMIN_API_TOKEN}`
      )}`,
    },
  });
  if (response.ok) {
    console.log("Customer deleted successfully!");
    return response.ok;
  } else {
    console.error("Failed to delete customer");
    return response;
  }
}

export async function customerRecoverPassword(email: string) {
  const query = `
    mutation customerRecover {
      customerRecover(email: "${email}") {
        customerUserErrors {
          message
        }
      }
    }
  `;

  return shopifyFetch({ query });
}

export async function signInCustomer(email: string, password: string) {
  const queryAuthenticate = `
    mutation customerAccessTokenCreate {
      customerAccessTokenCreate(input: { email: "${email}", password: "${password}" }) {
        customerAccessToken {
          accessToken
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const authResponse = await shopifyFetch({ query: queryAuthenticate });

  if (
    authResponse.status === 200 &&
    authResponse.body.data.customerAccessTokenCreate.customerAccessToken
  ) {
    const accessToken =
      authResponse.body.data.customerAccessTokenCreate.customerAccessToken
        .accessToken;

    const customerInfoResponse = await getCustomerInfo(accessToken);

    return customerInfoResponse;
  } else {
    return {
      status: 400,
      error: authResponse.body.data.customerAccessTokenCreate.customerUserErrors
        ? authResponse.body.data.customerAccessTokenCreate.customerUserErrors[0]
            .message
        : "Error desconocido al autenticar al cliente",
    };
  }
}

export async function getCustomerInfo(accessToken: string) {
  const query = `
    query {
      customer(customerAccessToken: "${accessToken}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        phone
      }
    }
  `;

  const customerInfoResponse = await shopifyFetch({ query });

  if (
    customerInfoResponse.status === 200 &&
    customerInfoResponse.body.data.customer
  ) {
    const customerData = customerInfoResponse.body.data.customer;
    return {
      status: 200,
      accessToken: accessToken,
      customer: customerData,
    };
  } else {
    return {
      status: customerInfoResponse.status,
      error: customerInfoResponse.body.errors
        ? customerInfoResponse.body.errors[0].message
        : "Error desconocido al obtener información del cliente",
    };
  }
}

export async function customerUpdate(
  customerInput: any,
  customerAccessToken: string
) {
  const query = `
    mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
      customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
        customer {
          firstName
          lastName
          email
        }
        customerAccessToken {
          accessToken
        }
      }
    }
  `;

  const variables = {
    customer: customerInput,
    customerAccessToken: customerAccessToken,
  };

  const response = await shopifyFetch({ query, variables });

  return response;
}

export async function passwordUpdate(
  customerInput: any,
  customerAccessToken: string
) {
  const query = `
    mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
      customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
        customer {
          firstName
          lastName
          email
        }
        customerAccessToken {
          accessToken
        }
      }
    }
  `;

  const variables = {
    customer: customerInput,
    customerAccessToken: customerAccessToken,
  };

  const response = await shopifyFetch({ query, variables });

  return response;
}

//"financial_status:PAID"

export async function getCustomerOrders(accessToken: string) {
  const query = `
    query {
       customer(customerAccessToken: "${accessToken}") {
        orders(first: 250) {
          edges {
            node {
              id
              name
              orderNumber
              statusUrl
              processedAt
              currencyCode
              financialStatus
              totalPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
                currencyCode
              }
              currentTotalPrice {
                amount
                currencyCode
              }
              customerLocale
              email


              lineItems(first: 250) {
                edges {
                  node {

                    currentQuantity
                    quantity
                    title
                    variant {
                      availableForSale
                      barcode
                      id
                      price {
                        amount
                        currencyCode
                      }
                      title
                      product {
                        createdAt
                        description
                        handle
                        id
                        title
                        productType
                        vendor
                        featuredImage {
                          id
                          url
                          height
                          width
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({ query });
    return response;
  } catch (error) {
    throw new Error(
      "No se pudo obtener la información del cliente y sus pedidos en Shopify"
    );
  }
}
export async function getOrderByID(id: string) {
  const query = `
    query {
      node(id: "${id}") {
        ... on Order {
          id
          name
          orderNumber
          statusUrl
          processedAt
          currencyCode
          financialStatus
          totalPrice {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          currentTotalPrice {
            amount
            currencyCode
          }
          customerLocale
          email


          lineItems(first: 250) {
            edges {
              node {

                currentQuantity
                quantity
                title
                variant {
                  availableForSale
                  barcode
                  id
                  price {
                    amount
                    currencyCode
                  }
                  title
                  product {
                    createdAt
                    description
                    handle
                    id
                    title
                    productType
                    vendor
                    featuredImage {
                      id
                      url
                      height
                      width
                      altText
                    }
                  }
                }
              }
            }
          }            
        }
      }
    }

  `;
  const response = await shopifyFetch({ query });
  return response;
}

export async function getCustomerOrdersTest(accessToken: string) {
  const query = `
    query {
       customer(customerAccessToken: "${accessToken}") {
        orders(first: 250, query: "financial_status:AUTHORIZED") {
            nodes {
              id
              name
              orderNumber
              statusUrl
              processedAt
              currencyCode
             
              totalPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
                currencyCode
              }
              currentTotalPrice {
                amount
                currencyCode
              }
              customerLocale
              email
              

              lineItems(first: 250) {
                edges {
                  node {

                    currentQuantity
                    quantity
                    title
                    variant {
                      availableForSale
                      barcode
                      id
                      price {
                        amount
                        currencyCode
                      }
                      title
                      product {
                        createdAt
                        description
                        handle
                        id
                        title
                        productType
                        vendor
                        featuredImage {
                          id
                          url
                          height
                          width
                          altText

                        }



                      }

                    }

                    
                
                
                  
                  }
                }
              }

              
           
           
            
            }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({ query });
    return response;
  } catch (error) {
    throw new Error(
      "No se pudo obtener la información del cliente y sus pedidos en Shopify"
    );
  }
}
