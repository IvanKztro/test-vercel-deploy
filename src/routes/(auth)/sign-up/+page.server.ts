import { fbAdmin } from "$lib/firebase/admin";
import { createNotification } from "$lib/server/firebase-collections.js";
import { generateCustomID } from "$lib/server/general.js";
import { createCustomer, signInCustomer } from "$lib/server/shopify";
import {
  NotificationsStatus,
  type AppNotification,
} from "../../../models/notifications.js";
import { Role, type UserProfile } from "../../../models/user.js";

import { v4 as uuidv4 } from "uuid";

/** @type {import('./$types').Actions} */
export const actions = {
  signUp: async ({ cookies, request }) => {
    const data = await request.formData();
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");
    const user = {
      firstName,
      lastName,
      email,
      password,
      acceptsMarketing: true,
    };

    const res = await createCustomer(user);

    if (res?.error || res?.status === 400) return res;
    else {
      try {
        const uid = uuidv4();

        const us: UserProfile = {
          uid,
          email: user.email as string,
          displayName: `${user.firstName} ${user.lastName}` || "",
          emailVerified: true,
          phoneNumber: "",
          acceptsMarketing: user.acceptsMarketing,
          role: Role.Subscriber,
          shopifyID: res.customer.id,
        };
        const userRef = fbAdmin.firestore().collection("users").doc(uid);

        await userRef.set(us);

        const response = await signInCustomer(
          user.email as string,
          user.password as string
        );
        const userData = {
          accessToken: response.accessToken,
          shopifyID: res.customer.id,
          firstName: res.customer.firstName,
          lastName: res.customer.lastName,
          acceptsMarketing: res.customer.acceptsMarketing,
          email: res.customer.email,
          phone: res.customer.phone,
          firebaseID: us.uid,
        };

        const notificationData: AppNotification = {
          createdBy: uid,
          date: fbAdmin.firestore.Timestamp.now(),
          description: "Ahora tienes acceso a nuestros eventos",
          icon: "success_user",
          id: generateCustomID(),
          title: "Cuenta creada!",
          status: NotificationsStatus.Unread,
          link: "/settings",
        };

        await createNotification(notificationData);

        return { ...response, userData };
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        return { success: false, error: "Error al crear el usuario" };
      }
    }
  },
};
