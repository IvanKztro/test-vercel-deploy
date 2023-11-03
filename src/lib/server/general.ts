import { from } from "rxjs";
import { filter, map, toArray } from "rxjs/operators";

export async function joinProductsData(fbarray: any, shoarray: any) {
  const mergedArray = await from(shoarray)
    .pipe(
      map((shoItem: any) => {
        const fbItem = fbarray.find(
          (item: any) => shoItem.node.id === item.productId
        );

        const createdAt = fbItem?.createdAt ? fbItem.createdAt.toDate() : null;
        const startDate = fbItem?.startDate ? fbItem.startDate.toDate() : null;
        const endDate = fbItem?.endDate ? fbItem.endDate.toDate() : null;
        const updatedAt = fbItem?.updatedAt ? fbItem.updatedAt.toDate() : null;

        if (fbItem) {
          return {
            ...shoItem.node,
            fbdata: { ...fbItem, endDate, createdAt, startDate, updatedAt },
          };
        } else {
          return null;
        }
      }),
      filter((mergedItem: any) => mergedItem !== null),
      toArray()
    )
    .toPromise();

  return { edges: mergedArray };
}

export async function joinOrdersData(fbarray: any, shoarray: any) {
  const mergedArray = await from(shoarray)
    .pipe(
      map((shoItem: any) => {
        let fbItem;
        if (shoItem.node)
          fbItem = fbarray.find(
            (item: any) => shoItem.node.id === item.orderIdShopify
          );
        else
          fbItem = fbarray.find(
            (item: any) => shoItem.id === item.orderIdShopify
          );

        const createdAtEvent = fbItem?.eventData?.createdAt
          ? fbItem?.eventData.createdAt.toDate()
          : null;

        const createdAtOrder = fbItem?.eventData?.createdAt
          ? fbItem?.eventData.createdAt.toDate()
          : null;
        const startDate = fbItem?.eventData?.startDate
          ? fbItem?.eventData.startDate.toDate()
          : null;
        const endDate = fbItem?.eventData?.endDate
          ? fbItem?.eventData.endDate.toDate()
          : null;
        const updatedAt = fbItem?.eventData?.updatedAt
          ? fbItem?.eventData.updatedAt.toDate()
          : null;

        if (fbItem) {
          return {
            ...(shoItem.node ? shoItem.node : shoItem),
            fbdata: {
              ...fbItem,
              createdAt: createdAtOrder,
              eventData: {
                ...fbItem.eventData,
                endDate,
                createdAt: createdAtEvent,
                startDate,
                updatedAt,
              },
            },
          };
        } else {
          return null;
        }
      }),
      filter((mergedItem: any) => mergedItem !== null),
      toArray()
    )
    .toPromise();

  return { edges: mergedArray };
}

export function generateOrderNumber() {
  let num = "";
  for (let i = 0; i < 16; i++) {
    const digit = Math.floor(Math.random() * 10);
    num += digit;
  }
  return num;
}
export function getOrderNumber(stringdata: string) {
  const regexOrder = /Order\/(\d+)/;
  const regexKey = /key=(\w+)/;

  const matchOrder = regexOrder.exec(stringdata);
  const matchKey = regexKey.exec(stringdata);

  if (matchOrder && matchKey) {
    const numorder = matchOrder[1];
    const valuekey = matchKey[1];

    const res = `${numorder}-${valuekey}`;
    return res;
  } else {
    return "No se encontraron coincidencias";
  }
}

export function getOnlyTickets(orderT: any) {
  let arraytickets: any = [];

  orderT.forEach((item: any) => {
    Object.values(item.infoTickets).forEach((ticket: any) => {
      const tempticket = {
        email: ticket.email,
        eventId: item.eventId,
        identity: ticket.identity,
        infoticketID: ticket.infoticketID,
        lastname: ticket.lastname,
        name: ticket.name,
        phone: ticket.phone,
        idVariantShopify: ticket.idVariantShopify,
        productId: item.productId,
        deel: ticket.deel,
        confirmation: ticket.confirmation || true,
      };

      arraytickets = [...arraytickets, tempticket];
    });
  });

  return arraytickets;
}

export function generateCustomID() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let customID = "";

  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * characters?.length);
    customID += characters.charAt(randomIndex);
  }

  return customID;
}
