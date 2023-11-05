<script lang="ts">
  // import format from "date-fns/esm/format/index";
  import { format } from "date-fns";
  import es from "date-fns/locale/es/index";
  import { onMount } from "svelte";
  import * as QRCode from "qrcode";

  export let ticket: any;
  export let idticket: any = "";
  export let orderID: any;
  export let event: any;
  export let creator: any;

  let currentDomain: string = "";
  let qrImage: string | undefined;
  let url: string = "";

  $: {
    if (ticket) {
      currentDomain = window.location.origin;
      url = `${currentDomain}/scanner-qr/order/${orderID}/ticket/${ticket?.infoticketID}`;
      generateQR(url);
    }
  }

  function downloadQRCode() {
    console.log("download");
  }
  function formatDate(date: any) {
    if (date) return format(date, "MMM dd, yyyy", { locale: es });
    else return "";
  }

  function generateQR(QRtext: string) {
    const options = {
      width: 350,
      margin: 1,
    };

    QRCode.toDataURL(QRtext, options, (err: any, url: any) => {
      if (err) {
        console.error(err);
        return;
      }
      qrImage = url;
    });
  }
</script>

<div class="">
  <div class="flex justify-between items-center">
    <h1 class="text-[20px] font-[700]">E-Ticket-{idticket}</h1>
    <h5 class="text-center text-[#3D3EB4] font-[500] text-[12px]">
      ID {idticket}
    </h5>
  </div>
  <div class="w-full flex items-center justify-center">
    <img src={qrImage} alt="QR Code" class="w-[270px]" />
  </div>
  <small class="text-[#7B848C] font-[500] text-[10px]">EVENTO</small>
  <h2 class="text-black font-[700] text-[22px]">
    {event?.name}
  </h2>

  <div class="flex flex-col gap-4 mt-4">
    <div class="grid grid-cols-2">
      <div>
        <small class="text-[#7B848C] font-[500] text-[10px]">NOMBRE</small>
        <p class="text-[#232323] font-[600] text-[14px]">
          {ticket?.name}
          {ticket?.lastname}
        </p>
      </div>
      <div>
        <small class="text-[#7B848C] font-[500] text-[10px]">ORGANIZADOR</small>
        <p class="text-[#232323] font-[600] text-[14px]">
          {creator}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <small class="text-[#7B848C] font-[500] text-[10px]">EMPIEZA</small>
        <p class="text-[#232323] font-[600] text-[14px]">
          {formatDate(event?.endDate)}
        </p>
        <p class="text-[#232323] font-[600] text-[14px]">{event.startHour}</p>
      </div>
      <div>
        <small class="text-[#7B848C] font-[500] text-[10px]">FINALIZA</small>
        <p class="text-[#232323] font-[600] text-[14px]">
          {formatDate(event?.endDate)}
        </p>
        <p class="text-[#232323] font-[600] text-[14px]">{event.endHour}</p>
      </div>
    </div>

    <div class="border-dashed border-b-[2px] border-[#E5E5E5] pb-7">
      <small class="text-[#7B848C] font-[500] text-[10px]">LUGAR</small>
      <p class="text-[#232323] font-[600] text-[14px]">{event.locationName}</p>
    </div>

    <div class="grid grid-cols-2 mt-5 gap-2">
      <button
        type="button"
        class="btn btn-outline btn-primary rounded-2xl h-[3.5rem]"
        onclick="modalCodeQR.showModal()">
        <div class="flex gap-2 items-center">
          <img src="/icons/icon-printer.svg" class="w-5" alt="" srcset="" />
          <span> IMPIRMER </span>
        </div>
      </button>
      <button
        type="button"
        class="btn btn-neutral text-primary rounded-2xl h-[3.5rem]"
        on:click={downloadQRCode}>
        <div class="flex gap-2 items-center">
          <img src="/icons/icon-download.svg" class="w-5" alt="" srcset="" />
          <span> DESCARGAR </span>
        </div>
      </button>
    </div>
  </div>
</div>
