import {
  getAllCollections,
  getCheckoutByID,
  loadCart,
} from "$lib/server/shopify";
import { getEvents } from "$lib/server/firebase-collections";

export const load = async ({ params, locals, cookies }) => {
  const handle = params.id;
  let products;
  let cart: any;
  let datares;
  let checkoutdata = null;

  console.log(`checkout-${params.id}-${locals.userdata.firebaseID}`);

  const cookiecheckout = cookies.get(
    `checkout-${params.id}-${locals.userdata.firebaseID}`
  );
  if (cookiecheckout) {
    const json = await JSON.parse(cookiecheckout);
    const checkoutres = await getCheckoutByID(json.id);
    checkoutdata = checkoutres.body.data.node;
  }

  const cartid = cookies.get(`cart-${handle}-id-${locals.userdata.firebaseID}`);
  if (cartid) {
    const resCart = await loadCart(cartid);

    if (resCart.body.data.cart) {
      cart = {
        id: cartid,
        ...resCart.body.data.cart,
      };
    }
  }

  const resproducts = await getAllCollections();

  if (resproducts.status === 200) {
    products = resproducts.body?.data?.collections?.edges;
    datares = await getEvents(products);
  }
  const event = datares?.edges?.filter((item) => item.handle === handle);

  return {
    event: event?.length > 0 ? event[0] : null,
    products: datares,
    user: locals.userdata,
    productname: handle,
    cart,
    checkout: checkoutdata,
  };
};
