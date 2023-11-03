import {
  customerUpdate,
  deleteCustomer,
  passwordUpdate,
} from "$lib/server/shopify";
import type { PageServerLoad } from "./$types";
import { fbAdmin } from "$lib/firebase/admin";
import { deleteUserData } from "$lib/server/firebase-collections";

export const load: PageServerLoad = async ({ params, locals }) => {
  return { user: locals.userdata };
};

/** @type {import('./$types').Actions} */
export const actions = {
  updateProfile: async ({ cookies, request }) => {
    const data = await request.formData();
    const u = cookies.get("userdata");
    let user = JSON.parse(u);
    if (
      user.firstName === data.get("name") &&
      user.lastName === data.get("lastname") &&
      user.email === data.get("email")
    ) {
      return {
        status: "error",
        res: "Los datos a acutliazar son iguales",
      };
    } else {
      const updateuser = {
        firstName: data.get("name"),
        lastName: data.get("lastname"),
        email: data.get("email"),
      };
      const res = await customerUpdate(updateuser, user.accessToken);

      if (res.body?.data?.customerUpdate) {
        console.log("updating firebase");

        try {
          //update firebase user
          const updateuserfb = {
            displayName: `${data.get("name")} ${data.get("lastname")}`,
            email: data.get("email"),
          };
          const userRef = fbAdmin
            .firestore()
            .collection("users")
            .doc(user.firebaseID);
          await userRef.update(updateuserfb);
          //update firebase user

          const userData = {
            accessToken: user.accessToken,
            shopifyID: user.id,
            firstName: updateuser.firstName,
            lastName: updateuser.lastName,
            email: updateuser.email,
            billing: user.billing,
            acceptsMarketing: user.acceptsMarketing,
            phone: user.phone,
            firebaseID: user.firebaseID,
          };

          return { ...res, userData };
        } catch (error) {
          console.log(error);
          return { error: "No se pudo actualizar" };
        }
      } else return { ...res };
    }
  },

  updatePassword: async ({ cookies, request }) => {
    const data = await request.formData();
    const u = cookies.get("userdata");
    let user = JSON.parse(u);
    if (data.get("newpassword") !== data.get("repeatpassword")) {
      return {
        status: "error",
        res: "La nueva contraseña no coincide",
      };
    } else {
      const updateuser = {
        password: data.get("newpassword"),
      };
      const res = await passwordUpdate(updateuser, user.accessToken);
      return { ...res };
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
      //update firebase user

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
  deleteUser: async ({ locals }) => {
    const arraysplit = locals.userdata.id.split("/");
    const idcustomer = arraysplit[arraysplit?.length - 1];
    const resDeletCustomer = await deleteCustomer(idcustomer);

    if (!resDeletCustomer)
      return {
        status: "Error",
        message: "Error al eliminar customer de shopify",
      };
    const resDeleteUser = await deleteUserData(locals.userdata.firebaseID);

    if (resDeleteUser)
      return {
        status: "success",
        message: "Se elimino el usuario, se cerrar la cuenta",
      };
    else
      return {
        status: "Error",
        message: "Error al eliminar Usuario de firebase",
      };
  },
  uploadImage: async ({ request }) => {
    // uploadImage: async ({ request }) => {
    const data = await request.formData();
    const file: any = data.get("file");
    const urlImage = URL.createObjectURL(file);
    console.log(urlImage);

    const remoteFilePath = "test/profile.png";

    const localFilePath = urlImage;

    // storage
    //   .bucket()
    //   .upload(localFilePath, {
    //     destination: remoteFilePath,
    //   })
    //   .then((response) => {
    //     console.log(`Archivo ${response[0].name} subido correctamente.`);
    //   })
    //   .catch((error) => {
    //     console.error(`Error al subir el archivo: ${error}`);
    //   });

    return { status: "pending" };
  },
};
