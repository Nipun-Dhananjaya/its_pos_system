export const saveCustomer = async (customer) => {
    try {
        const response = await fetch('http://localhost:8081/scope/customer', {
            method: 'POST',
            body: JSON.stringify(customer),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error :' + error);
    }
};
export const getAllCustomers = async () => {
    try {
        const response = await fetch(`http://localhost:8081/scope/customer?action=all`);
        const customers = await response.json();
        return customers;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateCustomer = async (customer) => {
    try {
        const response = await fetch('http://localhost:8081/scope/customer', {
            method: 'PUT',
            body: JSON.stringify(customer),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}
export const deleteCustomer = async (id) => {
    try {
        const response = await fetch(`http://localhost:8081/scope/customer?id=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}
export const nextCustomerId = async () => {
    try {
        const response = await fetch(`http://localhost:8081/scope/customer?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}