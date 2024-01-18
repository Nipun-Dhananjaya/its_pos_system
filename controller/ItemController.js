import {ItemModel} from "../model/ItemModel.js";
import {nextItemId, sendItem} from "../api/item_api.js";
import {getAllItem} from "../api/item_api.js";
import {updateItem} from "../api/item_api.js";
import {deleteItem} from "../api/item_api.js";
import {getAllItems} from "../api/item_api.js";

//item id make read only
$(document).ready(function () {
    function itemIdMakeReadonly() {
        $("#item_id").prop("readonly",true);
        $("#item-id-u").prop("readonly",true);
    }
    itemIdMakeReadonly();
    setInterval(itemIdMakeReadonly,1000);
})

//clear update inputs
function clearUpdateInputs() {
    $("#item-id-u").val("");
    $("#item-name-u").val("");
    $("#price-u").val("");
    $("#qty-u").val("");
};

//clear add inputs
function clearAddInputs() {
    $("#item_id").val("");
    $("#item-name").val("");
    $("#price").val("");
    $("#qty").val("");
};

//load all item to table
export async function loadAllItems() {
    $("#i-table-body").empty();
    const items = await getAllItem();
    items.map((item, index) => {
        let item_row = `<tr><td class="item-id">${item.itemId}</td><td class="item-name">${item.itemName}</td><td class="price">${item.price}</td><td class="qty">${item.qtv}</td></tr>`;
        $("#i-table-body").append(item_row);
    })
}

//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

// validation patterns
const namePattern = /^[A-Za-z\s\-']+$/;
const nameLengthPattern = /^[A-Za-z\s\-']{3,15}$/;
const pricePattern = /^\d+(\.\d{2})?$/;
var quantityPattern = /^\d+$/;

//save item
$("#i-add-btn").on('click', async () => {
    if (!$("#item_id").val() || !$("#item-name").val() || !$("#price").val() || !$("#qty").val()) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test($("#item-name").val())) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test($("#item-name").val())) {
        showError("Name must be 3 to 15 characters long.");
        return;
    }

    if (!pricePattern.test($("#price").val())) {
        showError("invalid price, Enter only numbers.( maximum 2 cents )");
        return;
    }

    if (!quantityPattern.test($("#qty").val())) {
        showError("Invalid quantity, Enter only whole numbers");
        return;
    }

    const response=await sendItem(new ItemModel($("#item_id").val(), $("#item-name").val(), $("#price").val(), $("#qty").val()));
    if (200 == response) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'item saved successfully',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'item not saved, please try again',
            showConfirmButton: false,
            timer: 1500,
        });
    }
    await loadAllItems();
    await clearAddInputs();
    await generateNextItemId();
});

//clicked raw set to input fields
let item_id;
$("#i-table-body").on('click', 'tr', function () {
    $("#item-id-u").val($(this).find(".item-id").text());
    $("#item-name-u").val($(this).find(".item-name").text());
    $("#price-u").val($(this).find(".price").text());
    $("#qty-u").val($(this).find(".qty").text());
    item_id = $(this).find(".item-id").text();
});

//update item
$("#i-update-btn").on('click', async () => {
    if (!$("#item-id-u").val() || !$("#item-name-u").val() || !$("#price-u").val() || !$("#qty-u").val()) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test($("#item-name-u").val())) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test($("#item-name-u").val())) {
        showError("Name must be 3 to 15 characters long.");
        return;
    }

    if (!pricePattern.test($("#price-u").val())) {
        showError("invalid price, Enter only numbers.( maximum 2 cents )");
        return;
    }

    if (!quantityPattern.test($("#qty-u").val())) {
        showError("Invalid quantity, Enter only whole numbers");
        return;
    }

    const response=await updateItem( new ItemModel($("#item-id-u").val(),$("#item-name-u").val(),$("#price-u").val(), $("#qty-u").val()));

    if (200 == status)
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Item updated successfully',
            showConfirmButton: false,
            timer: 1500,
        });

    await loadAllItems();
    await clearUpdateInputs();
});

//remove item
$("#item-crudButtons>button[type='button']").eq(2).on('click', async () => {
    const response = await deleteItem(item_id);
    if (200 == response) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'item deleted successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    }
    await loadAllItems();
});

//generate next item id
async function generateNextItemId() {
    $("#item_id").val(await nextItemId());
}

//generate next item id when click register button
$("#item-crudButtons>button").eq(0).on('click', async () => {
    await generateNextItemId();
});

//search item
$("#search-input").on("input", async function () {
    $("#i-table-body").empty();
    const items = await getAllItems();
    items.map((item, index) => {
        if(item.itemId.toLowerCase().startsWith($("#search-input").val().toLowerCase()) || item.itemName.toLowerCase().startsWith($("#search-input").val().toLowerCase())) {
            $("#i-table-body").append(`<tr><td class="item-id">${item.itemId}</td><td class="item-name">${item.itemName}</td><td class="price">${item.price}</td><td class="qty">${item.qtv}</td></tr>`);
        }
    })
});