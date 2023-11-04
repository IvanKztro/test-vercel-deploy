<script lang="ts">
  import { currentOrderStore } from "$lib/stores/cart-store.js";
  import { userData } from "$lib/stores/user-store";

  let totalTickets = 0;

  $: {
    totalTickets = 0;
    $currentOrderStore?.lineItems?.edges?.forEach((item) => {
      totalTickets += item?.node?.quantity;
    });
  }
</script>

<div>
  <h3 class="text-[#071427] text-[30px] font-[500]">Resumen de la compra</h3>
  <div class="flex justify-between">
    <p class="text-[#071427] text-[20px] font-[500]">
      Evento: <span class="font-[700]">
        {$currentOrderStore?.lineItems?.edges[0]?.node?.variant?.product
          ?.title}</span>
    </p>

    <p class="text-[20px] text-[#071427] font-[500]">
      Organizador: {$currentOrderStore?.lineItems?.edges[0]?.node?.variant
        ?.product?.vendor}
    </p>
  </div>

  <img
    src={$currentOrderStore?.lineItems?.edges[0]?.node?.variant?.product
      ?.featuredImage?.url
      ? $currentOrderStore?.lineItems?.edges[0]?.node?.variant?.product
          ?.featuredImage?.url
      : "/images/event_info.png"}
    class="w-full my-7 h-[350px] rounded-xl object-cover object-center"
    alt="" />

  <div class="grid grid-cols-2 justify-between">
    <div class="">
      <table>
        <tr>
          <th>Pedido</th>
          <td># {$currentOrderStore?.orderNumber}</td>
        </tr>
        <tr>
          <th>Fecha de Pedido</th>
          <td>
            {new Date($currentOrderStore.processedAt).toLocaleString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </td>
        </tr>
        <tr>
          <th>No de Tickets:</th>
          <td>{totalTickets}</td>
        </tr>
        <tr>
          <th>Nombre</th>
          <td>{$userData?.billing.name} {$userData?.billing.lastname}</td>
        </tr>
        <tr>
          <th>Correo Electrónico</th>
          <td>{$userData?.billing.email}</td>
        </tr>
        <tr>
          <th>Cédula</th>
          <td>{$userData?.billing.numberregister}</td>
        </tr>
      </table>
    </div>
    <div class="flex justify-end items-end">
      <table>
        <tr>
          <th>Gastos de envio</th>
          <td>$0.00</td>
        </tr>
        <tr>
          <th>Impuestos</th>
          <td>${$currentOrderStore?.totalTax?.amount}0</td>
        </tr>
        <tr>
          <th>Importe Total</th>
          <td>${$currentOrderStore?.totalPrice?.amount}0</td>
        </tr>
      </table>
    </div>
  </div>
</div>

<style>
  table {
    border-collapse: collapse;
  }

  td {
    border: none;
    padding: 5px;
    text-align: start;
    color: #232323;
    font-size: 16px;
    font-weight: 500;
    padding-left: 40px;
  }
  th {
    border: none;
    padding: 5px;
    text-align: start;
    color: #0c233f;
    font-size: 16px;
    font-weight: 800;
  }
</style>
