import {
  completeCheckoutWithCreditCardV2,
  createCart,
  createCheckout,
  getAllCollections,
  getCheckoutByID,
  loadCart,
} from "$lib/server/shopify";
import { fbAdmin } from "$lib/firebase/admin";
import { createCartOrder, getEvents } from "$lib/server/firebase-collections";
import { generateOrderNumber, getOnlyTickets } from "$lib/server/general";

export const load = async ({ params, locals, cookies }) => {
  const handle = params.id;
  let products;
  let datares;

  let cart: any;
  let checkoutdata = null;
  const cookiecheckout = cookies.get(
    `checkout-${params.id}-${locals.userdata.firebaseID}`
  );
  if (cookiecheckout && cookiecheckout !== "null") {
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
    } else cart = null;
  }
  const resproducts = await getAllCollections();

  if (resproducts.status === 200) {
    products = resproducts.body?.data?.collections?.edges;
    datares = await getEvents(products);
  }
  const event = datares?.edges?.filter((item) => item.handle === handle);

  return {
    user: locals.userdata,
    productname: handle,
    event: event?.length > 0 ? event[0] : null,
    cart,
    checkout: checkoutdata,
  };
};

/** @type {import('./$types').Actions} */
export const actions = {
  createCheckoutAction: async ({ cookies, request }) => {
    const data = await request.formData();
    const jsonArray: any = data.get("lineItems");
    const jsoncart: any = data.get("cartOrder");
    const jc: any = data.get("jsoncart");

    const rescookie = cookies.get("userdata");
    const user = JSON.parse(rescookie);

    const lineItems = JSON.parse(jsonArray);
    const cartOrder = JSON.parse(jsoncart);
    const obtectcart = JSON.parse(jc);
    cartOrder.id = generateOrderNumber();
    const arraycart = Object.values(obtectcart);

    const arraytickets = getOnlyTickets(arraycart);

    const userpayment = {
      // allowPartialAddresses: true,
      // buyerIdentity: {
      //   countryCode: "CR",
      // },
      email: user?.billing?.email,
      lineItems,
      customAttributes: {
        key: cartOrder.id,
        value: cartOrder.id,
      },
      // note: "",
      // shippingAddress: {
      //   address1: user?.billing?.street1,
      //   address2: user?.billing?.street2,
      //   // city: user?.billing?.city,
      //   // country: user?.billing?.country,
      //   firstName: user?.billing?.name,
      //   lastName: user?.billing?.lastname,
      //   phone: user?.billing?.phoneNumber,
      //   province: user?.billing?.state,
      //   zip: user?.billing?.zip,
      // },
    };

    const res: any = await createCheckout(userpayment);

    if (
      !res?.body?.data?.checkoutCreate?.checkout &&
      res?.body?.data?.checkoutCreate?.checkoutUserErrors?.length !== 0
    )
      return {
        error: res?.body?.data?.checkoutCreate?.checkoutUserErrors[0].message,
        status: "error",
      };

    cartOrder.idcheckout = res?.body?.data?.checkoutCreate?.checkout.id;
    const rescreatecart = await createCartOrder(cartOrder, arraytickets);

    if (rescreatecart.status === "error")
      return { status: "error", message: "error al crear orden" };

    return {
      checkout: res?.body?.data?.checkoutCreate?.checkout,
      status: "success",
    };
  },
  createCartAction: async ({ request, params }) => {
    const data = await request.formData();
    const stringdata = data.get("lines");
    const lines = JSON.parse(stringdata);
    let cart;

    let res = await createCart(lines);

    if (res?.body?.errors)
      return { status: 400, error: "Error al agregar al carrito" };
    else {
      const cartid = res?.body?.data?.cartCreate.cart.id;
      if (cartid) {
        const resCart = await loadCart(cartid);

        if (resCart.body.data.cart) {
          cart = {
            id: cartid,
            ...resCart.body.data.cart,
          };
        }
      }
      return {
        status: 200,
        data: res?.body?.data?.cartCreate,
        eventname: params.id,
        cart,
      };
    }
  },
  saveFactForm: async ({ cookies, request }) => {
    const data = await request.formData();

    const u = cookies.get("userdata");
    let user = JSON.parse(u);
    try {
      //update firebase user
      const billing = {
        city: data.get("city"),
        country: data.get("country"),
        email: user.email,
        iscompany: data.get("iscompany"),
        name: data.get("name"),
        lastname: data.get("lastName"),
        numberregister: data.get("numberregister"),
        phoneNumber: data.get("phoneNumber"),
        state: data.get("state"),
        street1: data.get("street"),
        street2: data.get("numberstreet"),
        terms: data.get("terms"),
        zip: data.get("zip"),
      };
      const userRef = fbAdmin
        .firestore()
        .collection("users")
        .doc(user.firebaseID);
      await userRef.update({ billing });

      const userData = {
        accessToken: user.accessToken,
        shopifyID: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        acceptsMarketing: user.acceptsMarketing,
        phone: user.phone,
        firebaseID: user.firebaseID,
        billing: billing,
      };

      return { status: "succes", userData };
    } catch (error) {
      console.log(error);
      return { error: "No se pudo actualizar" };
    }
  },
};
