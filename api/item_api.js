
export const sendItem = async(itemModel) => {
    try {
        const response = await fetch('http://localhost:8081/scope/item', {
            method: 'POST',
            body: JSON.stringify(itemModel),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const getAllItems = async () =>{
    try {
        const response = await fetch(`http://localhost:8081/scope/item?action=all`);
        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const deleteItem = async (item_id) => {
    try {
        const response = await fetch(`http://localhost:8081/scope/item?id=${item_id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}
export const updateItem = async (itemModel) => {

    try {
        const response = await fetch('http://localhost:8081/scope/item', {
            method: 'PUT',
            body: JSON.stringify(itemModel),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}

export const nextItemId = async () => {
    try {
        const response = await fetch(`http://localhost:8081/scope/item?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const getAllItem = async () => {
    try {
        const response = await fetch(`http://localhost:8081/scope/item?action=all`);
        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error :' + error);
    }
}