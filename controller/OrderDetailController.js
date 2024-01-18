//search orders
import {getAllOrders,deleteOrderDetail} from "../api/place_order_api.js";

$("document").ready(async function () {
    await loadAll();
});

$("#search-input").on("input", async function () {
    $("#od-table-body").empty();
    const orders = await getAllOrders();
    orders.map((order, index) => {
        if (order.date.toLowerCase().startsWith($("#search-input").val().toLowerCase()) || order.customerId.toLowerCase().startsWith($("#search-input").val().toLowerCase()) || order.orderId.toLowerCase().startsWith($("#search-input").val().toLowerCase())) {
            $("#od-table-body").append(`<tr><td>${order.date}</td><td>${order.customerId}</td><td class="orderId">${order.orderId}</td><td>${order.items}</td><td>${order.total}</td></tr>`);
        }
    })
});

//delete order detail
let order_id;
$("#od-crudButtons button").eq(0).on('click', async () => {
    const response = await deleteOrderDetail(order_id);
    await loadAll();
    if (200 == response) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'order delete successfully',
            showConfirmButton: false,
            timer: 1500
        });
    }else {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Order not deleted, Try again!',
            showConfirmButton: false,
            timer: 1500
        });
    }
});

//get id from clicked raw
$("#od-table-body").on('click', ('tr'), function () {
    order_id = $(this).find(".orderId").text();
})

//load all details
async function loadAll() {
    $("#od-table-body").empty();
    const orders = await getAllOrders();
    orders.map((order, index) => {
        $("#od-table-body").append(`<tr><td>${order.date}</td><td>${order.customerId}</td><td class="orderId">${order.orderId}</td><td>${order.items}</td><td>${order.total}</td></tr>`);
    });
}