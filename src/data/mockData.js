export const queryData = [
  {
    id: 1,
    name: 'Top Customers',
    query: 'SELECT customer_name, total_purchases FROM customers ORDER BY total_purchases DESC LIMIT 5',
    data: [
      { customer_name: 'Yokesh', total_purchases: 5500 },
      { customer_name: 'Deepak krishna', total_purchases: 4800 },
      { customer_name: 'Sundar V', total_purchases: 4200 },
      { customer_name: 'Gokula krishnan', total_purchases: 3900 },
      { customer_name: 'Tharun P', total_purchases: 3500 }
    ],
    executionTime: 124
  },
  {
    id: 2,
    name: 'Product Inventory',
    query: 'SELECT product_name, stock_quantity, price FROM products WHERE stock_quantity < 50',
    data: [
      { product_name: 'Laptop', stock_quantity: 35, price: 999.99 },
      { product_name: 'Smartphone', stock_quantity: 22, price: 599.99 },
      { product_name: 'Tablet', stock_quantity: 45, price: 349.99 }
    ],
    executionTime: 87
  },
  {
    id: 3,
    name: 'Employee Departments',
    query: 'SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department',
    data: [
      { department: 'Sales', employee_count: 45 },
      { department: 'Marketing', employee_count: 30 },
      { department: 'Engineering', employee_count: 65 },
      { department: 'HR', employee_count: 15 }
    ],
    executionTime: 156
  },
  {
    id: 4,
    name: 'High Value Orders',
    query: 'SELECT order_id, customer_name, total_amount FROM orders WHERE total_amount > 1000',
    data: [
      { order_id: 'ORD001', customer_name: 'Corporate Client A', total_amount: 1500 },
      { order_id: 'ORD002', customer_name: 'Enterprise B', total_amount: 2200 },
      { order_id: 'ORD003', customer_name: 'Large Corporation C', total_amount: 1800 }
    ],
    executionTime: 92
  }
];