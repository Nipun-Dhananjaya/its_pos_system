// customer db
import {CustomerModel} from "../model/CustomerModel.js";
import {saveCustomer} from "../api/customer_api.js";
import {getAllCustomers} from "../api/customer_api.js";
import {nextCustomerId} from "../api/customer_api.js";
import {updateCustomer} from "../api/customer_api.js";
import {deleteCustomer} from "../api/customer_api.js";

//customer id make read only
$(document).ready(function () {
    function customerIdMakeReadonly() {
        $("#customer_id").prop("readonly",true);
        $("#customer-id-u").prop("readonly",true);
    }
    customerIdMakeReadonly();
    setInterval(customerIdMakeReadonly,1000);
})

// clear inputs
function clearAddInputs() {
    $("#customer_id").val("");
    $("#customer_name").val("");
    $("#customer-nic").val("");
    $("#contact").val("");
}

//clear update inputs
function clearUpdateInputs() {
    $("#customer-id-u").val("");
    $("#customer-name-u").val("");
    $("#customer-nic-u").val("");
    $("#contact-u").val("");
}

// load all customers to table
export async function loadAllCustomers() {
    const customers = await getAllCustomers();
    $("#c-tbl-body").empty();
    customers.map((item, index) => {
        let customer =
            `<tr><td class="customer-id">${item.customerId}</td><td class="customer-name">${item.customerName}</td><td class="nic">${item.nic}</td><td class="contact">${"0" + item.contact}</td></td></tr>`
        $("#c-tbl-body").append(customer);
    })
}

//regex pattern
const namePattern = /^[A-Za-z\s\-']+$/;
const nameLengthPattern = /^[A-Za-z\s\-']{3,20}$/;
const nicPattern = /^\d{12}(v)?$/;
const phoneNumberPattern = /^(07[0125678]\d{7})$/;
// /^(?:\+1)?\d{10}$/;

//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

//save customer
$("#c-add_btn").on('click', async () => {
    const customerId = $("#customer_id").val();
    const customerName = $("#customer_name").val();
    const customerNic = $("#customer-nic").val();
    const contact = $("#contact").val();

    if (!customerId || !customerName || !customerNic || !contact) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(customerName)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(customerName)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    if (!nicPattern.test(customerNic)) {
        showError("Enter a valid NIC number (e.g., 200224000741 or 200224000741v).");
        return;
    }
    const customers = await getAllCustomers();
    if(-1  <  customers.findIndex(item => item.nic === $("#customer-nic").val())) {
        showError("this nic all ready exit...");
        return;
    }

    if (!phoneNumberPattern.test(contact)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }

    const status=await saveCustomer(new CustomerModel(customerId, customerName, customerNic, contact));

    if (status === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Customer saved successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    } else {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Customer not saved, please try again',
            showConfirmButton: false,
            timer: 1500,
        });
    }

    await clearAddInputs();
    await loadAllCustomers();
    await generateNextCustomerId();
});

// clicked raw set to input fields
let cus_id;
$("#c-tbl-body").on('click', ("tr"), function () {
    $("#customer-id-u").val($(this).find(".customer-id").text());
    $("#customer-name-u").val($(this).find(".customer-name").text());
    $("#customer-nic-u").val($(this).find(".nic").text());
    $("#contact-u").val($(this).find(".contact").text());
    cus_id = $(this).find(".customer-id").text();
});

//update customer
$("#c-update-btn").on('click', async () => {
    const customer_id = $("#customer-id-u").val();
    const customer_name = $("#customer-name-u").val();
    const customer_nic = $("#customer-nic-u").val();
    const contact = $("#contact-u").val();

    if (!customer_id || !customer_name || !customer_nic || !contact) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(customer_name)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(customer_name)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    if (!nicPattern.test(customer_nic)) {
        showError("Enter a valid NIC number (e.g., 200224000741 or 200224000741v).");
        return;
    }
    const customers = await getAllCustomers();
    if (!phoneNumberPattern.test(contact)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }
    let index=customers.findIndex(customer => customer.nic === $("#customer-nic-u").val());
    if (-1 < index) {
        if (customers[index].customer_id != customer_id) {
            showError("this nic all ready exit...");
            return;
        }
    }
    const status = await updateCustomer(new CustomerModel(customer_id, customer_name, customer_nic, contact));

    if (200 == status)
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Customer updated successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    await loadAllCustomers();
    clearUpdateInputs()
});

// delete customer
$("#c-crudButtons>button[type='button']").eq(2).on('click', async () => {
    const response = await deleteCustomer(cus_id);
    if (200 == response) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Customer deleted successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    }
    await loadAllCustomers();
});

//generate next customer id
async function generateNextCustomerId() {
    const nextId = await nextCustomerId();
    $("#customer_id").val(nextId);
}

//generate next customer id when click register button
$("#c-crudButtons>button").eq(0).on('click', async () => {
    await generateNextCustomerId();
});

//search customer
$("#search-input").on("input", async function () {
    $("#c-tbl-body").empty();
    const customers = await getAllCustomers();
    customers.map((customer, index) => {
        if (customer.customerId.toLowerCase().startsWith($("#search-input").val().toLowerCase()) || customer.customerName.toLowerCase().startsWith($("#search-input").val().toLowerCase()) || customer.nic.toLowerCase().startsWith($("#search-input").val().toLowerCase())) {
            $("#c-tbl-body").append(`<tr><td class="customer-id">${customer.customerId}</td><td class="customer-name">${customer.customerName}</td><td class="nic">${customer.nic}</td><td class="contact">${customer.contact}</td></td></tr>`);
        }
    })
});
