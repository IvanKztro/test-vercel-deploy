import { fbAdmin, firestore } from "$lib/firebase/admin";
import { signInCustomer } from "$lib/server/shopify";

/** @type {import('./$types').Actions} */
export const actions = {
  signIn: async ({ cookies, request }) => {
    let userData;
    const data = await request.formData();
    const email = data.get("emailuser");
    const password = data.get("passworduser");
    const res = await signInCustomer(email as string, password as string);

    if (!res.error) {
      const shopifyID = res.customer.id;
      const usersCollection = firestore.collection("users");
      const query = usersCollection.where("shopifyID", "==", shopifyID);

      try {
        const querySnapshot = await query.get();

        if (!querySnapshot.empty) {
          let user;
          querySnapshot.forEach((doc) => {
            user = doc.data();
          });
          userData = {
            accessToken: res.accessToken,
            shopifyID: res.customer.id,
            firstName: res.customer.firstName,
            lastName: res.customer.lastName,
            acceptsMarketing: res.customer.acceptsMarketing,
            email: res.customer.email,
            phone: res.customer.phone,
            firebaseID: user.uid,
            billing: user?.billing ? user?.billing : null,
          };
          return { ...res, userData };
        } else {
          console.log("No se encontraron usuarios");
        }
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
      }
    } else return res;
  },
};
