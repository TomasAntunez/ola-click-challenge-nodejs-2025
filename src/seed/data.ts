import { CreateOrderDto } from 'src/orders';

export const initialOrdersData: CreateOrderDto[] = [
  {
    clientName: 'John Doe',
    items: [
      { description: 'Item 1', quantity: 2, unitPrice: 10.0 },
      { description: 'Item 2', quantity: 1, unitPrice: 20.0 },
    ],
  },
  {
    clientName: 'Jane Smith',
    items: [
      { description: 'Item 3', quantity: 1, unitPrice: 30.0 },
      { description: 'Item 4', quantity: 2, unitPrice: 15.0 },
    ],
  },
  {
    clientName: 'Alice Johnson',
    items: [
      { description: 'Item 5', quantity: 3, unitPrice: 12.0 },
      { description: 'Item 6', quantity: 1, unitPrice: 25.0 },
    ],
  },
  {
    clientName: 'Bob Brown',
    items: [
      { description: 'Item 7', quantity: 2, unitPrice: 18.0 },
      { description: 'Item 8', quantity: 1, unitPrice: 22.0 },
    ],
  },
  {
    clientName: 'Charlie Green',
    items: [
      { description: 'Item 9', quantity: 1, unitPrice: 40.0 },
      { description: 'Item 10', quantity: 2, unitPrice: 10.0 },
    ],
  },
  {
    clientName: 'David Wilson',
    items: [
      { description: 'Item 11', quantity: 2, unitPrice: 28.0 },
      { description: 'Item 12', quantity: 1, unitPrice: 35.0 },
    ],
  },
  {
    clientName: 'Eve Adams',
    items: [
      { description: 'Item 13', quantity: 1, unitPrice: 50.0 },
      { description: 'Item 14', quantity: 3, unitPrice: 15.0 },
    ],
  },
  {
    clientName: 'Frank Harris',
    items: [
      { description: 'Item 15', quantity: 2, unitPrice: 20.0 },
      { description: 'Item 16', quantity: 1, unitPrice: 30.0 },
    ],
  },
  {
    clientName: 'George King',
    items: [
      { description: 'Item 17', quantity: 1, unitPrice: 45.0 },
      { description: 'Item 18', quantity: 2, unitPrice: 12.0 },
    ],
  },
  {
    clientName: 'Henry Lee',
    items: [
      { description: 'Item 19', quantity: 2, unitPrice: 25.0 },
      { description: 'Item 20', quantity: 1, unitPrice: 35.0 },
    ],
  },
];
