export class OrderDetail {
    constructor(date, customerId, orderId, items, total) {
        this.date = date;
        this.customerId = customerId;
        this.orderId = orderId;
        this.items = items;
        this.total = total;
    }
}