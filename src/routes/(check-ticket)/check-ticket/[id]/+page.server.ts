import { fbAdmin } from "$lib/firebase/admin";
import {
  createNotification,
  updateOrderAfterVeirification,
} from "$lib/server/firebase-collections";
import { generateCustomID, getOrderNumber } from "$lib/server/general";
import { getOrderByID } from "$lib/server/shopify";
import {
  NotificationsStatus,
  type AppNotification,
} from "../../../../models/notifications";

export const load = async ({ params, locals, request, cookies }) => {
  const eventid = params?.id;
  // console.log(eventid);
  //   const res = await getOrderByID(
  //     `gid://shopify/Order/${arraystring[0]}?key=${arraystring[1]}`
  //   );

  //   const url = new URL(request.url);
  //   const searchParams = new URLSearchParams(url.search);
  //   const orderid = searchParams.get("orderid");
  //     const productname = searchParams.get("productname");

  return { status: "test" };

  //   if (res.body.data.node) {
  //     const payload = {
  //       id: orderid,
  //       orderNumber: res.body.data.node.orderNumber,
  //       status: res.body.data.node.financialStatus,
  //       orderIdShopify: res.body.data.node.id,
  //     };
  //     const resupdate = await updateOrderAfterVeirification(payload);
  //     if (resupdate) {
  //       const r = getOrderNumber(res.body.data.node.id);
  //       const link = `/order-details/${r}/`;

  //       const notificationData: AppNotification = {
  //         createdBy: locals.userdata.firebaseID,
  //         date: fbAdmin.firestore.Timestamp.now(),
  //         description: `Compraste tickets para: ${productname}`,
  //         icon: "ticket",
  //         id: generateCustomID(),
  //         title: "Compra Exitosa!",
  //         status: NotificationsStatus.Unread,
  //         link,
  //       };

  //       await createNotification(notificationData);

  //       return {
  //         status: "success",
  //         order: res.body.data.node,
  //         user: locals.userdata,
  //         productname,
  //       };
  //     } else
  //       return {
  //         status: "error",
  //         message: "Error al actualizar order",
  //         link: res.body.data.node.statusUrl,
  //       };
  //   } else {
  //     return { status: "error", message: "Esta orden no existe" };
  //   }
};
