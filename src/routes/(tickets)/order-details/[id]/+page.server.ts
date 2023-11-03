import { getOrderByIDFirebase } from "$lib/server/firebase-collections";
import { getOrderByID } from "$lib/server/shopify";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const arraystring = params.id.split("-");
  const res = await getOrderByID(
    `gid://shopify/Order/${arraystring[0]}?key=${arraystring[1]}`
  );
  if (res?.body?.data?.node) {
    const resFBOrder: any = await getOrderByIDFirebase(
      res?.body?.data?.node?.id,
      [res?.body?.data?.node]
    );
    if (resFBOrder?.edges?.length > 0)
      return { user: locals.userdata, order: resFBOrder.edges[0] };
    else return { user: locals.userdata, order: null };
  } else return { user: locals.userdata, order: null };
};
