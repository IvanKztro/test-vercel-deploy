import { customerRecoverPassword } from "$lib/server/shopify";

/** @type {import('./$types').Actions} */
export const actions = {
  resetPassword: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get("email");
    const res = await customerRecoverPassword(email as string);
    return { ...res };
  },
};
