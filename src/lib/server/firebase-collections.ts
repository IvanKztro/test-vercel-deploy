import { fbAdmin, firestore } from "$lib/firebase/admin";
import { joinOrdersData, joinProductsData } from "$lib/server/general";
import { FieldStatus } from "../../models/general";
import type { AppNotification } from "../../models/notifications";

export async function getEvents(products: any) {
  const promises: any = [];
  const eventsCollection = firestore.collection("events");

  products[0].node.products.edges.forEach((item: any) => {
    const query = eventsCollection
      .where("productId", "==", item.node.id)
      .where("status", "==", FieldStatus.Active)
      .where("endDate", ">=", fbAdmin.firestore.Timestamp.now());
    // .orderBy("endDate", "asc");
    promises.push(query.get());
  });

  const results = await Promise.all(promises);

  const data = [].concat(
    ...results.map((result) => result.docs.map((doc: any) => doc.data()))
  );

  const datares = await joinProductsData(data, products[0].node.products.edges);

  return datares;
}

export async function createCartOrder(data: any, tickets: any) {
  try {
    const customIdStr = data.id.toString();
    const batch = firestore.batch();
    data.createdAt = fbAdmin.firestore.Timestamp.now();

    const docRef = firestore.collection("orders").doc(customIdStr);
    batch.set(docRef, data);
    for (const ticket of tickets) {
      const newTicketDocRef = fbAdmin
        .firestore()
        .collection("orders")
        .doc(customIdStr)
        .collection("tickets")
        .doc(ticket.infoticketID);
      batch.set(newTicketDocRef, ticket);
    }
    await batch.commit();
    return { status: "success", res: data.id };
  } catch (error) {
    console.log(error);
    return { status: "error", error };
  }
}

export async function updateOrderAfterVeirification(payload: any) {
  try {
    const orderDocRef = fbAdmin
      .firestore()
      .collection("orders")
      .doc(payload.id);
    const doc = await orderDocRef.get();
    if (doc.exists) {
      const data: any = doc.data();
      if (!data.iseditable) return { status: "success" };
      orderDocRef.update({
        status: payload.status,
        orderNumber: payload.orderNumber,
        iseditable: false,
        orderIdShopify: payload.orderIdShopify,
      });
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
}

export async function getOrdersByUser(userid: string, ordersShopify: any) {
  const ordersRef = fbAdmin
    .firestore()
    .collection("orders")
    .where("createdBy", "==", userid);

  try {
    const querySnapshot = await ordersRef.get();
    const ordersData: any = [];

    for (const doc of querySnapshot.docs) {
      const order = doc.data();

      const eventRef = fbAdmin
        .firestore()
        .collection("events")
        .doc(order.eventId);
      const eventDoc = await eventRef.get();
      const eventData = eventDoc.data();
      order.eventData = eventData;
      ordersData.push(order);
    }

    const datares = await joinOrdersData(ordersData, ordersShopify);
    return datares;
  } catch (error) {
    console.error("Error al consultar Firestore:", error);
    throw error;
  }
}

export async function getOrderByIDFirebase(
  orderIdShopify: string,
  ordersShopify: any
) {
  const ordersRef = fbAdmin
    .firestore()
    .collection("orders")
    .where("orderIdShopify", "==", orderIdShopify);

  try {
    const querySnapshot = await ordersRef.get();
    const ordersData: any = [];

    for (const doc of querySnapshot.docs) {
      const order = doc.data();
      const ticketsRef = doc.ref.collection("tickets");
      const ticketsSnapshot = await ticketsRef.get();
      const ticketsData: any = [];

      ticketsSnapshot.forEach((ticketDoc) => {
        ticketsData.push(ticketDoc.data());
      });

      order.tickets = ticketsData;

      const eventRef = fbAdmin
        .firestore()
        .collection("events")
        .doc(order.eventId);
      const eventDoc = await eventRef.get();
      const eventData = eventDoc.data();
      order.eventData = eventData;
      ordersData.push(order);
    }

    const datares = await joinOrdersData(ordersData, ordersShopify);
    return datares;
  } catch (error) {
    console.error("Error al consultar Firestore:", error);
    throw error;
  }
}

export async function createNotification(notificationData: AppNotification) {
  try {
    const docRef = fbAdmin
      .firestore()
      .collection("notifications")
      .doc(notificationData.id);
    await docRef.set(notificationData);

    return { status: "success", message: "notificación creada" };
  } catch (error) {
    return { status: "error", message: "error al crear notificacion" };
  }
}

export async function getNotifications(iduser: any) {
  const eventsCollection = firestore.collection("notifications");
  const notifications: any = [];

  const query = eventsCollection
    .where("createdBy", "==", iduser)
    .orderBy("date", "desc");

  try {
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      const date = doc.data().date ? doc.data().date.toDate() : null;
      const data = {
        ...doc.data(),
        date: date,
      };
      notifications.push(data);
    });
    return notifications;
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
}

export async function deleteUserData(iduser: any) {
  const usersCollection = firestore.collection("users");

  try {
    const userDoc = await usersCollection.doc(iduser).get();

    if (userDoc.exists) {
      await userDoc.ref.delete();
      console.log(`Usuario con id ${iduser} eliminado exitosamente`);
      return true;
    } else {
      console.log(`Usuario con id ${iduser} no encontrado`);
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return false;
  }
}

export async function getForms() {
  const formsRef = firestore.collection("forms").doc("events");

  const formsDoc = await formsRef.get();
  const formsData = formsDoc.data();

  return formsData;
}

export async function uploadImage() {
  try {
    const metadata = {
      cacheControl: "public,max-age=31536000,must-revalidate",
      // contentType: "image/jpeg" // THIS IS AUTO INFERRED BY FIREBASE
    };

    // const storageRef = firebase.storage().ref(`${directory}/${fileName}`);
    // const storageRef = storage.ref()
    // const uploadTask = storageRef.put(file,metadata);

    // uploadTask.on("state_changed",
    //   function progress() {...},
    //   function error() {...},
    //   function complete() {...}
    // );
  } catch (error) {
    return { status: "error" };
  }
}

// async function uploadFile(filePath: any, destFileName: any) {
//   try {
//     const bucket = storage.bucket();
//     const file = bucket.file(destFileName); // Reemplaza con el nombre de tu archivo en Firebase Storage

//     await file.save(filePath, {
//       destination: destFileName,
//       public: true, // Opcional: si deseas que el archivo sea público
//     });

//     console.log(`${destFileName} subido a Firebase Storage.`);
//   } catch (error) {
//     console.error("Error al subir el archivo:", error);
//   }

//   return { status: "pending" };
// }
