<script lang="ts">
  import { enhance } from "$app/forms";
  import { userData } from "$lib/stores/user-store";
  import { onMount } from "svelte";

  let isupload: boolean = false;
  let imagensrc: string = "";
  let haserrorimg: boolean = false;
  let fileinput: any = null;
  let previewPhoto: any = null;

  onMount(() => {
    imagensrc = $userData?.photoURL || "/images/userprofile.png";
  });

  function selectFile(e: any) {
    fileinput = e.target.files[0];
    const kb = fileinput.size;
    if (kb > 4000000) {
      haserrorimg = true;
      setTimeout(() => {
        haserrorimg = false;
      }, 4000);

      return;
    }
    previewPhoto = URL.createObjectURL(fileinput);
    imagensrc = previewPhoto;
  }

  async function deletePhoto() {
    const obj = document.getElementById("btn_close");
    if (fileinput) {
      const data = { photoURL: "" };
      const urld = `/users/${$userData.firebaseID}/profile-photo`;
      obj?.click();
      fileinput = null;
      imagensrc = "/images/userprofile.png";
    } else {
      console.log("image does not exist");
    }
  }

  //   async function uploadFile() {
  //     const urld = `/users/${$userData?.firebaseID}/profile-photo`;

  //     this.isupload = true;

  //     if (this.fileinput) {
  //       try {
  //         const storageRef = ref(this.storage, urld);
  //         const task = uploadBytesResumable(storageRef, this.fileinput);
  //         await task;
  //         const url = await getDownloadURL(storageRef);
  //         const data = { photoURL: url };

  //         this.us.updateUser(this.userCurrent?.uid as string, data);
  //         this.isupload = false;
  //         this.imagensrc = url;
  //       } catch (e: any) {
  //         console.error(e);
  //       }
  //     } else {
  //       console.log('imagen not found');
  //     }
  //   }
</script>

<div class="flex gap-[2rem]">
  {#if isupload}
    <span class="loading loading-spinner loading-lg text-primary" />
  {:else}
    <!-- on:click={() => file.click()} -->
    <section class="flex gap-4">
      <div>
        <button class="btn-circle avatar w-[7rem]">
          <div class="rounded-full w-[6rem] h-[6rem]">
            <img class="w-[8rem]" src={imagensrc} alt="usephoto" />
          </div>
        </button>
        <form
          method="POST"
          use:enhance={() => {
            return async ({ result }) => {
              console.log(result.data);
            };
          }}>
          <input
            id="file"
            name="file"
            type="file"
            class="hidden"
            accept="image/png, image/jpeg"
            on:change={selectFile} />

          <button class="" formaction="?/uploadImage"> Updload </button>
        </form>
      </div>
      <div class="flex flex-col justify-end gap-2">
        {#if haserrorimg}
          <app-alert
            errormessage="The size of the image must be less than 4MB"
            classError="alert-error" />
        {/if}
        <h3 class="imagen_title text-base">
          {$userData?.firstName}
          {$userData?.lastName}
        </h3>
        <p class="imagen_type text-base">Jpg or png. Max size: 4MB</p>
        <label
          for="my-modal-3"
          class="cursor-pointer bg-transparent hover:bg-gray-100 pt-1 w-[6rem]">
          <p class="imagen_delete">Eliminar imagen</p>
        </label>
      </div>
    </section>
  {/if}

  <input type="checkbox" id="my-modal-3" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box relative">
      <label
        id="btn_close"
        for="my-modal-3"
        class="btn btn-sm btn-circle absolute right-2 top-2">×</label>
      <h3 class="text-lg font-bold">Delete imagen</h3>
      <p class="py-4">Are you sure to delete this imagen?</p>
      <div class="flex justify-end">
        <button
          for="my-modal-3"
          class="bg-red-500 rounded hover:bg-red-400 py-2 w-[5rem]"
          on:click={deletePhoto}>
          <p class="text-white">Accept</p>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .imagen_type {
    font-family: "Segoe UI";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.4px;
    /* color: #454F48; */
  }

  .imagen_title {
    font-family: "Segoe UI";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    /* color: #000000; */
  }

  .imagen_delete {
    font-family: "Segoe UI";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 13px;
    color: #e25757;
  }

  /* .image {
    width: 8rem;
    height: 8rem;
  }

  .clip-circle {
    clip-path: circle(4rem at center);
  } */
</style>
